# Inspect Before Implementing

Before writing or modifying any UI code, check these files — in this order:

1. `tailwind.config.js` — actual colors, font sizes, radius, shadow tokens (source of truth — if a doc disagrees with this file, the file wins, but flag the drift)
2. `09-theme-and-design-system.md` — token rationale, usage examples
3. `src/components/ui/index.ts` — existing primitives (`Container`, `Section`, `Heading`, `Text`, `Eyebrow`, `Button`, `Card`, `Badge`)
4. `src/app/(frontend)/styles.css` — CSS variables (`--background`, `--subtext-*`, `--page-accent-color`)
5. The specific page/section files being touched — existing local patterns win over generic best practice

Do not introduce a new design language when one already exists. Do not skip this step because the task "seems simple."

## Component reuse decision

Before creating any new component:

1. Does `src/components/ui/` already have it (or something close)? → Use it.
2. Can an existing primitive be composed/extended (new `variant`, new prop) to cover this? → Extend it.
3. Only if neither applies → create new, and add it to `src/components/ui/index.ts` per `09-theme-and-design-system.md`'s reusability rule.

Normally-shared components in this project: `Button`, `Card`, `Badge`, `Heading`, `Text`, `Container`, `Section`, `Eyebrow`. Never duplicate one of these with a slightly different name (`Card2`, `CardAlt`, `PrimaryButton` next to `Button`).

```tsx
// ❌ one-off duplicate
function PricingCard() { return <div className="rounded-radius-lg border border-neutral-800 p-6">...</div> }

// ✅ reuse
import { Card } from '@/components/ui'
function PricingCard() { return <Card className="...">...</Card> }
```

If a needed variant doesn't exist on `Button`/`Card`/etc., add it to the shared component (new `variant`/`size` union member) rather than styling a one-off.

## Before-implementation checklist

- What existing components can be reused?
- What design tokens already exist for this (color, type, radius, shadow, spacing)?
- What breakpoints does the change actually need (not "any that exist")?
- What interaction states are required (hover/focus/active/disabled/loading/error)?
- What accessibility considerations apply?
- What loading/empty/error states does this data-driven UI need?
- What animation, if any, is actually necessary? (see [nextjs-perf-animation.md](./nextjs-perf-animation.md))

## After-implementation self-review

**UI:** existing components reused · consistent spacing/typography/colors/radius/shadows · clear hierarchy · clear primary CTA

**Responsive:** checked conceptually at 320/375/425/768/1024/1440/1920px · no unintended horizontal overflow · no clipping/broken grids/overlap

**Accessibility:** semantic HTML · keyboard reachable · focus states visible · labels present · contrast adequate · alt text correct · touch targets ≥44px

**UX:** loading/empty/error/success/disabled states present where data-driven · feedback is clear

**Animation:** correct tier used (see `animation-standards` skill) · nothing unnecessary · consistent timing · reduced-motion respected

**Next.js:** Server Component by default · `'use client'` only where needed and isolated · no hydration risk · `next/image` used for real images

**Scope:** did this touch only what the request asked for? (see [scope-and-quality.md](./scope-and-quality.md))
