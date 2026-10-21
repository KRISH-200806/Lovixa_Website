# Components, States, Data-Driven UX

## Button hierarchy

`Button` (`@/components/ui`) ships `variant`: `primary` | `secondary` | `ghost`, `size`: `sm` | `md` | `lg`. One `primary` per context — don't make every button equally loud. Reach for `secondary`/`ghost` for lower-emphasis actions. If a destructive or icon-only variant is genuinely needed, extend `Button`'s variant union rather than styling a one-off `<button>`.

All interactive states must exist: default, hover, focus (visible — never remove `focus-visible` outline without a replacement), active, disabled (`disabled:opacity-50 disabled:pointer-events-none` already on `Button`), loading where the action is async.

## Touch targets

Interactive controls (buttons, icon buttons, nav items, close buttons, form controls) target ~44×44 CSS px on mobile. `Button`'s `sm` size (`px-4 py-2`) is close to the floor — don't go smaller for anything tappable; pad the hit area if the visual must stay small.

## Forms

Every field: a visible `<label>` (not placeholder-as-label), focus state, error state with a message that says what's wrong and how to fix it, disabled/loading state on submit. Success feedback where it matters (saved, sent).

```tsx
<label htmlFor="email" className="text-body-sm text-neutral-400">Email</label>
<input id="email" aria-invalid={hasError} aria-describedby={hasError ? 'email-error' : undefined} className="..." />
{hasError && <Text id="email-error" size="sm" className="text-semantic-error">Enter a valid email address.</Text>}
```

## Data-driven UI states

Every data-driven view considers: **loading → populated → empty → error.**

- Loading: skeleton resembling the final layout (subtle animation, not excessive) over generic "Loading…" text for content-heavy views.
- Empty: explain what's empty + why + a relevant next action. `"No leads yet." / "Import contacts or create your first lead."`
- Error: human-readable, no raw codes/stack traces (`"Error 500"` → `"We couldn't load your leads. Please try again."`), with a retry action when possible.

Never leave a major content area silently blank.

## Content-first

Design for real content variance: short/long text, missing values, long names/URLs, multi-line wraps — not just the ideal placeholder string. A card that only looks right with a 20-character title is broken.

## Responsive tables

Never let a wide table overflow the whole page. Pick one deliberately: horizontal scroll scoped to the table (`overflow-x-auto` on a wrapper, not the page), reduced/priority columns per breakpoint, or a stacked/card transformation on mobile.

## Responsive modals

Desktop: centered modal. Mobile: bottom sheet, full-screen, or near-full-width — pick what keeps content reachable and scrollable. Content must never become inaccessible (unreachable close button, unscrollable overflow) at small widths.

## Responsive navigation

Desktop and mobile nav are separate intentional layouts, not one compressed into the other. Mobile: menu button → drawer/sheet, not a shrunk desktop bar.

## Responsive cards/grids

Content-driven height by default — don't force fixed heights that clip text. Typical grid response: desktop 3–4 cols → tablet 2 → mobile 1, but let actual content/available width decide, not a rule of thumb applied blindly.
