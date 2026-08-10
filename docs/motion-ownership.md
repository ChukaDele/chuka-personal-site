# Motion ownership

## Phase 2 additions

- Practice blueprint state: `components/home/PracticeBlueprint.tsx` owns semantic SVG layers; `components/home/HomeMotion.tsx` is the sole desktop scroll-progress owner; `PracticeBlueprint.module.css` owns the complete static tablet/mobile/reduced state.
- Project media plates: `components/home/ProjectMediaPlate.tsx` owns source-type rendering; its scoped CSS owns static registration treatments. No duplicate project-number transform is permitted inside the media plate.
- Site sound is separate from visual motion. `components/sound/SoundProvider.tsx` owns AudioContext state and cues; `Preloader.tsx` owns the first-visit gesture.

One system owns each transform or visibility state.

| State | Canonical owner | Static and reduced-motion outcome |
| --- | --- | --- |
| Preloader visibility | `components/common/Preloader.tsx` plus `.preloader` CSS | Useful page content is rendered underneath; repeat and reduced-motion visits skip the introduction. |
| Hero artwork drift | `components/home/HomeMotion.tsx` GSAP context | Artwork is fully visible at its authored crop. |
| Hero system nodes and handoff line | `components/home/HomeMotion.tsx` GSAP context | CSS shows the resolved system. |
| Selected Work folio stacking | CSS sticky geometry in `app/globals.css` | Tablet and mobile reset to normal document flow. |
| Practice pin, axis and stage progress | `components/home/HomeMotion.tsx` GSAP context | All stages and drawing geometry are visible in a single static composition. |
| Correspondence grid and copy resolution | `components/home/HomeMotion.tsx` GSAP context | The final grid and contact statement are fully resolved. |
| 404 fragment assembly | `components/common/MissingFolio.tsx` state plus CSS | Fragments remain legible; no motion is required to use either route. |
| Optional hero video playback | Native `<video>` only if a Flow output passes review | Poster image is the canonical visual on mobile, reduced motion, failure or unsupported codecs. |

No other component may write transforms to these nodes. Diagnose computed CSS, GSAP inline styles, ScrollTrigger state and video state before changing motion code.
