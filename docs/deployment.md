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

### Indexing-enabled metadata releases

As checked on 4 October 2026, the site is live and permits indexing on the canonical HTTPS origin. Google indexing coverage remains unconfirmed until Search Console URL Inspection and Page indexing are checked. For the SEO/sharing/icon increment, after
remote preview acceptance and independent review, the controller can deploy the
exact reviewed SHA on clean `main` directly through the existing indexing-enabled
command:

```sh
INDEXING_APPROVED_SHA="$(git rev-parse HEAD)" npm run deploy:enable-indexing
```

Confirm that HEAD is the exact reviewed SHA before executing. Do not run the
plain `deploy` intermediate step for this release: it would rebuild live HTML
with noindex. `deploy:enable-indexing` keeps indexing enabled while preserving
the existing Notes/404 and noncanonical-origin protections. Preview still uses
`deploy:preview` and stays noindex. This is a controller procedure, not a record
of a deployment or a search/social cache refresh. Asset and rendered test
commands are in `seo-sharing.md`.

### Original implementation validation record

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

## Minimal press download repair (2026-10-03)

Restores the previously broken public URL
`/press/chuka-dele-oyeleru-press-pack.zip` on base commit
`0499cfd6c00026c90438ec713341086046f80c92`. The standard DEFLATE ZIP contains
only these five current `public/press/` files at its root:

- `chuka-dele-oyeleru-bios.txt`
- `chuka-dele-oyeleru-cv.pdf`
- `chuka-dele-oyeleru-editorial.jpg`
- `chuka-dele-oyeleru-headshot.jpg`
- `chuka-dele-oyeleru-speaking.jpg`

Members are sorted by filename, use fixed ZIP timestamps of 1980-01-01
00:00:00 and regular-file permissions 0644, and were verified byte-for-byte
against the current public assets. ZIP CRC validation passed. No older archive
press content or other resources were added. ZIP SHA-256:
`f77f5e40ccfa19833e7b05e1950b86d96a54d1b2638648bded93fb5d9a9efb14`.

Restored `build-artifact.py`, `tools/cv.html` and `tools/portrait-hatch.py`
byte-for-byte from their `chuka-site/` members in the approved local archive
`.launch-input/chuka-site.zip`, whose SHA-256 was verified as
`f0a057b2936eaf5334585668d48def9207db432a69ee7999eb5fdffccae6fbdd`. These editable offline sources remain outside
`public/`; they were not executed or adapted (including original source paths).

This repair changes only the ZIP, those three source tools and this document;
there are no page layout, copy, design or package changes. No build, server,
browser, commit, push or deployment was run for this repair. The root controller
will commit, push, deploy and verify the restored download through remote browser QA.

## Reveal readiness repair (2026-10-03)

Remote preview QA at `cfc34f429dfa09d380ebeddf3de98e6a274e185e`
reported repeated non-finite `createRadialGradient` arguments during fast scroll
to the lazy home footer. Native canvas dimensions are nonzero before either
image loads, so the old width-only scroll guard allowed undefined cover geometry
to reach the gradient. Pointer painting also lacked a readiness guard.

`Reveal` now requires both images to be loaded with positive intrinsic dimensions,
positive finite canvas dimensions and scale, and finite cover offsets before
scroll/pointer painting, rendering, sprite preparation or touch bloom. Sizing
rejects invalid dimensions and initializes geometry even when the measured size
matches the native canvas defaults. The shared dab helper additionally rejects
non-finite coordinates/radii and non-positive radii; scroll progress and pointer
width are checked before use. Early scroll and bloom calls leave reveal progress
untouched so image-load sizing can apply the existing effects when ready.
Painting colour, sprite parameters, scroll formulas and reduced-motion behavior
are unchanged.

Only `src/scripts/site.js` and this document were changed for this repair.
Direct `node --check src/scripts/site.js` passed. The supplied QA evidence file
could not be read in this runtime (`Operation not permitted`); diagnosis used
the controller's reported trace and source inspection. No build, server, browser,
commit, push or deployment was run. Delayed-image fast-scroll, early-pointer and
touch regressions remain controller remote QA checks.
