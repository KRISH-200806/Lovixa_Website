# Responsive Design & Layout

## Breakpoints — this project's actual set

`tailwind.config.js` defines no custom `screens` — it uses **Tailwind's defaults**: `sm 640px`, `md 768px`, `lg 1024px`, `xl 1280px`, `2xl 1536px`. Use these classes. Don't invent a custom breakpoint scale unless the project genuinely adds one to `tailwind.config.js` `theme.screens` first (and if you do, update this file).

Introduce a breakpoint class only when the layout actually needs to change at that width — not on every element just because the breakpoint exists.

## Validation widths (conceptual check, independent of the class breakpoints above)

Mentally (or actually) check every responsive change at: **320, 375, 425, 768, 1024, 1440, 1920px**. Look for: horizontal overflow, text clipping, overlapping elements, broken grids, bad image sizing, nav/button overflow, excessive or insufficient whitespace, unreadable type, broken cards/tables/modals, misbehaving fixed/sticky elements. No unintended horizontal scroll — ever.

## Mobile-first

Write the base (unprefixed) classes for the smallest viewport, then layer `md:`/`lg:`/`xl:` up — not the reverse. A layout that works at 1440px is not assumed to work at 320px; verify it does.

```jsx
<div className="flex flex-col gap-4 md:flex-row md:gap-8">
```

## Responsive = adapt, not shrink

Mobile often needs a **different layout**, not a scaled-down desktop one.

```
Desktop:  Sidebar + Content
Mobile:   Header + Content + Drawer nav      (not a squeezed sidebar)
```

This applies to layout, content hierarchy, navigation pattern, typography scale, spacing, buttons, cards, tables, forms, images, and interaction pattern (hover-dependent UI needs a tap-friendly equivalent).

## Scope discipline for responsive changes

A request scoped to one breakpoint stays scoped to it. "Fix mobile card spacing" touches mobile card spacing — not tablet/desktop behavior — unless the fix genuinely requires a shared value to change.

## Layout systems

Prefer Flexbox, CSS Grid, `Container`/`Section` primitives, `min-w-0`/`min-h-0` for correct flex/grid shrinking, `clamp()` for fluid sizing (this project's heading scale already does this — see `tailwind.config.js` `fontSize`). Avoid absolute positioning for primary page layout — reserve it for badges, decorative elements, overlays, floating controls, icons inside inputs, layered compositions. Never hand-position primary layout with fixed pixel `top`/`left`.

## Container system

`Section` already wraps `Container` internally (`containerSize` prop, default `lg` = `max-w-6xl`) — don't hand-write `mx-auto max-w-* px-*` per section, and don't double-wrap with an explicit `<Container>` inside `<Section>`. Keep sibling sections on the same `containerSize` unless one is intentionally full-bleed.

```tsx
<Section spacing="md" containerSize="lg">...</Section>
```

Use `Container` directly only outside a `Section` context (e.g. inside a custom full-bleed hero that needs one narrower inner column).
