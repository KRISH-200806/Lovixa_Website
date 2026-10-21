# Decision Tree

Ask in order. Stop at the first "yes".

## 1. Is it a single-property state change triggered by hover/focus/active/data-attribute toggle?

→ **Tailwind/CSS transition.** (color, opacity, simple transform, border, shadow)

Examples: button hover color, focus ring, disabled-state opacity, accordion max-height toggle via `data-[state=open]`.

## 2. Does it need JS-driven timing, orchestration, viewport detection, gestures, or layout animation?

→ **Motion** (`motion/react`). This is the default for anything that isn't Tier 1.

Examples: fade/slide-in on scroll into view, staggered list item entrance, modal/drawer enter-exit (`AnimatePresence`), draggable card, animating layout on content reflow (`layout` prop), page-transition wrapper.

## 3. Does the task explicitly say "GSAP" / "ScrollTrigger" / "timeline", OR does it need one of these Motion genuinely can't do well?

→ **GSAP**, scoped to that component only.

Concrete GSAP-justified cases:
- SVG path drawing/morphing (`MorphSVGPlugin`, stroke-dashoffset timelines)
- Scroll-scrubbed or pinned sections (`ScrollTrigger` `scrub`/`pin`)
- One timeline sequencing many unrelated DOM nodes not modeled as a single React tree (e.g. a hero built from several independently-rendered widgets)
- Canvas/WebGL-driven animation loops

**Not** GSAP-justified (use Motion instead):
- "Make it feel snappier/smoother" — tune Motion's `transition` config
- Staggered card grid reveal — `motion` `variants` + `staggerChildren`
- Parallax scroll of one element — `useScroll` + `useTransform` in Motion
- Sticky nav shrink-on-scroll — `useScroll` in Motion, or even Tier 1 CSS `position: sticky` + transition

## If ambiguous

Default to Motion. Ask the user only if the requirement text itself says "GSAP" and it's unclear whether they mean it literally or are just describing a scroll effect — otherwise proceed with Motion and note the choice.
