# Underdrawing lab

One shared, isolated prototype following Underdrawing B in the owner-supplied `Chuka Directions III.zip`. The three endings are `?ending=poster-wall`, `?ending=archive` and `?ending=workbench`.

The isolated Astro static build renders six homepage summaries and six real case pages. Native canvas, pointer capture, dialogs and local storage carry the optional play. The visitor can read all six cases without using the optional play area. Roles are visible on the closed rows. LinkedIn, résumé and Notes use the existing public destinations.

The poster wall supports bounded dragging, arrow keys, Shift plus arrows for larger moves, and Escape to cancel a move. The archive opens real case and art content. The workbench includes a private browser note and a red drawing sheet. Fresco painting has keyboard and touch completion/reset buttons. Manual marks survive resizing. Device reduced motion and the draft override disable transitions; keyboard navigation skips smooth scroll.

## Sources and boundaries

- Source archive SHA-256: `9f37282f6abc0e6066da97ebd81ae00eaada5b437f062d770821162ce5e0797c`.
- Source HTML SHA-256: `007e7dbad1a82e15852b0addd338c3cd6c8934f68630397190a1ce7ae59d75aa`.
- Twenty-two JPEGs come from that archive. The two naturally monochrome Leonardo and Dürer prints come from the earlier supplied art references. The red sketch treatments are modern interpretations. They are not evidence of the original product-development process or historical preparatory drawings.
- Historical sources are Raphael’s *School of Athens* (1509 to 1511, Vatican); Leonardo’s hoist study (circa 1478 to 1480, Codex Atlanticus); Dürer’s *Saint Jerome in His Study* (1514); and geometric illustrations in Pacioli’s *De Divina Proportione* (1509, after Leonardo). The historical drawing and engraving remain in their natural monochrome treatment. The owner-supplied red sketch treatments are preserved without claiming independently verified rights for those modern treatments.
- Project copy follows the supplied cases and prior portfolio. HoneyCoin outcomes are attributed to Rvysion. Idara’s 3.2× first-order revenue ROAS does not establish profit or first-order acquisition-cost recovery, so that inference is omitted. Reporting periods and metric definitions remain publication checks. No measured Surface Talent throughput or staffing/cost model is asserted. The Bredge screenshots are service-marketing evidence.
- No email address is invented. Geographic biography is omitted rather than inferred from the reference.
- The selected source typography is Cormorant Garamond, Alegreya Sans and Reenie Beanie. Latin WOFF2 files come from the official Google Fonts API. Each family’s SIL OFL license comes from `google/fonts` and is included under `fonts/`. This is source implementation, not a new typography exploration.
- The clarified play reference is Wiredge Studio. Its source supports bounded manipulation and optional drawing. This prototype borrows those interaction principles, not its brand, source code or a physics engine.

## Checks and hosting

Run `node artifacts/chuka-underdrawing-lab/checks.mjs` from the repository. The focused check verifies script syntax, all required local assets, six-case coverage, attributed outcome boundaries, drag bounds and reduced-motion/keyboard affordances. It also checks all seven compiled routes when `dist/` exists. It does not claim browser or visual acceptance.

Deploy only the separate `chuka-underdrawing-lab` Worker, using its folder-local Wrangler configuration and an immutable `DEPLOY_SHA`. All responses carry `X-Deploy-SHA` and `X-Robots-Tag: noindex, nofollow`. Configuration and checks are excluded from served assets. No production application, domain or existing preview is changed.

## Implementation decision

ADOPT the owner-requested Astro static compiler, GSAP and Three.js inside this folder. Astro pre-renders all case routes from one shared data module. GSAP adds brief circle and structural reveals through ScrollTrigger; device reduced motion and keyboard interaction revert them. Three.js is imported only when a visitor opens the optional geometric study. It renders only on changes and disposes its geometry, material and renderer when the object dialog closes. No essential content depends on WebGL. Native pointer handling remains the poster and workbench mechanism.

Run `npm ci` and `npm run build` in this folder. Dependencies and lockfile are isolated from the application. Only `dist/` is deployed. The original static preview remains available by its Cloudflare version URL and immutable source commit.
