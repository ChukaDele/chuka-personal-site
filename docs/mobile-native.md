# Mobile native feedback

Source implementation only; controller owns builds, browser checks and hardware validation. Guidance: copied `.launch-input/mobile-guidance/{mobile-native,break-ui,CATALOG}.md`. Owner explicitly authorized fixes and retained document overscroll and one dark theme color.

## Changes and inferred failure modes

- `src/styles/global.css`: transparent root tap highlight and 100% text-size adjustment; manipulation on links/buttons/role buttons; selection and iOS callout suppression only on control labels. Prose, work content and email remain selectable. An active underline supplies immediate brand/Menu/plain-link feedback alongside existing button/row press motion. Root overscroll stays auto; canvas retains `pan-y pinch-zoom`.
- Three closing `.write` height declarations now use stable `svh`, including earlier rules in the cascade. Mobile's final content-height layout remains intact.
- Mobile email was nowrap with an absolute single-line SVG underline: long addresses could overflow. It now wraps anywhere within 100%, with native decoration on every line. No truncation or pointer overlays added.
- Work names/compound words could exceed narrow columns; shared work text wraps and names have 1.05 line-height for stacked diacritics. These are source-inferred risks, not visually reproduced findings.

## Reusable preview fixture

Controller: opt in with `UI_STRESS_QA=true npm run build`, then visit `/__qa/mobile/demo.html`, `/__qa/mobile/worst.html`, `/__qa/mobile/empty.html`, `/__qa/mobile/one.html` on the preview. The **Demo data / Worst case / Zero works / One work** control uses persistent static URLs and no custom transition. It is sticky in flow to avoid covering the final contact content; shared menu/dialog layers sit above it.

`astro.config.mjs` conditionally injects the route from outside `src/pages`. A plain build without `UI_STRESS_QA=true` has no QA route, fixture imports or toggle. Every fixture page passes `noindex` even when indexing is otherwise enabled. Controller must verify plain-build output excludes `__qa` and synthetic strings, and opt-in output has robots noindex. Do not deploy the opt-in build to production; it may be deployed only to an isolated noindex preview.

`Works.astro` extracts the original home rows and work index cards; those public pages and the fixture use the same renderer. `Write.astro` and `End.astro` accept contact props defaulting to the authored site data. No public data or SEO metadata was edited. Fixtures do not enter structured data, navigation identity, work detail pages or form submission settings.

| Rendered field / source | Type / limit | Fixture coverage |
| --- | --- | --- |
| `works[].id` → href | string, unbounded; required | Existing valid destinations; fixtures are not new case studies |
| `name` → name/heading/data-name | string, unbounded; required | Long hyphenated name, German compound, Vietnamese diacritics, one-letter name |
| `line`, `title` | string, unbounded; required | Long prose and compound-word title |
| `roleFull` / `role` | strings, unbounded; full role optional | Missing `roleFull` exercises compact-row fallback |
| `when`, `where` | strings, unbounded; required | Date span and long multilingual location |
| `fig`, `lab` | display strings, unbounded; required | 0, 1, 1,284, 100%; long label; no inferred numeric formatting |
| works collection | array, no schema bound | Authored six / synthetic four / zero / one; no count-driven heading or pluralization in shared renderer |
| `contact.email` → text/mailto | string, unbounded; required | Long reserved example.com address, exact copyable value |
| `contact.reply` | string, unbounded; optional | Authored reply in Demo; omitted in other states without empty paragraph |

Static action labels, section labels, artwork, alt text and credits remain authored constants. The fixture covers two works presentations and both contact email placements, not the Library's separate data or letter form values. No arbitrary 1,000-row harness: this is an authored six-work portfolio, not an unbounded service list. Empty state intentionally renders no fabricated works; fixture chrome identifies the scenario.

## Controller handoff

Worker checks passed: `node --check astro.config.mjs`, `node --check src/qa/mobile-data.js`, fixture module import (6/4/0/1 works; reply present only in Demo), and trailing-whitespace scan of all ten changed files. Source review confirmed gesture/selection scope, closing-height cascade and the unchanged single dark theme-color. No build, tests, server, browser, Git or deployment commands were run.

Check Demo and all stress states at 320px and 200% text/zoom, then wide layout: complete names, compounds, diacritics, email copy/selection, underline wrapping, zero/one works, optional-field omission, focus/active feedback. Check the real menu, Library drawer and letter controls on canonical pages. Confirm reduced motion, artwork and pinch zoom remain intact.

Preloader is unchanged. Source describes a roughly two-second first-visit signature, a one-second font fallback and pointer/key skip. These are not measured timings. Measure cold first visit, cached font, font failure and skip on the canonical homepage before proposing any timing change; QA routes do not trigger the homepage first-visit signature.

Actual iOS/Android hardware is still needed for tap feedback, long-press callouts, text selection, browser-chrome viewport changes, safe areas, pinch zoom and overscroll. No browser/device results are claimed by this source-only worker.
