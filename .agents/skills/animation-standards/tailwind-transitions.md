# Tailwind / CSS Transitions (Tier 1)

Default for anything that's just a state change on hover/focus/toggle.

## Basic pattern

```jsx
<button
  className="
    transition-colors duration-200 ease-out
    bg-brand-500 hover:bg-brand-600
    motion-reduce:transition-none
  "
>
```

## Common utilities

| Need | Classes |
|------|---------|
| Color/background fade | `transition-colors duration-200` |
| Transform (scale/translate) | `transition-transform duration-300 ease-out hover:scale-105` |
| Opacity fade | `transition-opacity duration-150` |
| Everything | `transition-all` — avoid; animates properties you didn't intend (layout thrash risk) |
| Custom easing | `ease-in`, `ease-out`, `ease-in-out`, or arbitrary `ease-[cubic-bezier(...)]` |

## Group and peer patterns

```jsx
<div className="group">
  <img className="transition-transform duration-300 group-hover:scale-110" />
</div>

<input className="peer" />
<span className="opacity-0 peer-focus:opacity-100 transition-opacity" />
```

## Data-attribute driven (e.g. Radix/Headless UI state)

```jsx
<div className="transition-all duration-200 data-[state=open]:h-auto data-[state=closed]:h-0" />
```

## Reduced motion

Prefer Tailwind variants over manual media queries:

```jsx
className="transition-transform motion-safe:hover:scale-105 motion-reduce:transition-none"
```

## When to stop using Tailwind and move to Motion

- Need to sequence/stagger multiple elements
- Need to trigger on scroll into viewport (not just hover)
- Need exit animation (element unmounting) — CSS transitions can't animate on unmount, `AnimatePresence` (Motion) can
- Need spring physics or gesture (drag) response
