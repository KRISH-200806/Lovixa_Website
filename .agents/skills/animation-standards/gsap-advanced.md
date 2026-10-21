# GSAP (Tier 3 — Advanced, explicit-only)

Only reach here if [decision-tree.md](./decision-tree.md) says so. Confirm the requirement is genuinely GSAP-shaped (or explicitly requested) before adding this dependency to a component.

```bash
pnpm add gsap @gsap/react
```

## Always use `useGSAP`, never bare `useEffect`

```jsx
'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

function Hero() {
  const container = useRef(null)

  useGSAP(
    () => {
      gsap.from('.hero-line', { y: 40, opacity: 0, stagger: 0.1, duration: 0.6 })
    },
    { scope: container },
  )

  return <div ref={container}>...</div>
}
```

`useGSAP` auto-reverts/cleans up animations on unmount and on dependency change — a bare `useEffect` + manual `gsap.context()` is the old pattern, don't use it in new code.

## ScrollTrigger

Register once, guarded against double-registration (React Strict Mode / HMR):

```jsx
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
```

Put registration in a small shared module (e.g. `src/lib/gsap.ts`) imported by components that need it — not repeated inline everywhere.

```jsx
useGSAP(() => {
  gsap.to('.panel', {
    scrollTrigger: { trigger: container.current, start: 'top top', end: '+=1000', scrub: true, pin: true },
    xPercent: -100 * (panelCount - 1),
  })
}, { scope: container })
```

Always kill/refresh ScrollTrigger instances tied to a component on unmount — `useGSAP`'s auto-cleanup handles this when animations are created inside its callback with `scope` set.

## Keep GSAP out of the default bundle

Dynamic-import the component that uses GSAP so pages that don't need it don't pay for it:

```jsx
import dynamic from 'next/dynamic'
const ScrollHero = dynamic(() => import('./ScrollHero'), { ssr: false })
```

`ssr: false` is required for GSAP/ScrollTrigger components — they touch `window`/DOM measurement and cannot run server-side.

## SVG morphing

```jsx
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin' // Club GreenSock plugin — confirm license/availability before use
gsap.registerPlugin(MorphSVGPlugin)
```

Flag to the user if `MorphSVGPlugin` or other paid Club GreenSock plugins are needed — they require a separate license, unlike core GSAP + ScrollTrigger (free).

## Don't

- Don't add `gsap` to a component for something a `motion.div` with `variants`/`whileInView` already does — see [decision-tree.md](./decision-tree.md).
- Don't register the same plugin repeatedly per-component — centralize.
- Don't run GSAP/ScrollTrigger in a Server Component or without `ssr: false` on the dynamic import.
- Don't leave ScrollTrigger instances unkilled on route change — confirm cleanup via `useGSAP`'s `scope`.
