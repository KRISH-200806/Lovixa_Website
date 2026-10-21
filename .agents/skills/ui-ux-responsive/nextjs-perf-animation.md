# Next.js Architecture, Images, Performance, Animation

## Server/Client boundary

Default to Server Components. `'use client'` only on the smallest component that genuinely needs interactivity/state/effects/browser APIs — never promote a whole page to client for one interactive widget. Pass server-fetched data into the client island as props.

```tsx
// page.tsx — stays a Server Component
export default async function Page() {
  const data = await getMappedGlobalPage(...)
  return <FaqAccordion items={data.faqs} />   // only this is 'use client'
}
```

Avoid unnecessary client-side state and avoid hydration mismatches (no `Date.now()`/`Math.random()`/browser-only values rendered during SSR without guarding).

## Images

Use `next/image`, not raw `<img>`, for real content images (already how `Media` collection assets should resolve via `getMediaUrl`). Set width/height or use `fill` with a sized/aspect-ratio'd parent so layout doesn't shift. Pick `object-fit` intentionally (`cover` for fills, `contain` for logos/icons). Don't hardcode pixel dimensions that break responsiveness — size via the parent + `sizes` attribute instead.

## Animation

Follow `animation-standards` skill — don't duplicate its rules here, just the pointer: Tailwind/CSS transitions for simple hover/focus states → **Motion** (`motion/react`) as the primary library for anything JS-driven → GSAP only when explicitly required or genuinely beyond Motion's model. Never introduce a second library for a problem one already solves. Prefer `transform`/`opacity` for animated properties; avoid animating `width`/`height`/`top`/`left`/`margin` continuously. Respect `prefers-reduced-motion` (Tailwind's `motion-reduce:`/`motion-safe:` variants, or Motion's `useReducedMotion()`).

## Performance

Don't reach for JavaScript when CSS solves it, and don't add an animation library when a CSS transition is enough — see the tiering above. Keep client bundles lean: dynamic-import heavy/rarely-used interactive pieces.
