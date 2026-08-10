"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type SoundContextValue = {
  enabled: boolean;
  preferenceReady: boolean;
  chooseSound: (enabled: boolean, entrance?: boolean) => void;
  playCue: (cue: "chapter" | "construction" | "folio") => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);
const preferenceKey = "atelier-sound-preference";

function shapeGain(gain: GainNode, context: AudioContext, peak: number, duration: number) {
  const now = context.currentTime;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [preferenceReady, setPreferenceReady] = useState(false);
  const contextRef = useRef<AudioContext | null>(null);
  const lastCueRef = useRef(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setEnabled(window.localStorage.getItem(preferenceKey) === "sound");
      setPreferenceReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const ensureContext = useCallback(() => {
    const AudioContextClass = window.AudioContext;
    if (!contextRef.current || contextRef.current.state === "closed") {
      contextRef.current = new AudioContextClass();
    }
    if (contextRef.current.state === "suspended") void contextRef.current.resume();
    return contextRef.current;
  }, []);

  const playCue = useCallback((cue: "chapter" | "construction" | "folio") => {
    if (!enabled) return;
    const now = performance.now();
    if (now - lastCueRef.current < 380) return;
    lastCueRef.current = now;
    const context = ensureContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();
    const settings = {
      chapter: { frequency: 164, peak: 0.026, duration: 0.32, type: "sine" as OscillatorType },
      construction: { frequency: 246, peak: 0.018, duration: 0.19, type: "triangle" as OscillatorType },
      folio: { frequency: 118, peak: 0.022, duration: 0.26, type: "sine" as OscillatorType },
    }[cue];
    oscillator.type = settings.type;
    oscillator.frequency.setValueAtTime(settings.frequency, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(settings.frequency * 1.08, context.currentTime + settings.duration);
    filter.type = "lowpass";
    filter.frequency.value = 720;
    shapeGain(gain, context, settings.peak, settings.duration);
    oscillator.connect(filter).connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + settings.duration + 0.03);
  }, [enabled, ensureContext]);

  const chooseSound = useCallback((nextEnabled: boolean, entrance = false) => {
    window.localStorage.setItem(preferenceKey, nextEnabled ? "sound" : "quiet");
    setEnabled(nextEnabled);
    if (!nextEnabled) {
      void contextRef.current?.suspend();
      return;
    }
    const context = ensureContext();
    if (entrance) {
      const first = context.createOscillator();
      const second = context.createOscillator();
      const gain = context.createGain();
      first.type = "sine";
      second.type = "triangle";
      first.frequency.value = 146.83;
      second.frequency.value = 220;
      second.detune.value = -7;
      shapeGain(gain, context, 0.035, 0.72);
      first.connect(gain);
      second.connect(gain);
      gain.connect(context.destination);
      first.start(); second.start();
      first.stop(context.currentTime + 0.75); second.stop(context.currentTime + 0.75);
    }
  }, [ensureContext]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) void contextRef.current?.suspend();
      else if (enabled) void contextRef.current?.resume();
    };
    const handleInternalNavigation = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest("a[href]");
      const href = anchor?.getAttribute("href");
      if (href?.startsWith("/") && !href.startsWith("/#")) playCue("chapter");
    };
    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("click", handleInternalNavigation, { capture: true });
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("click", handleInternalNavigation, true);
    };
  }, [enabled, playCue]);

  useEffect(() => () => {
    void contextRef.current?.close();
  }, []);

  const value = useMemo(() => ({ enabled, preferenceReady, chooseSound, playCue }), [enabled, preferenceReady, chooseSound, playCue]);
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const value = useContext(SoundContext);
  if (!value) throw new Error("useSound must be used inside SoundProvider");
  return value;
}
