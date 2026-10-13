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

## CONDITIONAL ADOPT — Lenis for controlled scrolling experiments

Lenis 1.3.26 is an **optional project-scoped dependency**, not a default global
scroll replacement. The existing Astro site already uses GSAP ScrollTrigger,
canvas reveals, animated page transitions and native scrolling. To avoid
breaking keyboard navigation, mobile native input and nested dialogs, Lenis
runs only on desktop with an explicit `?lenis-preview=1` comparison flag.

The baseline is always native. Current code is a reversible pilot, not production
acceptance. Its GSAP ticker integration, teardown conditions, browser/device QA
criteria and go/no-go decision are documented in [Lenis pilot](lenis-pilot.md).
