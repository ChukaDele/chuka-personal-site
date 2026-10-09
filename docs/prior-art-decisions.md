# Provider capability decisions

## ADOPT — Astro source supplied by the owner

Canonical application: `.launch-input/chuka-site.zip`, SHA256
`f0a057b2936eaf5334585668d48def9207db432a69ee7999eb5fdffccae6fbdd`.
Archive paths were validated against traversal, absolute paths and symbolic links
before extracting only `src/`, `public/`, Astro configuration and package manifests.
The archive itself, source-generation tools and staging remain uncommitted.
Keep supplied content, styling, GSAP, Three.js and mailto/copy contact behavior.
The old React/vinext runtime, frontend and tests were removed.

## ADOPT — Cloudflare Static Assets and maintained Wrangler

Use Cloudflare's existing static asset storage, caching and binding with Wrangler
`4.92.0` (exact pin retained from the existing project). No custom hosting service,
DNS migration, account creation, transport credentials or contact backend.

Provider documentation:
- https://developers.cloudflare.com/workers/static-assets/binding/
- https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/
- https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/

## WRAP — request policy only

`worker/index.mjs` wraps the ASSETS binding. `run_worker_first: true` is required
for provenance and security on files as well as HTML. `html_handling: none`
preserves supplied `.html` URLs. The wrapper supplies legacy redirects, a true
404, robots/sitemap policy, exact SHA headers and the prior production security
baseline. The archive's `_headers` caching rules remain intact. Root HTML receives
the same revalidation policy as other HTML files. No SPA fallback or SSR runtime.

Canonical/social metadata belongs to Astro; build and runtime indexing are set
together by the deploy script. Only `https://chukadele.com` can be indexed, after
the existing exact-SHA indexing promotion. Notes remains noindex.

## BORROW — 2026-10-09 / Playground retro mechanics (before implementation)

Design read: EXPERIENCE for visitors taking a short play break; paper, ink,
copper and existing display/body typography; two original classic-inspired
variations in an asymmetric arcade composition, not interchangeable cards.
Moderate variance and density; motion only during explicitly started play.

Reviewed primary sources:
- https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_breakout_game_pure_JavaScript
- https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
- https://github.com/shystruk/snake-game (complete README)
- https://github.com/shystruk/snake-game/blob/master/js/api.js

Borrow mechanics and Canvas2D/collision patterns only; no source text copied.
MDN documentation is Creative Commons licensed; the Snake README links MIT.
The Snake example starts an interval automatically, captures document keys and
omits self collision: unsuitable to embed. Existing src/tests have no reusable
game helper. Keep the site painting renderer separate. Native Canvas2D, Pointer
Events and requestAnimationFrame suffice; Phaser adds unjustified engine and
dependency weight. No game provider/MCP, new transport or dependency needed.

Scope: paired relocating portals with finite free-cell selection for Loopline;
paddle aiming and charged-neighbour chains for Ricochet. Pure logic plus a
page-scoped lifecycle adapter, focused tests, guarded device best scores. No
product equivalence claim or artifact reverse-engineering needed. Preserve
approved clips/credits and shared silent visible video policy. Draft stays
noindex and outside navigation. Owner reserves build/browser acceptance for
the controller; this change receives source, syntax and focused Node checks.
