# Playground retro draft — 2026-10-09

Owner-directed replacement of both rejected interactions on
`codex/playground-draft-20261009`, based on `8b64401`. One source writer; existing
Major workshop retained, no attach/admission/nested lease/delegation.
The dated BORROW decision in `prior-art-decisions.md` was written before source
edits, after reading the full brief, four staged project skills and references.

## Result

- Loopline: 18×18 Snake, one accepted turn per tick, self/wall collision, paired
  labelled A/B portals preserving direction. Each third mark selects two new
  cells outside snake, food and the old pair. When fewer than two replacements
  fit, retain the pair (explained in the rules). Finite free-cell food selection,
  legal departing tail, board-clear win, speed bounded from 210 to 100ms/tick.
- Ricochet: 40 bricks, three lives, paddle-position aiming, ten points per brick.
  Copper + bricks clear orthogonal neighbours, recursively triggering other +
  bricks once each. Circle/rectangle contact normals include corners; steps are
  at most 1/240s, elapsed time capped at 50ms. Lost lives pause for explicit serve.
- Focused keyboard, Snake direction buttons, paddle drag and held buttons.
  Input clears on cancellation/pause/blur; no global movement keys. One active
  game, explicit start/resume/replay, DOM score/status, guarded device best.
  Offscreen, focus loss, hidden tab, pagehide and preference changes pause;
  page return never resumes. Teardown aborts listeners and disconnects observers.
- Asymmetric paper/ink/copper arcade; existing fonts, 44px targets, no decorative
  animation. Games only move after explicit action, including reduced motion.
  No-JS copy, rules and media remain. No new asset, dependency or audio.
- Both approved clips, posters, credits and shared silent visible video policy
  preserved. Draft remains noindex, excluded from navigation and sitemap.

## Focused evidence

`node --test tests/playground-lifecycle.test.mjs tests/playground-logic.test.mjs tests/playground.test.mjs`

18 tests passed. Includes real production adapter events with native EventTarget
and controlled rAF (no public test hooks), reversal/portal/tail/crowding/scoring,
charged chains, physical collisions/win/lives/replay, single-game ownership,
all pause paths, pointer cancellation, blocked storage, draft indexing policy,
and exact SHA-256/byte-count receipt checks for both clips and JPEG posters.

`node --check` passed for all three Playground scripts and `src/data/routes.js`.
Astro page parsed with the installed `@astrojs/compiler-rs`: zero diagnostics.
`git diff --check` passed. Retired control/copy search found only the intentional
negative regression assertions, no remaining controls or retired route copy.

Changed files: `src/pages/playground.astro`, `src/data/routes.js`,
`src/scripts/playground.js`, `src/scripts/playground-logic.js`,
`src/scripts/playground-session.js`, `tests/playground.test.mjs`,
`tests/playground-logic.test.mjs`, `tests/playground-lifecycle.test.mjs`,
`docs/prior-art-decisions.md`, and this handoff.

## Limits / controller review

No build, serve, browser session, push, merge or deployment was run. Source and
logic evidence is not visual or device acceptance. Controller owns responsive,
touch-device, assistive-technology and preview review. Canvas has labelled rules
and event-level DOM state; it is a spatial visual game, not a complete nonvisual
alternative. Physics intentionally discards excess elapsed time after a stall;
there is no catch-up burst. Portal replacement can stay put on a crowded board.
No claims of equivalence to an existing game product or production readiness.
