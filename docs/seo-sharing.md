# SEO and sharing

Home title: **Chuka Dele-Oyeleru | Strategy & Operations**

Home description: **Strategy and operations, based in Manchester. I diagnose
problems, design how work should run, and build what it needs. Explore my work.**

`src/data/routes.js` owns per-route titles, descriptions, image metadata and card
copy. `Base.astro` renders matching canonical, OG and Twitter tags in the head.
Known routes override page title props; the 404 keeps its supplied title.
Notes and 404 remain noindex, as do all preview builds. Canonical URLs retain
the existing `.html` paths and HTTPS production origin, including on preview.

JSON-LD contains only Person, WebSite and WebPage (ProfilePage for About).
Identity uses the existing full name, LinkedIn URL and portrait, with Strategy &
Operations as the role. The serializer escapes HTML-significant characters and
line separators before inline embedding. No employers, education, availability,
services, reviews or numerical outcomes are added to structured data.

## Assets

Regenerate final assets from the repository root:

```sh
node scripts/generate-share-assets.mjs
```

The script uses installed Sharp and fontkitten (already supplied through Astro),
with the bundled League Gothic and Alegreya Sans fonts. Text becomes SVG glyph
paths before rasterization, so rendering does not rely on system fonts or SVG
font references. No dependencies, generated historical art or photo effects are
introduced. Existing image content is contained in full, without filtering.
Keep the final JPEG/PNG/ICO files in source control; deployment needs no generator.

Each card is a 1200×630 progressive JPEG, currently 36 to 65 KB. Principal labels
stay within the central 580-pixel width for a square crop. Images are deliberately
secondary to readable identity/project/contribution labels at feed size.

| Route | Card under `/og/` | Existing image |
| --- | --- | --- |
| `/` | `home-v1.jpg` | `jerome-mono` |
| `/about.html` | `about-v1.jpg` | `portrait-mono` |
| `/work.html` | `work-v1.jpg` | `weighing-mono` |
| `/library.html` | `library-v1.jpg` | `pacioli` |
| `/notes.html` | `notes-v1.jpg` | `hoist` |
| `/press.html` | `press-v1.jpg` | `portrait-press-mono` |
| `/resume.html` | `resume-v1.jpg` | `ledger` |
| `/work-etap.html` | `etap-v1.jpg` | `etap-1` |
| `/work-idara.html` | `idara-v1.jpg` | `idara-3` |
| `/work-surface-talent.html` | `surface-talent-v1.jpg` | `surface-1` |
| `/work-honeycoin.html` | `honeycoin-v1.jpg` | `honey-1` |
| `/work-rvysion.html` | `rvysion-v1.jpg` | `rayna-1` |
| `/work-the-bredge.html` | `the-bredge-v1.jpg` | `bredge-1` |

Historical sources are already documented in `content/artworks.ts`; portraits
and project images are the supplied site assets. Surface Talent is labelled as
an MBA internship and operating-foundation case. Library describes books,
essays, talks and listening. Case metadata identifies contributions without
promoting numerical results.

The existing vector C mark in charcoal/copper is retained at `/favicon.svg`.
Generated stable URLs are `/favicon.ico` (16/32/48-pixel DIB images),
`/favicon-32.png`, `/favicon-48.png`, `/favicon-192.png`, `/favicon-512.png` and
`/apple-touch-icon.png` (180 pixels). Head links advertise the SVG, ICO, all four
PNG sizes and Apple icon. No webmanifest is needed for this non-installable site.

## Checks and release

Source-only checks, without building or serving:

```sh
node --test --test-name-pattern='^source ' tests/build.test.mjs
node --test tests/worker.test.mjs
```

Controller-owned rendered checks, run sequentially against fresh output:

```sh
ALLOW_INDEXING=false npm run build
ALLOW_INDEXING=false node --test tests/build.test.mjs
ALLOW_INDEXING=true npm run build
ALLOW_INDEXING=true node --test tests/build.test.mjs
```

Tests check unique metadata, exact home copy, case contributions, safe JSON-LD,
complete head tags, decoded image type/dimensions, asset byte equality in dist,
icon sizes and Notes/404/preview indexing. Existing Worker tests continue to
check runtime protections. Implementation ran the source/asset and Worker
checks; rendered checks require the controller builds. Remote visual/sharing QA
and independent review follow through the controller.

This increment changes metadata, static share/icon assets, tests and docs only.
Approved page bodies, artwork sources, motion, contact, routes, CV, press
resources and all six stories remain unchanged. Follow the already-indexed
release procedure in `deployment.md`. New `-v1.jpg` share URLs avoid reusing the
old raw-image URLs; this is not a claim that search or social caches have refreshed.
