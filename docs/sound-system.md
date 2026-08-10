# Optional sound system

## Contract

- Audible sound starts only after a user gesture.
- The first meaningful visit integrates the choice into the atelier preloader: `Enter with sound` or `Enter quietly`.
- The preference persists in `localStorage` and remains reversible through the global sound toggle.
- Reduced-motion users bypass the entrance gate. Sound remains off until they explicitly enable it.
- Audio suspends while the document is hidden and closes during provider teardown.
- No hover sounds, spoken audio, fake foley files or autoplaying ambience ship in Phase 2.

## Palette

The current palette uses small Web Audio synthesis cues instead of downloaded media:

- entrance: two restrained tones that resolve together;
- chapter: a low, short transition cue for internal route changes;
- construction: a light mechanical cue when sound is enabled;
- folio: reserved for deliberate media-state changes.

The cues are intentionally sparse and low gain. They add no network weight. A future recorded palette may replace them only after loudness, licensing, compression and device QA.

## Ownership

- `components/sound/SoundProvider.tsx`: preference, Web Audio lifecycle, cue synthesis and document visibility.
- `components/sound/SoundToggle.tsx`: global reversible control.
- `components/common/Preloader.tsx`: first-visit entrance choice.
- `app/globals.css`: preloader and toggle presentation, pointer gating and reduced-motion behavior.
