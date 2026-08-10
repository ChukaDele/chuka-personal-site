"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { audioAssetById, audioManifest, type AudioAssetId } from "../../content/audio-manifest";

export type SoundBus = "master" | "ambient" | "scroll" | "interaction";
export type AmbientSection = "hero" | "work" | "practice" | "library" | "correspondence";
export type ChapterCue = "work" | "practice" | "library" | "correspondence" | "page";
export type ScrollCue = "reveal" | "threshold" | "construction" | "completion";
export type InteractionCue = "press" | "resource" | "toggle" | "video-open" | "video-close";
export type BookCue = "lift" | "open" | "close";

type SoundContextValue = {
  enabled: boolean;
  unlocked: boolean;
  preferenceReady: boolean;
  chooseSound: (enabled: boolean, entrance?: boolean) => void;
  setAmbientSection: (section: AmbientSection | null) => void;
  playChapterCue: (chapter: ChapterCue) => void;
  playScrollCue: (cue: ScrollCue) => void;
  playInteractionCue: (cue?: InteractionCue) => void;
  playBookCue: (cue?: BookCue) => void;
  setVideoActive: (active: boolean) => void;
  setBusLevel: (bus: SoundBus, level: number) => void;
  /** Compatibility bridge while existing callers migrate to the specific APIs. */
  playCue: (cue: "chapter" | "construction" | "folio") => void;
};

type AudioGraph = {
  master: GainNode;
  ambient: GainNode;
  scroll: GainNode;
  interaction: GainNode;
};

type ActiveAmbient = {
  source: AudioBufferSourceNode;
  gain: GainNode;
  section: AmbientSection;
};

const SoundContext = createContext<SoundContextValue | null>(null);
const preferenceKey = "atelier-sound-preference";

const defaultLevels: Record<SoundBus, number> = {
  master: 0.72,
  ambient: 0.13,
  scroll: 0.22,
  interaction: 0.26,
};

const ambientProfiles: Record<AmbientSection, { gain: number; rate: number; cutoff: number }> = {
  hero: { gain: 0.7, rate: 0.985, cutoff: 720 },
  work: { gain: 0.88, rate: 1, cutoff: 920 },
  practice: { gain: 0.82, rate: 0.975, cutoff: 680 },
  library: { gain: 0.64, rate: 0.96, cutoff: 560 },
  correspondence: { gain: 0.52, rate: 0.945, cutoff: 480 },
};

const chapterRates: Record<ChapterCue, number> = {
  work: 0.92,
  practice: 1,
  library: 0.82,
  correspondence: 0.74,
  page: 0.88,
};

function clampLevel(level: number) {
  return Math.min(1, Math.max(0, level));
}

