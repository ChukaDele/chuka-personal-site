# QA report

## Deterministic gate

Current local result on 9 August 2026:

- ESLint: pass.
- Production vinext build: pass.
- Rendered-route tests: 7 pass, including all Phase 2 shells and the bespoke 404.
- Diff check: script added; must be rerun after the final asset and documentation changes.

## Remote evidence

The first isolated Cloudflare preview proved remote deployment and passed Major web preflight. It predates the current local changes and is not acceptance evidence for the current tree. The current revision must be pushed, redeployed and tested before this report can record browser acceptance.

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
