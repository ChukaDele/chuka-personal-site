# Consent-based sound system

## Contract

- No audible sound starts before a user gesture.
- `Enter with sound` creates and resumes the `AudioContext` inside the click handler. `Enter quietly` does not create an audio context.
- The choice persists under `atelier-sound-preference` and remains reversible through the global toggle.
- A returning sound-enabled visitor unlocks audio on their next pointer or keyboard gesture. The browser is never asked to bypass autoplay policy.
- The global toggle fades the master bus to silence in 25 ms, stops active sources, then suspends the context.
- A hidden tab fades and suspends the context. A visible tab resumes only when sound remains enabled.
- Reduced-motion preference removes scroll-synchronised cues and lowers the ambient profile. It does not silently override an explicit sound choice.
- Video state ducks the ambient bus to 18 percent and restores it over 800 ms.

## Signal graph

```text
ambient source -> ambient bus ----+
scroll cues ----> scroll bus -----+-> master bus -> compressor/limiter -> output
chapter/clicks --> interaction bus+
```

Default linear bus gains are conservative: master `0.72`, ambient `0.13`, scroll `0.22`, interaction `0.26`. A compressor at the output catches coincident transients. The provider also caps active sources, applies cue-specific cooldowns and replaces older scroll cues, so rapid input cannot create an unbounded stack.

The provider downloads and decodes the four small cues only after sound is unlocked. The larger ambient file is fetched lazily when an ambient section is requested after consent. The five AAC assets total about 600 KB. No third-party audio streams at runtime.

## Integration API

`useSound()` exposes deliberate event calls. Page and motion owners should call these from section boundaries or explicit user actions, not from continuous scroll callbacks.

```ts
const {
  setAmbientSection,
  playChapterCue,
  playScrollCue,
  playInteractionCue,
  playBookCue,
  setVideoActive,
} = useSound();
```

- Major section entry: `setAmbientSection("work")` and `playChapterCue("work")`.
- Meaningful GSAP threshold: `playScrollCue("threshold")`. Reverse crossings may call it again because the provider enforces a 700 ms cooldown and a single scroll source.
- Resource or button activation: `playInteractionCue("resource")` or `playInteractionCue("press")`.
- Video open and close: call `setVideoActive(true)` with `playInteractionCue("video-open")`, then restore both on close.
- Book handling: `playBookCue("lift" | "open" | "close")` on intentional focus, tap or open state. Do not bind it to pointer movement.
- Section exit or a page without ambience: `setAmbientSection(null)`.

The former `playCue("chapter" | "construction" | "folio")` remains as a compatibility bridge. New work should use the specific APIs.

## Asset provenance

All shipped assets are original procedural renders made for this website from FFmpeg noise and sine generators. They contain no third-party recording, sample, song or performance. `content/audio-manifest.ts` is the canonical machine-readable record of source, creator, licence, attribution requirement, original URL, local asset and usage.

The ambient file is 48 seconds. Its built-in 2.5 second entrance and exit create a natural breath at the loop boundary. Cue files range from 180 to 880 ms. AAC was selected for current Safari, Chromium and Firefox playback through `decodeAudioData`.

Measured source peaks range from -2.2 to -0.5 dBFS before bus attenuation. The lowest theoretical output headroom is more than 17 dB before the final compressor, and typical ambient output has more than 23 dB of attenuation.
