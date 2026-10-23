# Lenis: optional scroll orchestration

Status: **conditional adoption, pilot only**. Checked 2026-10-09.

## Why it is optional

The current site already uses native document scrolling, GSAP ScrollTrigger, canvas colour reveals, a sheet page transition, scrollable modal forms and a mobile library drawer. A global scroll replacement adds input latency and interaction risk unless scroll synchronisation actually improves. Do not enable Lenis on every site or make it a mandatory agent skill.

Lenis is an MIT-licensed, dependency-free runtime library for coordinating scrolling and WebGL/GSAP scenes. This repository pins **lenis@1.3.26** only to power a deliberately gated visual experiment. The normal visitor experience and all production defaults remain unchanged.

Sources: https://github.com/darkroomengineering/lenis and https://www.npmjs.com/package/lenis

## How to compare

Use the existing Cloudflare preview deployment of a reviewed feature-branch SHA:

- **A (baseline):** preview home route `/` with no query.
- **B (experiment):** preview home route `/?lenis-preview=1`.

Only a desktop browser with **width ≥1100px, hover, fine pointer, zero touch points and no reduced-motion preference** can activate B. The module and package are dynamically loaded in this mode. No preference is saved, and navigating to another page without the query returns to the native baseline.

For QA, inspect `document.documentElement.dataset.scrollPilot`: it reads `lenis-preview` only while the pilot is active. The absence of this marker indicates normal/native handling. It is not an analytics flag and nothing is transmitted.

## Wiring and ownership

- `src/scripts/site.js` remains the owner of GSAP ScrollTrigger and existing interactions; it lazily requests the pilot only when the explicit query parameter is set.
- `src/scripts/lenis-pilot-policy.js` defines the pure eligibility contract and is covered by unit tests.
- `src/scripts/lenis-pilot.js` uses **one GSAP ticker** for Lenis `raf` and forwards Lenis scroll events to `ScrollTrigger.update`. It does not create a second ScrollTrigger timeline.
- Lenis anchors use `{ immediate: true }` to preserve immediate keyboard/anchor navigation. `syncTouch: false` keeps touch physics native.
- Forms, dialogs, navigation and other nested scroll containers are excluded from wheel smoothing. An open dialog stops the Lenis root; closing it resumes the pilot.
- Page exit, a narrower breakpoint, changed pointer capabilities or a reduced-motion preference destroys Lenis and restores native scrolling. Failed module loading also falls back.

**Source hierarchy:** The approved existing Astro site, its layout rules, Emil mobile-native/break-ui and current GSAP owners take precedence. Lenis is one optional runtime dependency and never a new mandatory build loop or design style.

## Required acceptance tests before any production enablement

1. **Functional baseline:** Both A and B render identically at rest; navigation, hashes, focus restoration, keyboard Home/End/PageDown and browser history work. Section art and scroll progress remain synchronised during repeated fast wheel scrolls and reverse scrolls.
2. **Overlay stress:** Open/scroll/close the correspondence form, country selector, library drawer and mobile menu. Nested content must remain scrollable; closing returns the document to normal input without jump or scroll lock.
3. **Accessibility:** Test prefers-reduced-motion before load and toggled during the session, keyboard focus, screen-reader navigation, in-page links and browser zoom at 100% and 200%. The pilot must stay off with reduced motion.
4. **Devices:** Desktop Chromium, Firefox and Safari with mouse and trackpad, then real iOS Safari and Android Chrome. Native scrolling must be unchanged on touch, tablet and narrow viewports.
5. **Performance:** Compare baseline vs pilot on the same preview SHA and representative hardware. Measure responsiveness, long tasks, visual smoothness, scroll-to-input feel, animation alignment and Lighthouse/INP signals where available. Aesthetic preference alone is insufficient to justify a persistent JS dependency.
6. **Release gates:** `npm ci`, `npm test`, `ALLOW_INDEXING=true npm test`, `npm run lint`, and `npm run diff-check`, then remote Cloudflare preview, independent review and approval. Never deploy a plain `deploy` to production because it can unset indexing.

## Pass / fail decision

**Retain** only if B provides a visible, repeatable benefit on the target desktop interactions with no accessibility, keyboard, overlay or mobile regression and no meaningful performance penalty. Otherwise remove the opt-in experiment and the Lenis dependency. The normal/native baseline is the default.

## Current verification record

- Source design and safety gates: implemented on an isolated GitHub feature branch.
- Unit/CI: pending GitHub Actions on the PR.
- Remote browser A/B, real devices and Cloudflare preview: **not yet executed**. The Mac controller was offline, so this is not a shipping approval.
- Production: unchanged.
