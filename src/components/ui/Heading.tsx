import React from 'react'
import { cn } from '@/lib/cn'

type HeadingLevel = 1 | 2 | 3 | 4 | 5

export interface HeadingProps {
  as?: `h${HeadingLevel}`
  size?: HeadingLevel
  className?: string
  children: React.ReactNode
}

const sizeClasses: Record<HeadingLevel, string> = {
  1: 'text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2B1822] tracking-tight leading-tight',
  2: 'text-xl sm:text-2xl lg:text-3xl font-bold text-[#2B1822] tracking-tight leading-tight',
  3: 'text-lg sm:text-xl font-bold text-[#2B1822] tracking-tight leading-snug',
  4: 'text-base sm:text-lg font-bold text-[#2B1822] leading-snug',
  5: 'text-sm sm:text-base font-bold text-[#2B1822] leading-snug',
}

/**
 * Single source of truth for headings.
 * `as` controls the semantic tag; `size` controls the visual scale.
 * Standardizes to Outfit font-sans with #2B1822 Espresso tone.
 */
export function Heading({ as = 'h2', size, className, children }: HeadingProps) {
  const Tag = as
  const level = (size ?? Number(as.replace('h', ''))) as HeadingLevel
  return <Tag className={cn('font-sans', sizeClasses[level], className)}>{children}</Tag>
}

export default Heading
