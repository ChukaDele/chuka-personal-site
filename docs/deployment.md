# Deployment

## Targets and provenance

- Production: existing Worker `chuka-personal-site`, canonical `https://chukadele.com`.
- Preview: existing Worker `chuka-personal-site-atelier-v1`.
- Implementation: `codex/chuka-approved-launch-20261003` in
  `/Users/chukwuka/Documents/Codex/worktrees/chuka-approved-launch-20261003`.
- Major goal: `d3ffd0fc-c9d8-43f6-8a75-20b4cb77929e`, owner-approved supervised Workshop.

Wrangler uses `wrangler.jsonc` and uploads `dist/` as static assets. No route/DNS
or account changes are configured. Existing custom-domain attachment must remain
in place and be verified by the controller. All responses traverse the Worker
and include `X-Deploy-SHA`. A missing/abbreviated SHA fails closed with HTTP 503.
No GitHub, keychain or remote Git access is needed to implement or build.

## Controller commands

First synchronize the archive lockfile with the added pinned Wrangler dependency
using `npm install --package-lock-only --ignore-scripts`, then `npm ci`.
Commit the synchronized lockfile with the source. Run `npm test`,
`ALLOW_INDEXING=true npm test`, `npm run lint` and `npm run diff-check`.

After committing/pushing the exact source:

```sh
npm run deploy:preview
# After remote preview QA, independent review and promotion to clean main:
npm run deploy
# After production QA on this exact SHA:
INDEXING_APPROVED_SHA="$(git rev-parse HEAD)" npm run deploy:enable-indexing
```

Both deploy targets require a clean committed tree and rebuild Astro immediately
before deploying with the captured Git SHA. Production also requires `main`.
Deployment commands perform authenticated transport; none was run by the
implementation provider. They do not change DNS/account configuration.

Preview and initial production builds have noindex HTML. Runtime denies indexing
unless explicitly enabled AND the request origin is exactly the canonical HTTPS
origin, including port. Preview robots disallows crawling and sitemap is empty.
Production promotion rebuilds without noindex except Notes/404 and exposes only
canonical `.html` routes (home is `/`) in the sitemap. Canonical and social tags
always point to the corresponding production route, including on preview.

Unknown routes return the supplied-style 404 with status 404; they do not render
the home page. `/work/<id>`, top-level extensionless pages and trailing-slash
variants redirect to their supplied `.html` equivalents. `/speaking` redirects
to `press.html`, which includes the supplied speaking content. `/index.html`
redirects to `/`. Query strings survive redirects.

## Remaining validation

Implementation-only Node tests passed without a server. The runtime denied
`npm run test:unit && npm run lint` with `EPERM: operation not permitted, open
/usr/local/lib/node_modules/npm/bin/npm-cli.js`. Direct `node --test` works.
Thus dependency resolution, lockfile synchronization and Astro compilation remain
controller checks, not claimed successes. The supplied dependency versions are
retained; registry availability must be confirmed there.

Remote browser QA must verify the deployed SHA, navigation/404/redirects,
responsive layouts, keyboard use, reduced motion, GSAP/Three.js interactions,
contact mailto/copy, PDF download, console and network. Confirm Cloudflare asset
cache headers and indexing on both workers.dev and the canonical host. No local
browser/server or deployment was launched during implementation.

Historical artwork captions are preserved and inventoried. The ZIP did not supply
original image-download URLs; those records explicitly distinguish the archive
assertion of public-domain status from independently verified digital provenance.
Supplied biography, outcomes and the Notes essay were retained without adding
claims; Notes is excluded from indexing pending content review.
