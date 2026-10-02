# Chuka design playground

This is an isolated, playable draft. It does not change the application or live website.

Open `index.html` directly after extracting the offline ZIP, or use the separate Cloudflare preview.
All main artwork, screenshots, styles and scripts are local. No build, server or network request is required for the main draft. External product, profile and museum links need a connection.

## Try the draft

1. Open **Draft controls** at the bottom right.
2. Switch between **Study**, **Workshop** and **Evening**.
3. Open project stories, expand the Workshop capabilities and try the School of Athens project markers.
4. Open an image for the full view. Use the arrow keys to move through project images. Escape closes the top dialog and restores focus.
5. Save a hero, work section and method section. **Try saved mix** plays those sections together.
6. Add a note and **Export choices**. The JSON records the selected sections, motion setting and feedback.

Selections persist in browser local storage when the browser permits it. They are not sent to a server.
The motion control respects the device preference. The entrance is a brief reinterpretation of the Dürer solid already used in the supplied draft. It runs once per tab session and can be replayed.

## Content and sources

All six projects are included: ETAP, Idara, Surface Talent, HoneyCoin, Rvysion and The Bredge.
The existing site and the supplied **Chuka Directions II** and **Chuka Commissions** drafts provide the copy and assets.
HoneyCoin's reported outcomes stay attributed to Rvysion. Rayna UI is identified as an internal Rvysion product.
The unsupported recruiter throughput and staffing cost comparisons are omitted from the new draft's proof badges and headlines.
Case dialogs carry concise evidence notes. Product images remain supplied presentation assets rather than invented screenshots.

Historical artwork and attribution are listed in `projects.js` and in the artwork credits dialog.
The Met assets retain the existing website's museum links. Other attribution metadata comes from the supplied drafts.
The historical comparisons are editorial analogies. Leonardo's hoist drawing is separate from Raphael's painting.

The two **supplied reference views** remain playable under `references/`. They are labelled as supplied Claude drafts and retain their original copy, including unverified claims and contact placeholders. The Commissions font picker is removed.

## Validation and hosting

Run `node artifacts/chuka-design-playground/checks.mjs` from the repository root.
The check covers six-case completeness, asset paths, source script syntax, attribution presence, and the isolated draft controls.
It does not claim browser or visual acceptance.

`wrangler.jsonc` names a separate Worker, `chuka-design-playground`.
The Worker adds `X-Robots-Tag: noindex, nofollow` and the `X-Deploy-SHA` runtime variable to responses.
Pass the committed SHA during deployment. The `.assetsignore` file keeps deployment configuration and check scripts outside the public asset set.
Use the canonical project account. No custom domain or production Worker changes belong to this draft increment.