function fadeGain(gain: GainNode, value: number, duration = 0.04) {
  const now = gain.context.currentTime;
  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(Math.max(0, gain.gain.value), now);
  gain.gain.linearRampToValueAtTime(Math.max(0, value), now + duration);
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [preferenceReady, setPreferenceReady] = useState(false);
  const contextRef = useRef<AudioContext | null>(null);
  const graphRef = useRef<AudioGraph | null>(null);
  const enabledRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const videoActiveRef = useRef(false);
  const desiredAmbientRef = useRef<AmbientSection | null>(null);
  const activeAmbientRef = useRef<ActiveAmbient | null>(null);
  const buffersRef = useRef(new Map<AudioAssetId, AudioBuffer>());
  const bufferPromisesRef = useRef(new Map<AudioAssetId, Promise<AudioBuffer | null>>());
  const activeSourcesRef = useRef<Record<"scroll" | "interaction", Set<AudioBufferSourceNode>>>(
    { scroll: new Set(), interaction: new Set() },
  );
  const lastCueRef = useRef(new Map<string, number>());
  const busLevelsRef = useRef({ ...defaultLevels });

  const createGraph = useCallback((context: AudioContext) => {
    if (graphRef.current) return graphRef.current;

    const master = context.createGain();
    const ambient = context.createGain();
    const scroll = context.createGain();
    const interaction = context.createGain();
    const limiter = context.createDynamicsCompressor();

    master.gain.value = busLevelsRef.current.master;
    ambient.gain.value = videoActiveRef.current
      ? busLevelsRef.current.ambient * 0.18
      : busLevelsRef.current.ambient;
    scroll.gain.value = busLevelsRef.current.scroll;
    interaction.gain.value = busLevelsRef.current.interaction;
    limiter.threshold.value = -24;
    limiter.knee.value = 16;
    limiter.ratio.value = 6;
    limiter.attack.value = 0.006;
    limiter.release.value = 0.2;

    ambient.connect(master);
    scroll.connect(master);
    interaction.connect(master);
    master.connect(limiter).connect(context.destination);
    graphRef.current = { master, ambient, scroll, interaction };
    return graphRef.current;
  }, []);

  const ensureContext = useCallback(() => {
    let context = contextRef.current;
    if (!context || context.state === "closed") {
      context = new AudioContext({ latencyHint: "interactive" });
      contextRef.current = context;
      createGraph(context);
    }
    if (context.state === "suspended") void context.resume();
    setUnlocked(true);
    return context;
  }, [createGraph]);

  const loadBuffer = useCallback(async (id: AudioAssetId, context: AudioContext) => {
    const existing = buffersRef.current.get(id);
    if (existing) return existing;

    const inFlight = bufferPromisesRef.current.get(id);
    if (inFlight) return inFlight;

    const promise = fetch(audioAssetById[id].localAsset)
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load sound asset: ${id}`);
        return response.arrayBuffer();
      })
      .then((data) => context.decodeAudioData(data))
      .then((buffer) => {
        buffersRef.current.set(id, buffer);
        return buffer;
      })
      .catch(() => null)
      .finally(() => bufferPromisesRef.current.delete(id));

    bufferPromisesRef.current.set(id, promise);
    return promise;
  }, []);

  const preloadAudio = useCallback((context: AudioContext) => {
    for (const asset of audioManifest) {
      if (asset.id !== "atelier-room") void loadBuffer(asset.id, context);
    }
  }, [loadBuffer]);

  const stopTransientSources = useCallback(() => {
    for (const sources of Object.values(activeSourcesRef.current)) {
      for (const source of sources) {
        try { source.stop(); } catch { /* The source already ended. */ }
      }
      sources.clear();
    }
  }, []);

  const stopAmbient = useCallback((duration = 0.12) => {
    const active = activeAmbientRef.current;
    if (!active) return;
    activeAmbientRef.current = null;
    fadeGain(active.gain, 0, duration);
    window.setTimeout(() => {
      try { active.source.stop(); } catch { /* The source already ended. */ }
    }, duration * 1000 + 24);
  }, []);

  const startAmbient = useCallback(async (section: AmbientSection) => {
    if (!enabledRef.current || document.hidden) return;
    const context = contextRef.current;
    if (!context || context.state !== "running") return;
    const graph = graphRef.current;
    if (!graph) return;
    const buffer = await loadBuffer("atelier-room", context);
    if (!buffer || !enabledRef.current || desiredAmbientRef.current !== section || document.hidden) return;

    const current = activeAmbientRef.current;
    const profile = ambientProfiles[section];
    const motionScale = reducedMotionRef.current ? 0.68 : 1;
    if (current?.section === section) {
      fadeGain(current.gain, profile.gain * motionScale, 0.5);
      return;
    }

    stopAmbient(0.65);
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer;
    source.loop = true;
    source.playbackRate.value = profile.rate;
    filter.type = "lowpass";
    filter.frequency.value = profile.cutoff;
    gain.gain.value = 0.0001;
    source.connect(filter).connect(gain).connect(graph.ambient);
    source.start();
    activeAmbientRef.current = { source, gain, section };
    fadeGain(gain, profile.gain * motionScale, 1.2);
  }, [loadBuffer, stopAmbient]);

  const playAsset = useCallback(async (
    id: AudioAssetId,
    bus: "scroll" | "interaction",
    options: { gain: number; rate?: number; cooldown: number; key: string; maxSources: number },
  ) => {
    if (!enabledRef.current || document.hidden) return;
    const now = performance.now();
    const last = lastCueRef.current.get(options.key) ?? 0;
    if (now - last < options.cooldown) return;
    lastCueRef.current.set(options.key, now);

    const context = contextRef.current;
    if (!context || context.state !== "running") return;
    const graph = graphRef.current;
    const buffer = await loadBuffer(id, context);
    if (!buffer || !graph || !enabledRef.current || document.hidden) return;

    const active = activeSourcesRef.current[bus];
    while (active.size >= options.maxSources) {
      const oldest = active.values().next().value as AudioBufferSourceNode | undefined;
      if (!oldest) break;
      active.delete(oldest);
      try { oldest.stop(); } catch { /* The source already ended. */ }
    }

    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    source.playbackRate.value = options.rate ?? 1;
    gain.gain.value = options.gain;
    source.connect(gain).connect(graph[bus]);
    source.addEventListener("ended", () => active.delete(source), { once: true });
    active.add(source);
    source.start();
  }, [loadBuffer]);

  const setAmbientSection = useCallback((section: AmbientSection | null) => {
    desiredAmbientRef.current = section;
    if (!section) stopAmbient(0.55);
    else void startAmbient(section);
  }, [startAmbient, stopAmbient]);

  const playChapterCue = useCallback((chapter: ChapterCue) => {
    void playAsset("chapter-mark", "interaction", {
      gain: 0.72,
      rate: chapterRates[chapter],
      cooldown: 900,
      key: `chapter:${chapter}`,
      maxSources: 2,
    });
  }, [playAsset]);

  const playScrollCue = useCallback((cue: ScrollCue) => {
    if (reducedMotionRef.current) return;
    const rates: Record<ScrollCue, number> = { reveal: 0.94, threshold: 1, construction: 1.08, completion: 0.86 };
    void playAsset("paper-threshold", "scroll", {
      gain: 0.58,
      rate: rates[cue],
      cooldown: 700,
      key: "scroll",
      maxSources: 1,
    });
  }, [playAsset]);

  const playInteractionCue = useCallback((cue: InteractionCue = "press") => {
    const rates: Record<InteractionCue, number> = {
      press: 1,
      resource: 1.08,
      toggle: 0.9,
      "video-open": 0.82,
      "video-close": 0.72,
    };
    void playAsset("interaction-press", "interaction", {
      gain: 0.62,
      rate: rates[cue],
      cooldown: 120,
      key: `interaction:${cue}`,
      maxSources: 3,
    });
  }, [playAsset]);

  const playBookCue = useCallback((cue: BookCue = "lift") => {
    const rates: Record<BookCue, number> = { lift: 1.08, open: 0.94, close: 0.78 };
    void playAsset("book-handle", "interaction", {
      gain: 0.66,
      rate: rates[cue],
      cooldown: 320,
      key: "book",
      maxSources: 2,
    });
  }, [playAsset]);

  const setVideoActive = useCallback((active: boolean) => {
    videoActiveRef.current = active;
    const ambientBus = graphRef.current?.ambient;
    if (!ambientBus) return;
    const level = active ? defaultLevels.ambient * 0.18 : busLevelsRef.current.ambient;
    fadeGain(ambientBus, level, active ? 0.18 : 0.8);
  }, []);

  const setBusLevel = useCallback((bus: SoundBus, level: number) => {
    const next = clampLevel(level);
    busLevelsRef.current[bus] = next;
    const node = graphRef.current?.[bus];
    if (!node) return;
    if (bus === "ambient" && videoActiveRef.current) return;
    fadeGain(node, next, 0.08);
  }, []);

  const chooseSound = useCallback((nextEnabled: boolean, entrance = false) => {
    window.localStorage.setItem(preferenceKey, nextEnabled ? "sound" : "quiet");
    enabledRef.current = nextEnabled;
    setEnabled(nextEnabled);

    if (!nextEnabled) {
      const context = contextRef.current;
      const master = graphRef.current?.master;
      if (master) fadeGain(master, 0, 0.025);
      stopAmbient(0.025);
      stopTransientSources();
      if (context) window.setTimeout(() => void context.suspend(), 34);
      return;
    }

    const context = ensureContext();
    const master = graphRef.current?.master;
    if (master) fadeGain(master, busLevelsRef.current.master, 0.06);
    preloadAudio(context);
    if (entrance) playChapterCue("page");
    if (desiredAmbientRef.current) void startAmbient(desiredAmbientRef.current);
  }, [ensureContext, playChapterCue, preloadAudio, startAmbient, stopAmbient, stopTransientSources]);

  const playCue = useCallback((cue: "chapter" | "construction" | "folio") => {
    if (cue === "chapter") playChapterCue("page");
    else if (cue === "construction") playScrollCue("construction");
    else playInteractionCue("resource");
  }, [playChapterCue, playInteractionCue, playScrollCue]);

  useEffect(() => {
    enabledRef.current = window.localStorage.getItem(preferenceKey) === "sound";
    setEnabled(enabledRef.current);
    setPreferenceReady(true);

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => { reducedMotionRef.current = media.matches; };
    syncMotionPreference();
    media.addEventListener("change", syncMotionPreference);
    return () => media.removeEventListener("change", syncMotionPreference);
  }, []);

  useEffect(() => {
    if (!preferenceReady || !enabled) return;
    const unlockOnReturnVisit = () => {
      if (!enabledRef.current) return;
      const context = ensureContext();
      preloadAudio(context);
      if (desiredAmbientRef.current) void startAmbient(desiredAmbientRef.current);
    };
    document.addEventListener("pointerdown", unlockOnReturnVisit, { once: true, capture: true });
    document.addEventListener("keydown", unlockOnReturnVisit, { once: true, capture: true });
    return () => {
      document.removeEventListener("pointerdown", unlockOnReturnVisit, true);
      document.removeEventListener("keydown", unlockOnReturnVisit, true);
    };
  }, [enabled, ensureContext, preferenceReady, preloadAudio, startAmbient]);

  useEffect(() => {
    const handleVisibility = () => {
      const context = contextRef.current;
      if (!context) return;
      if (document.hidden) {
        if (graphRef.current?.master) fadeGain(graphRef.current.master, 0, 0.04);
        window.setTimeout(() => void context.suspend(), 55);
      } else if (enabledRef.current) {
        void context.resume().then(() => {
          if (graphRef.current?.master) fadeGain(graphRef.current.master, busLevelsRef.current.master, 0.12);
          if (desiredAmbientRef.current) void startAmbient(desiredAmbientRef.current);
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [startAmbient]);

  useEffect(() => () => {
    stopTransientSources();
    stopAmbient(0);
    void contextRef.current?.close();
  }, [stopAmbient, stopTransientSources]);

  const value = useMemo<SoundContextValue>(() => ({
    enabled,
    unlocked,
    preferenceReady,
    chooseSound,
    setAmbientSection,
    playChapterCue,
    playScrollCue,
    playInteractionCue,
    playBookCue,
    setVideoActive,
    setBusLevel,
    playCue,
  }), [
    chooseSound,
    enabled,
    playBookCue,
    playChapterCue,
    playCue,
    playInteractionCue,
    playScrollCue,
    preferenceReady,
    setAmbientSection,
    setBusLevel,
    setVideoActive,
    unlocked,
  ]);

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const value = useContext(SoundContext);
  if (!value) throw new Error("useSound must be used inside SoundProvider");
  return value;
}
