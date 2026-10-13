# Project guidance

- Keep the primary professional classification as Strategy & Operations.
- Do not invent outcomes, case studies, resource endorsements or personal biography.
- Reuse the documented public-domain artwork. Add every new historical source to `content/artworks.ts`.
- Motion must reinforce observation becoming structure. Respect reduced-motion preferences.
- For Lenis, GSAP scroll synchronisation, parallax or smooth-scroll changes, read `docs/lenis-pilot.md` and the existing `responsive-motion-systems` skill first. Lenis remains an opt-in desktop candidate, never a site-wide default. Preserve native mobile, keyboard, dialogs and reduced-motion behavior; test the same reviewed SHA in CI and a Cloudflare preview before any production enablement.
- Keep unfinished route shells minimal and `noindex` until their content is verified.
- Do not commit credentials, local environment files, downloaded source generations or Cloudflare configuration secrets.
