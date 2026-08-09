# QA report

## Deterministic gate

Current local result on 10 August 2026:

- ESLint: pass.
- Production vinext build: pass.
- Rendered-route tests: 7 pass, including all Phase 2 shells and the bespoke 404.
- Diff check: pass after the final documentation update.

## Remote evidence

Revision `571e0b9465c53594a0e1caafa599fd3cd0d930ad` was pushed to `origin/atelier-v1` and deployed to the isolated Worker. The immutable version URL is `https://9d65b2d7-chuka-personal-site-atelier-v1.thebredge.workers.dev/`; it returned the same revision in `X-Deploy-SHA`. Major remote-web preflight passed for the Cloudflare preview and the GitHub repository.

Browser checks completed against the remote preview:

- 1280px desktop: full identity and value hierarchy visible; no horizontal overflow; no console errors.
- 1024px tablet: single-column Practice composition; no horizontal overflow.
- 768px tablet: mobile navigation active and folio sticky positioning reset.
- 390px mobile: no horizontal overflow; folios in normal flow; navigation opened with 46px route targets; hero and first Work folio inspected visually.
- Reduced motion at 390px: media query active, preloader absent, system nodes and Practice stages fully visible, no overflow.
- Invalid route: real HTTP 404, useful routes visible, fragment-control state changes correctly.
- Phase 2 shells, `robots.txt`, `sitemap.xml` and the social image all return HTTP 200.
- Desktop hero-to-Work handoff, Correspondence resolution and reverse-scroll restoration were verified on the immutable revision.
- At 1024px, every non-animated hero and Practice state is fully resolved after load and after crossing down from the desktop animation breakpoint.

The expected browser console resource error for the deliberately requested 404 is not an application failure.

## Flow / Veo decision

The public-domain Dürer source was accepted in Flow with the documented 9:16, two-output, Veo 3.1 Quality contract. Flow routed the request into prompt coaching and did not expose a valid paid Veo submission for that configured request. No credits were spent. Phase 1 retains the deterministic static artwork treatment; `docs/veo-generations.md` records the exact acceptance contract for a future retry.

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
