# Chuka personal site

The owner-supplied Astro application is canonical. Strategy & Operations remains
the primary professional classification. GSAP and Three.js retain the supplied
visual interactions; the contact letter uses mailto/copy and has no backend.

## Local commands

Use Node 22.13+ (or a newer version supported by the supplied Astro release).
The archive lockfile needs synchronization with the pinned Wrangler development
dependency in the root controller environment before the first `npm ci`:

```sh
npm install --package-lock-only --ignore-scripts
npm ci
npm test
npm run lint
npm run diff-check
```

`npm test` builds the default noindex candidate and checks metadata plus Worker
routing. Also run `ALLOW_INDEXING=true npm test` to check indexable build output,
then `npm run build` to restore the default noindex candidate.

```sh
npm run build
npm run preview
# Worker-aware preview, including provenance (use the full current Git SHA):
npm run preview:worker -- --var "DEPLOY_SHA:$(git rev-parse HEAD)"
```

Astro preview serves files only; Worker headers, redirects, robots and sitemap
require the Worker-aware preview or remote deployment. No server or browser was
started during implementation. See [deployment](docs/deployment.md) for remote
commands and [provider decisions](docs/prior-art-decisions.md) for the bridge.

`src/data/works.js` and `src/data/site.js` hold supplied content. `src/data/routes.js`
holds canonical paths, metadata and legacy redirects. `content/artworks.ts`
records historical-image provenance and the limits of the supplied archive.
Older design/QA documents describe the replaced direction and are historical,
not acceptance evidence for this launch candidate.
