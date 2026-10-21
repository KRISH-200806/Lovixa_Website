---
name: animation-standards
description: Animation library tiering for this project — Motion (primary), Tailwind/CSS transitions (secondary), GSAP (advanced, explicit-only). Use whenever adding or reviewing any UI animation, transition, scroll effect, or motion requirement.
user-invocable: false
---

# Animation Standards

This project uses a **fixed three-tier animation stack**. Pick the lowest tier that satisfies the requirement — never reach for GSAP by default, never reach for JS when CSS suffices.

| Tier | Library | When |
|------|---------|------|
| 1 — Secondary | Tailwind / native CSS transitions | Hover/focus states, single-property toggles, simple show/hide |
| 2 — **Primary** | `motion` (`motion/react`) | Enter/exit, scroll reveals, stagger/orchestration, drag, layout animation, gestures |
| 3 — Advanced | GSAP (`gsap` + `@gsap/react`) | Only when explicitly requested, or need exceeds Motion's model (SVG morph, ScrollTrigger pin/scrub, non-React-tree timelines) |

Full decision criteria: [decision-tree.md](./decision-tree.md)

## Topics

- [decision-tree.md](./decision-tree.md) — which tier, with concrete examples and the "explicitly required" bar for GSAP
- [tailwind-transitions.md](./tailwind-transitions.md) — Tier 1 patterns, reduced-motion variants
- [motion-patterns.md](./motion-patterns.md) — Tier 2 patterns: variants, AnimatePresence, scroll, layout, gestures
- [gsap-advanced.md](./gsap-advanced.md) — Tier 3 patterns: `useGSAP`, ScrollTrigger, cleanup, bundle isolation

## Hard rules

1. Dependency is named `motion`, not `framer-motion`. Import from `motion/react`.
2. Never install/import GSAP for something Tier 1 or 2 already covers.
3. Every Tier 2/3 animation component needs `'use client'`.
4. Respect reduced-motion for anything beyond a basic hover transition.
5. GSAP stays scoped to the component that needs it — dynamic-import it, don't let it inflate the shared bundle.

---
*Standard Rules Prepared By: Flexion Infotech Private Limited*
