# Tokens, Hierarchy, No Magic Numbers

Colors are admin-managed at runtime (`theme-settings` global, per mode) — the values below are defaults, not static. Class names are unchanged; see `starter-kit/22-theme-management.md` for the mechanism. Never hardcode a hex — it becomes invisible to admin theme management, not just inconsistent.

## This project's actual tokens (`tailwind.config.js`)

```
Colors:
  brand-50…900       primary accent, brand-500 = #FB5600 (main CTA/link color)
  neutral-0/400/500/800/900/1000   text + surface grays (dark-first: 1000 = page bg)
  semantic-success/error/warning/info
  accent-red/blue/olive/peach       illustration/decorative accents only

Typography (fluid, clamp()-based):
  text-h1…h5          headings — always pair with font-heading
  text-body-xl/lg/md/sm/xs   body copy — always pair with font-sans

Radius:  radius-xs(6) sm(8) md(12) lg(16) xl(20) pill(9999)
Shadow:  elev-1…4 (subtle→dramatic), brand-glow (CTA emphasis only)
```

Use `text-neutral-400`, not `text-[#999]`. Use `rounded-radius-lg`, not `rounded-[16px]`. If a value is genuinely one-off (e.g. a decorative illustration needs an exact pixel), an arbitrary value is fine — but that's the exception, and it should not be reachable through a token that already exists.

```jsx
// ❌
<div className="rounded-[13px] mt-[37px] px-[23px] text-[19px] shadow-[0_2px_8px_rgba(0,0,0,.3)]" />

// ✅
<div className="rounded-radius-md mt-8 px-6 text-body-lg shadow-elev-2" />
```

If the exact token doesn't exist, use the closest existing one rather than inventing a new value. Only add a new token to `tailwind.config.js` when a real, recurring need exists — not for one component.

## Typography is a component, not classes

Never hand-write `font-heading text-h2` or `font-sans text-body-md text-neutral-400` inline — use `Heading`/`Text` from `@/components/ui`:

```tsx
<Heading as="h2" size={2}>Title</Heading>       // as = semantic tag, size = visual scale (can differ for SEO)
<Text tone="muted" size="md">Body copy</Text>
```

Long-form body content gets a max-width (`Container size="sm"` = `max-w-3xl`), not full-viewport line length.

## Visual hierarchy

Order of visual weight per view: primary action → primary information → supporting information → secondary actions → metadata. Not everything can be bold/large/colored — that erases hierarchy instead of creating it.

Avoid in a single view: multiple equally-bold headings, more than one dominant color, cards wrapping everything (not every group needs a bordered surface), a shadow on every element, gradients/animation used decoratively rather than functionally.

## Spacing

Use Tailwind's spacing scale consistently — larger gaps between sections (`py-16`/`py-24` via `Section`), smaller gaps between related elements (`gap-2`–`gap-4`). Don't mix unrelated values in the same layout to "nudge" something into place — that's a layout bug, not a spacing choice; fix the layout.

## Color

Use semantic intent, not raw color: `brand-500` for primary actions/links, `neutral-*` for text/surfaces, `semantic-*` for status (success/error/warning/info), `accent-*` only for decorative/illustration use. Don't introduce a new hex value when an existing token already expresses the same intent.

## Shadows

Use `shadow-elev-1`/`elev-2` for normal surface elevation (cards, dropdowns), `elev-3`/`elev-4` sparingly for high-emphasis overlays (modals), `shadow-brand-glow` only on primary CTA emphasis, not on every card. Flat stays flat when the design calls for it — don't add a shadow just because a component "feels bare."
