---
name: ui-ux-responsive
description: Production-grade UI/UX and responsive design rules for this project — inspect existing tokens/components before implementing, reuse over invent, mobile-first responsive, accessible, minimal-scope changes. Use whenever creating, modifying, redesigning, or reviewing any UI.
user-invocable: false
---

# UI/UX + Responsive Design

Goal: every UI change looks like it was designed as part of this product — not generic AI output. **Reuse existing tokens and components over inventing new ones.**

## Topics

- [inspect-and-reuse.md](./inspect-and-reuse.md) — mandatory inspection pass, component-reuse decision, before/after self-review checklists
- [tokens-and-hierarchy.md](./tokens-and-hierarchy.md) — this project's actual color/type/radius/shadow/spacing tokens, visual hierarchy, no magic numbers
- [responsive-and-layout.md](./responsive-and-layout.md) — breakpoints, mobile-first, layout systems, validation widths
- [components-and-states.md](./components-and-states.md) — button hierarchy, interactive states, forms, loading/empty/error, responsive tables/modals/nav/cards
- [accessibility.md](./accessibility.md) — semantic HTML, keyboard, contrast, WCAG basics
- [nextjs-perf-animation.md](./nextjs-perf-animation.md) — Server/Client Component boundary, `next/image`, animation tier pointer, perf
- [scope-and-quality.md](./scope-and-quality.md) — minimal-scope edits, anti-generic-AI-UI patterns, conflict priority order

## The one rule that overrides the rest

**Do not treat every UI prompt as a redesign opportunity.** "Make the mobile card spacing smaller" changes mobile card spacing — not the desktop layout, not the color system, not unrelated components. Inspect, then make the smallest change that satisfies the request within the existing design language.

## Conflict priority order

1. Functional correctness
2. Existing project/design-system consistency
3. Accessibility
4. Responsive behavior
5. Usability
6. Performance
7. Visual polish
8. Animation/decorative effects

Never trade usability or accessibility for visual effects.

## Final gut-check

> "Does this look like it was designed as part of the same product?"

If no, revise before shipping.

---
*Standard Rules Prepared By: Flexion Infotech Private Limited*
