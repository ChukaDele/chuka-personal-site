# Relational layout system

This system preserves the Renaissance Atelier art direction while giving repeated spatial relationships one owner. Elements are relational within a composition. Compositions are fluid within a mode. A mode changes only when its design logic no longer holds.

## Primitive boundary

The shared primitives live in `components/layout/primitives`.

| Primitive | Owns | Does not own |
| --- | --- | --- |
| `ContentFrame` | Maximum content width, centring, horizontal gutter and safe-area inset | Section rhythm or a route's editorial composition |
| `Section` | Standard block spacing between major sections | Horizontal edges |
| `Stack` | One-dimensional vertical flow and repeated gaps | Child typography or alignment tracks |
| `Cluster` | Intrinsic wrapping, alignment and action/meta gaps | A viewport breakpoint |
| `EditorialGrid` | Named tracks and compact, medium, wide and expansive composition modes | Content, animation or the outer page edge |
| `MediaFrame` | Aspect ratio, crop, focal point, overflow, caption and optional bleed | Image selection, loading policy or motion |

These are the minimum repeated relationships. Bespoke hero, Practice and Library compositions remain bespoke. They should consume these primitives instead of duplicating their responsibilities.

## Global token contract

`app/globals.css` is the source of truth for the tokens below. The primitives include conservative fallbacks so they can land before the token migration, but pages should not create competing scales.

### Spacing

The global fluid scale is:

`--space-2xs`, `--space-xs`, `--space-sm`, `--space-md`, `--space-lg`, `--space-xl`, `--space-2xl`, `--space-3xl`.

Semantic aliases map intent to that scale:

- `--page-gutter`: the shared content edge.
- `--section-gap-compact`, `--section-gap`, `--section-gap-large`: major block rhythm.
- `--content-gap`: separation between related content groups.
- `--editorial-gap`: separation between editorial tracks.
- `--copy-gap`: separation within prose or copy groups.
- `--media-bleed`: the maximum intentional extension beyond a content track.

Use a new literal only for a documented optical correction. Do not create another gutter or section scale in a route stylesheet.

### Content width and measure

- `--content-max-narrow`: long-form copy and narrow records. Expected default: `48rem`.
- `--content-max`: standard site frame. Expected default: `82.5rem`.
- `--content-max-wide`: image-led or expansive editorial frame. Expected default: `92rem`.
- `--copy-measure`: readable prose measure. Expected range: `60ch` to `68ch`.

The frame maximum excludes its gutters. Type may grow fluidly, but copy measure remains capped.

### Typography

The shared type-size contract is `--display-xl`, `--display-lg`, `--heading-lg`, `--heading-md`, `--body-lg`, `--body` and `--meta`. The tokens define size; each component pairs that size with an intentional line-height for its role. Use `clamp()` where growth improves hierarchy. Route styles may set family, colour and intentional optical tracking. They should not invent independent responsive type scales.

Headings use `text-wrap: balance` where it improves a short display line. Prose uses `text-wrap: pretty` and a `ch` measure. Manual line breaks are reserved for a deliberate art-directed phrase.

## Named alignment tracks

The viewport and safe-area inset establish the `page edge`. `ContentFrame` establishes the shared `content edge`. `EditorialGrid` establishes these inner lines:

1. `content-start` / `content-end`: full editorial width.
2. `meta-start` / `meta-end`: index, label, date or folio metadata.
3. `copy-start` / `copy-end`: primary argument or project record.
4. `media-start` / `media-end`: image, diagram or secondary object.
5. `secondary-start` / `secondary-end`: non-media supporting content. It aliases the media track until a composition demonstrates the need for an independent relationship.

Assign a direct grid child with `data-track="meta"`, `data-track="copy"`, `data-track="media"`, `data-track="secondary"` or `data-track="full"`. External CSS can also address the named lines directly. In compact mode all tracks resolve to the same column, so source order becomes the deliberate vertical reading order.

```tsx
import {
  ContentFrame,
  EditorialGrid,
  MediaFrame,
  Section,
  Stack,
} from "@/components/layout/primitives";

<Section space="large">
  <ContentFrame>
    <EditorialGrid layout="folio">
      <p data-track="meta">01 / ETAP</p>
      <Stack data-track="copy" gap="copy">...</Stack>
      <MediaFrame
        data-track="media"
        aspect="portrait"
        focalPoint={{ x: 68, y: 32 }}
        caption="Operational field study"
      >
        <img src="/work/etap.webp" alt="" />
      </MediaFrame>
    </EditorialGrid>
  </ContentFrame>
</Section>
```

## Composition modes

The grid and media primitives query their own inline size. Their thresholds describe available composition space, not device categories.

| Mode | Container width | Design reason |
| --- | --- | --- |
| Compact | Below `42rem` | A metadata rail plus useful copy measure cannot coexist. Tracks collapse and source order leads. |
| Medium | `42rem` to below `64rem` | A short metadata rail and primary track fit. Media joins the primary track instead of compressing a third column. |
| Wide | `64rem` to below `82rem` | Metadata, copy and a useful media plate can coexist as three intrinsic tracks. |
| Expansive | `82rem` and above | The three-track logic remains. Only the editorial gap reaches its cap; content and line lengths do not expand indefinitely. |

`42rem` protects a useful primary copy width after a `7.5rem` metadata rail and gap. `64rem` is the first width where the media track can remain at least `15rem` without reducing the copy track below `24rem`. `82rem` is not a new arrangement; it is where additional space becomes breathing room.

Route components can choose different thresholds when their content supplies a different failure point. Document that reason beside the component. Use viewport media queries only for page-level changes such as navigation or a full-page stage.

## Ownership rules

- A page owns content order and selects the composition primitive.
- `ContentFrame` owns reusable route frames. Bespoke full-page compositions consume the same `--page-gutter` token directly.
- `EditorialGrid` alone owns its track definitions and container-query transitions.
- `MediaFrame` alone owns cropping and focal position. Content data supplies only the focal-point values.
- CSS owns responsive composition. Motion controllers own time and stage state.
- A layout wrapper establishes position. A nested motion wrapper receives animation transforms. Do not let both systems write the same `transform`.
- Practice owns one shared geometry model. Its wide and compact renderers may differ, but ports, connectors and module anchors derive from that model.

## Adoption guidance

Adopt a primitive when touching a repeated relationship. Do not mechanically wrap every existing `div`.

1. Replace duplicated `width`, centring and horizontal padding with `ContentFrame`.
2. Replace repeated major block padding with `Section`.
3. Use `Stack` and `Cluster` for intrinsic flow before adding a breakpoint.
4. Use `EditorialGrid` for metadata, copy and media relationships that genuinely repeat.
5. Use `MediaFrame` when an image, video or artwork needs a defined crop, caption or focal point.

A route may keep a bespoke grid when its relationships are unique. It must still align its outer edge to `ContentFrame` and consume the global token contract.
