# QA report

## Deterministic gate

Phase 3 implementation verification on 10 August 2026:

- ESLint: pass.
- Production vinext build: pass.
- Rendered-route tests: 13 pass, covering the homepage, the Work archive, three Work files, Notes, About, Résumé, Speaking, Press, Library, default-deny indexing and the bespoke 404.
- Diff check: pass.

## Prior remote evidence

Phase 2 was pushed to `origin/atelier-v1` and published through immutable Cloudflare Worker versions. Each acceptance run first matched the full `X-Deploy-SHA` response header to the pushed Git revision and passed Major remote-web preflight. Phase 3 remote acceptance must be recorded against its own exact revision after deployment.

The remote matrix covered:

- 1440, 1280, 1024, 768 and 390 pixel widths with no horizontal overflow;
- first-view identity and value clarity while the optional sound offer remains visible;
- desktop Practice progress states, pin release and reverse scroll;
- fully resolved tablet, mobile and reduced-motion Practice states without GSAP requests;
- literal Work-card media plates with no repeated decorative right-side index;
- first-use and persisted sound preference, later navigation cues, visibility suspend/resume and a reversible 44 pixel mobile toggle;
- Library player lazy instantiation, zero YouTube requests before activation, focus transfer to Close and restoration to the originating Play button;
- keyboard order, mobile navigation, 44 pixel primary touch targets and focus visibility;
- all Phase 2 routes, the social image, `robots.txt`, `sitemap.xml` and a real useful 404;
- console, failed-request and response-header checks.

Preview responses include noindex, exact deployment provenance, HSTS, anti-framing protection, nosniff, referrer policy and permissions policy.

## Flow / Veo decision

The public-domain Dürer source was accepted in Flow with the documented 9:16, two-output, Veo 3.1 Quality contract. Flow routed the request into prompt coaching and did not expose a valid paid Veo submission for that configured request. No credits were spent. The site retains the deterministic static artwork treatment; `docs/veo-generations.md` records the acceptance contract for a future retry.

## Production gate

The preview is not production approval. Indexing remains disabled until a verified production domain is supplied through `SITE_URL`, `ALLOW_INDEXING=true` is deliberately enabled at build and runtime, and the production deployment passes exact-revision acceptance. The site does not claim unsupported project outcomes, speaking engagements, a direct email address or a downloadable résumé.
