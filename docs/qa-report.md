# QA report

## Deterministic gate

Current local result on 9 August 2026:

- ESLint: pass.
- Production vinext build: pass.
- Rendered-route tests: 7 pass, including all Phase 2 shells and the bespoke 404.
- Diff check: script added; must be rerun after the final asset and documentation changes.

## Remote evidence

Revision `5642d8c` was pushed to `origin/atelier-v1` and deployed to the isolated Worker at `https://chuka-personal-site-atelier-v1.thebredge.workers.dev`. Major remote-web preflight passed for that Cloudflare URL and the GitHub repository.

Browser checks completed against the remote preview:

- 1280px desktop: full identity and value hierarchy visible; no horizontal overflow; no console errors.
- 1024px tablet: single-column Practice composition; no horizontal overflow.
- 768px tablet: mobile navigation active and folio sticky positioning reset.
- 390px mobile: no horizontal overflow; folios in normal flow; navigation opened with 46px route targets; hero and first Work folio inspected visually.
- Reduced motion at 390px: media query active, preloader absent, system nodes and Practice stages fully visible, no overflow.
- Invalid route: real HTTP 404, useful routes visible, fragment-control state changes correctly.
- Phase 2 shells, `robots.txt`, `sitemap.xml` and the social image all return HTTP 200.

The expected browser console resource error for the deliberately requested 404 is not an application failure.

## Required browser matrix

- 1440, 1280, 1024, 768 and 390 pixel widths.
- Cold and repeat navigation behavior.
- Keyboard navigation, focus visibility and 44px touch targets.
- First paint, full scroll, pinned entry/release and reverse scroll.
- Tablet and mobile sticky reset, horizontal overflow and orientation/resize behavior.
- Reduced-motion static outcome.
- Route shells, invalid route, console, failed requests and critical media weight.

## Known evidence constraint

Project outcomes, a résumé file and an email address have not been verified. The site therefore uses restrained claims and a LinkedIn route. It must not invent metrics or imply that a résumé download exists.
