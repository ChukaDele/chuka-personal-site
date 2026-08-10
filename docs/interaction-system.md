# Interaction system

`ResourceAction` is the shared primitive for navigational, outbound, download and text actions. Page-specific CSS may change colour, spacing and scale. It must not replace the state contract below.

| Surface | Default | Fine-pointer hover | Focus-visible | Press or touch | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Primary action | 44px minimum target, visible boundary | Colour or boundary change | 2px explicit outline | `scale(.97)` for 100–120ms | Colour and boundary remain; positional motion is removed |
| Text or compact action | 44px minimum target, directional icon where useful | Icon moves 2px | 2px explicit outline | `scale(.97)` for 100–120ms | Icon remains static |
| Navigation | 44px minimum target, current route announced | Opacity change only | 2px explicit outline | Shared press feedback | Menu opens instantly |
| Sound choice and toggle | State is named and announced | Boundary and surface change | 2px explicit outline | `scale(.97)`; mute is immediate | Gate remains available without intro motion |
| Book cover | Cover is the primary object; title remains semantic | 8px lift and 1.012 image scale | Inset outline inside the cover | Native horizontal scroll and click feedback | Shelf remains usable with no lift |
| Video | Large labelled play target | Play marker changes surface | Inset outline | Immediate player swap; Escape and Close restore focus | No decorative player transition |
| Press copy/download | Clear verb, format and size where relevant | Shared action feedback | 2px explicit outline | Shared press response and polite copy status | Status changes remain immediate |
| Practice | Observe is the first state; active state owns hierarchy | None | Not interactive | Mobile state changes at meaningful vertical thresholds | Complete static system is shown |
| 404 assembly | Static fragments with an explicit pressed state | Boundary change only | 2px explicit outline | State changes immediately | Same complete information, no positional animation |

Rules:

- Never use `transition: all`, built-in `ease-in`, or `scale(0)` entrances.
- Hover effects require `(hover: hover) and (pointer: fine)`.
- Keyboard navigation is immediate. Global smooth scrolling is not allowed.
- Transform and opacity are preferred. Layout coordinates are not animated.
- Sound is emitted only after consent and only from deliberate activation or named thresholds.
