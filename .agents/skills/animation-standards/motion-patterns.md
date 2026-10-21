# Motion Patterns (Tier 2 — Primary)

Package: `motion` (the renamed `framer-motion`). Import from `motion/react` for React.

```bash
pnpm add motion
```

```jsx
'use client'
import { motion } from 'motion/react'
```

Never add `framer-motion` — it's the old package name. This project standardizes on `motion`.

## Server/Client boundary

Any component using `motion.*` or Motion hooks needs `'use client'` at the top of the file. Keep the motion wrapper as a small client component; pass server-fetched data in as props, don't make the whole page client just for one animated element.

## Basic enter animation

```jsx
<motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: 'easeOut' }}
/>
```

## Scroll-triggered reveal

```jsx
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.5 }}
/>
```

`viewport={{ once: true }}` — don't re-trigger on every scroll past unless the design explicitly wants that.

## Staggered children

```jsx
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

<motion.ul variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
  {items.map((it) => (
    <motion.li key={it.id} variants={item}>{it.label}</motion.li>
  ))}
</motion.ul>
```

## Enter/exit (unmount animation)

```jsx
import { AnimatePresence, motion } from 'motion/react'

<AnimatePresence>
  {open && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    />
  )}
</AnimatePresence>
```

## Layout animation

```jsx
<motion.div layout transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
```

Add `layout` when a container's size/position changes reactively (accordion, reordering list) — Motion animates the transition automatically.

## Scroll-linked value (parallax, progress bar)

```jsx
import { useScroll, useTransform, motion } from 'motion/react'

const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
const y = useTransform(scrollYProgress, [0, 1], [0, -80])

<motion.div style={{ y }} />
```

## Reduced motion

```jsx
import { useReducedMotion } from 'motion/react'

const shouldReduceMotion = useReducedMotion()
<motion.div animate={{ x: shouldReduceMotion ? 0 : 100 }} />
```

Required for anything beyond a short opacity/y fade — respect OS-level accessibility setting.

## Don't

- Don't animate `layout` on large lists without testing perf — scope it.
- Don't put `motion.div` around a Server Component's async boundary — client wrapper only.
- Don't reintroduce `framer-motion` import paths from older tutorials — always `motion/react`.
