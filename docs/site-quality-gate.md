# Site quality gate

This pilot runs real build, Worker, browser, accessibility and live-provenance checks. It does not publish the site. It does not authenticate reviewer or owner approval. GitHub and Cloudflare protections remain separate controls.

## Sources and scope

- Website Launch QA v2.0 supplies the 47-control catalog in `.website-qa/catalog.json`.
- `.website-qa/profile.json` identifies this repository, production domain, verified existing preview URL, critical journeys and current role labels.
- Playwright drives the Cloudflare Worker locally through `wrangler dev`. Astro static preview is not used.
- Chromium covers 1440 by 900, 390 by 844 and 1280 by 720 at the normal 100% browser scale.
- axe-core blocks serious and critical findings on representative pages. This is automated evidence. It is not WCAG certification or a screen-reader review.

## Exact commands

Install the locked dependencies and Chromium once:

```sh
npm ci
npx playwright install chromium
```

On a restricted Mac where the existing user npm cache is not writable, keep the
global cache untouched and use a task-local cache:

```sh
npm_config_cache=/private/tmp/chuka-website-qa-npm-cache npm ci
```

Run the local automated gate:

```sh
npm run qa:site
```

The command runs these stages in order:

1. `npm test` with the default noindex build.
2. `ALLOW_INDEXING=true npm test` with the indexing-enabled build.
3. `npm run lint` and `npm run diff-check`.
4. `npm audit --audit-level=high`.
5. `npm run test:browser`, which rebuilds the default noindex candidate, starts the Worker-aware preview and drives Chromium.

Run the live smoke only with an explicit reviewed 40-character release SHA:

```sh
npm run qa:live-smoke -- --sha c9dc575f3d1349d4a0c90fd66d21a1750e8f31c4
```

The script always targets `https://chukadele.com`. A caller cannot replace the live URL with a fixture. It checks the exact `X-Deploy-SHA`, critical HTML routes, security headers, titles, descriptions, canonicals, Open Graph URLs and images, `robots.txt`, the canonical sitemap, the real 404 response and `/index.html` recovery redirect.

The negative contract must exit nonzero:

```sh
npm run qa:live-smoke -- --sha 0000000000000000000000000000000000000000
```

Create a separate evidence template for the exact release candidate. Write it outside the release tree so creating evidence does not change the SHA it describes:

```sh
SHA="$(git rev-parse HEAD)"
npm run qa:evidence -- "$SHA" "/tmp/chuka-site-evidence-$SHA.json"
```

The generator creates all 47 controls as `NOT_TESTED` and all three approvals as `NOT_TESTED`. It reports `CLOSEOUT_BLOCKED`. It cannot create `PASS` evidence.

## Phase statuses

| Phase | Automated result | Human or platform requirement | Allowed status |
| --- | --- | --- | --- |
| Intake | Profile and 47-control catalog are versioned | Assign an independent reviewer | `INTAKE_CONFIGURED`, reviewer `PENDING` |
| Build | Locked install, two build modes, unit checks, lint, diff and dependency audit | Add a real secret scan and make the GitHub job a required check | `AUTOMATED_SITE_CHECKS_PASS` is narrower than a 47-control build pass |
| Prelaunch | Worker-aware Chromium, viewports, keyboard, focus, overflow, reduced motion, 404, metadata, contact copy and axe | Visual review, screen reader review, performance budget and independent review | `PRELAUNCH_NOT_APPROVED` |
| Live | Exact-SHA production smoke | Verify production protections, consent or analytics applicability and independent evidence | `LIVE_SMOKE_PASS` is narrower than `LIVE_VERIFIED` |
| Closeout | NOT_TESTED-first evidence template | Authenticated owner acceptance, independent reviewer, handover and support ownership | `CLOSEOUT_BLOCKED` |

The GitHub job also bundles the Worker using `wrangler deploy --dry-run` (never publishes). This checks compatibility with the pinned Wrangler toolchain.

The workflow uploads a compact Playwright JSON result on every run. It uploads traces, screenshots, videos and the Wrangler log when `site-quality` fails. A green workflow is scoped automated test evidence. It is not a 47-control pass, owner acceptance or proof that GitHub or Cloudflare prevents bypass. The `secret-scan` CI job runs pinned Gitleaks v3 against the configured PR and branch commit scope. It is not evidence that all historical or unrecognized secrets are absent. Confirm the real GitHub run and make this check required before marking the P0 secret-scanning control PASS.
