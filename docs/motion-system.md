# Motion system

Motion explains a change in state. It does not stage ordinary reading.

## Signature systems

1. Hero handoff: the fixed composition shifts from unresolved source material to an operating diagram, then compacts as the Selected Work heading resolves into view.
2. Practice sequence: one desktop-only pinned sequence maps Observe, Define, Construct, Organise and Improve to named visual states.
3. Correspondence resolution: the closing grid and contact statement settle into a finished state without pinning or delaying the action.

## Runtime contract

- GSAP and ScrollTrigger load dynamically only after hydration.
- `gsap.matchMedia()` owns desktop and reduced-motion composition changes.
- `gsap.context()` owns selectors and inline transforms. Teardown uses `context.revert()` and `matchMedia.revert()`.
- Pinning starts only at 1100px and above. Tablet and mobile use the complete static composition.
- Reduced motion keeps every node and stage visible. It removes pinning, parallax and transformation.
- Generated video, if accepted, is a shallow desktop media layer. It never owns text, navigation, focus, layout or the system diagram.

The canonical owner for every animated state is listed in `docs/motion-ownership.md`.
