# Responsive composition contract

This matrix is the acceptance contract for route and component owners. Modes are selected by the component's available inline size unless the component is genuinely page-level. Layout remains fluid inside a mode and changes mode only when the current relationship stops working.

## Shared modes

- **Compact:** below `42rem`. One deliberate reading sequence. No compressed desktop composition.
- **Medium:** `42rem` to below `64rem`. Two-part relationships where useful.
- **Wide:** `64rem` to below `82rem`. Full editorial relationships with controlled measures.
- **Expansive:** `82rem` and above. Wide logic with capped proportions and more breathing room.

Component-specific thresholds may differ when testing identifies a real content failure point. Record the reason next to that component rather than adding a generic viewport patch.

## Major-component state matrix

| Component | Expansive | Wide | Medium | Compact | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Hero | Copy and artwork/system share the frame; gap reaches its cap. | Copy and artwork/system coexist laterally on shared anchors. | Overlap reduces; copy keeps priority and artwork becomes a restrained companion. | Copy leads, followed by a separate controlled visual block; no desktop coordinates survive. | Final geometry is visible immediately; decorative movement and parallax stop. |
| Practice | Full horizontal operating model at its capped readable size. | Full canonical horizontal renderer. | Shared model rebalances while labels remain legible; change renderer if they do not. | Deliberate vertical or simplified renderer from the same geometry data. | Stage changes are discrete and immediate; no scroll-scrub or interpolated residue. |
| Work Folio | Three tracks with capped copy and media widths. | Index, primary copy and media use three named tracks. | Index plus primary track; media follows copy without being crushed. | Stacked index, copy and media in source order. | Sticky/stack motion stops; all evidence remains readable. |
| Library Book Shelf | Several books share a bounded physical shelf. | Multiple book objects share one shelf composition. | Fewer visible books or a controlled horizontal flow. | Deliberate swipe/scroll sequence using the same Book objects. | Perspective lift and inertial movement stop; focus and scroll remain usable. |
| Screening Room | Grid can add breathing room, not extra line length. | Multi-item viewing grid with stable media ratios. | Auto-fit fewer columns based on the room container. | Single-column media sequence with controls attached to each item. | Autoplay and decorative transitions stop; controls and poster states persist. |
| Founders / Listening Room | Bounded records can sit beside the primary listening object. | Metadata and listening object maintain a two-part editorial relationship. | Metadata stacks above a full-width listening object when its measure tightens. | One vertical sequence; transcript/action follows the player. | Audio never auto-starts; animated meters become static status indicators. |
| About Hero | Asymmetric portrait and statement gain breathing room without uncapped growth. | Portrait and statement form the full editorial relationship. | Controlled two-part layout with protected copy measure. | Portrait then statement as a deliberate vertical sequence. | Portrait reveal and decorative movement stop. |
| Speaking Hero | Photo and proposition keep a capped lateral relationship. | Photo, proposition and action align on shared tracks. | Photo and proposition rebalance as two parts; action stays with proposition. | Photo, proposition and action stack in reading order. | No image drift or entrance sequence; conversion action is immediately available. |
| Press Assets | Asset grid uses its maximum useful column count. | Assets auto-fit into useful, equal-width blocks. | Container query reduces columns without changing asset markup. | Single-column or two-column blocks only when each download label remains complete. | Hover lifts stop; download and copy actions retain state feedback. |
| Preloader | Same centred bounded object; it does not scale with empty space. | Same centred bounded object. | Same centred bounded object. | Controls stack when labels no longer fit side by side. | No line drawing or exit tween; the choice remains explicit and accessible. |
| 404 | Fragments frame the message without leaving the content frame. | Fragments hold a balanced field around the message. | Fewer or closer fragments protect the message measure. | Copy and recovery action lead; fragments become secondary and cannot clip content. | Assembly animation stops; recovery actions remain available. |
| Navigation | Inline links keep their capped spacing. | Full inline navigation. | Switch to the compact navigation when links lose required hit area or spacing. | Wordmark and one menu control; panel fits the content edge and safe area. | Menu opens without transitional movement; focus order is unchanged. |
| Correspondence | Copy stays capped while the field gains breathing room. | Proposition and metadata align to the shared content and secondary edges. | Metadata reflows while remaining attached to the proposition. | Single-column proposition, actions and metadata; background geometry cannot drive height. | Grid perspective and decorative lines stop; links remain immediately usable. |

## QA widths

Test `390`, `430`, `512`, `768`, `834`, `1024`, `1173`, `1280`, `1365` and `1440` CSS pixels. Slowly resize between them. A pass at the endpoints does not prove relational behaviour.

At each width, check:

- common content edges and intended named-track alignment;
- readable line lengths and stable heading attachment;
- mode changes that occur once, for a documented reason;
- no overlaps, clipped artwork, detached labels or awkward empty zones;
- media crop and focal point at every aspect ratio;
- touch target and keyboard focus continuity;
- reduced-motion output with the same content and controls;
- Practice ports, connectors, hub alignment and clean reverse/final states.

The modularity check is practical: place Practice in a narrower container, reuse a Work Folio without copied CSS, change a `MediaFrame` image using only content data, and move the same Book object between shelf and compact flow. If any test requires rewriting component internals, the relationship still has the wrong owner.
