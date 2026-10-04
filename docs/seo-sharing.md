# SEO and sharing

Each registered page uses its contextual title and description from
`src/data/routes.js`. Titles use the public brand Chuka Dele. Unknown routes
retain the short brand/full-name fallback. OG and Twitter titles/descriptions
match the page metadata; card images remain unchanged.

OG site name and WebSite.name use Chuka Dele. Person.name uses
Chukwuka Dele-Oyeleru, with Chuka Dele and Chuka Dele-Oyeleru as alternate names.
The existing LinkedIn identity link and Strategy & Operations classification remain.

Notes and 404 remain noindex, as do all preview builds. Canonical URLs retain
the existing `.html` paths and HTTPS production origin, including on preview.
404 has no canonical or JSON-LD and retains its Worker status. Sitemap and
redirect behavior are unchanged.

JSON-LD contains only Person, WebSite and WebPage (ProfilePage for About).
The serializer escapes HTML-significant characters and line separators before
inline embedding. No employers, education, availability, services, reviews or
numerical outcomes are added to structured data.

## Library

`src/data/library.js` owns eight notes, each with two paragraphs and one short
quotation plus linked locator. Astro renders the complete paragraphs, quotes,
source links and resource actions into the initial HTML. Without JavaScript,
book anchors lead to those readable notes. With JavaScript, the same elements
move into a single native modal drawer on one deliberate mobile tap, or remain
beside the shelf on desktop hover intent/focus. There is no duplicate visible
reading path or HTML assembled from data attributes.

The drawer has bounded height, an internally scrolling reading area, safe-area
padding, a persistent close control, backdrop/Escape dismissal, Tab wrapping,
focus restoration and underlying scroll restoration. Breakpoint changes move
the selected panel between presentations and release/reapply the scroll lock.
Reduced motion disables the drawer entrance and book animation. The existing
painting and other site interactions remain in place.

See [Library sources](library-sources.md) for quote evidence, edition limits and
pending controller checks. Runtime/mobile accessibility and resize QA remain
controller-owned.

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

Each card is a 1200×630 progressive JPEG under 150 KB. The homepage pairs a
large, contained natural-colour suit portrait with a two-line full name, role
and domain. Its face and copy stay within the central square crop; the supplied
photo is resized without cropping, distortion, filters or likeness edits. Other
cards retain their existing layout and central 580-pixel labels.

| Route | Card under `/og/` | Existing image |
| --- | --- | --- |
| `/` | `home-v2.jpg` | `p-speaking` (natural suit portrait) |
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

`/og/home-v1.jpg` is intentionally preserved for already-shared links that still
request the old asset URL. Home OG and Twitter metadata now use the stable
`/og/home-v2.jpg` URL and describe the natural suit portrait. Person.image uses
the supplied original `/press/chuka-dele-oyeleru-speaking.jpg`. Regeneration
leaves the other 12 cards and all favicon assets byte-identical.

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

## Google Search Console ownership

The URL-prefix property is `https://chukadele.com/`. The supplied Google HTML
verification file, `public/google6f72ccdce44ee21f.html`, is intended to verify
ownership for the user-approved personal Google account. Serve it unchanged at
`https://chukadele.com/google6f72ccdce44ee21f.html` and keep it in every future
site deployment so Google can recheck ownership.

Ownership verification, sitemap submission and any recrawl requests remain with
the release controller after exact-source deployment. This documentation does
not confirm successful verification, submission, recrawling or refreshed results.

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

Tests check exact owner metadata on every page including 404, contextual route
images, case contributions, actual Person/WebSite identity, safe JSON-LD,
complete head tags, decoded image type/dimensions, asset byte equality in dist,
icon sizes, Library initial-HTML paragraph/quote/link coverage and
Notes/404/preview indexing. Existing Worker tests continue to
check runtime protections. Implementation ran the source/asset and Worker
checks; rendered checks require the controller builds. Remote visual/sharing QA
and independent review follow through the controller.

This increment changes owner metadata, Library copy/presentation, tests and docs.
All share cards and favicon bytes remain unchanged. The existing natural suit
`home-v2.jpg` remains valid; changing head identity does not require rewriting
the approved card. If its bytes change later, use `home-v3.jpg` and preserve v1/v2.

Follow the indexing-enabled release procedure in `deployment.md`. Build,
authenticated transport, exact-SHA review, preview QA and publication remain
with the controller. No search/social cache refresh is claimed.
