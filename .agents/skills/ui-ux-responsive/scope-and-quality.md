# Scope Discipline & Anti-Generic-AI-UI

## Minimal-scope changes

A UI prompt is not an invitation to redesign. Match the request's actual scope:

| Request | Do | Don't |
|---|---|---|
| "Make the mobile card spacing smaller" | Adjust mobile card spacing | Touch tablet/desktop, restyle the card |
| "Add animation to the hero" | Add the animation | Redesign the hero |
| "Make the navbar responsive" | Fix nav responsiveness | Change the site's visual language |
| "Improve this page" | Inspect existing design, improve within it | Introduce a new design language |

Preserve behavior and styling outside the requested scope unless the change genuinely requires a cross-cutting update (e.g. a shared token must change).

## No over-engineering

Simplest implementation that satisfies the requirement. Don't add components/hooks/contexts/state/dependencies/abstractions the task doesn't need. Don't add a new dependency when the existing stack (Tailwind, `motion`, existing `ui/` primitives) already covers it.

## Avoid generic AI-UI patterns

Decoration must support hierarchy, not replace it. Red flags in AI-generated UI to avoid here:

- Every section wrapped in a card/border/shadow
- Gradients or glassmorphism added without a design reason
- Oversized shadows on everything
- Badge/pill overuse for non-status content
- Too many floating/decorative elements (blobs, orbs) with no functional purpose
- Animating everything on scroll instead of the elements that benefit from it
- Random icon choices not tied to existing icon set (`lucide-react`, per `02-tech-stack-and-dependencies.md`)
- Colors outside the token set "because it looks nice"

## Conflict priority (repeat from SKILL.md, apply when trading off)

Functional correctness → existing design-system consistency → accessibility → responsive behavior → usability → performance → visual polish → animation/decoration. Lower items never win over higher ones.
