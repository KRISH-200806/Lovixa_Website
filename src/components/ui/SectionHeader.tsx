import React from 'react'
import { BrushStroke } from './BrushStroke'
import { cn } from '@/lib/cn'

export interface SectionHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  withBrushStroke?: boolean
  align?: 'center' | 'left'
  className?: string
  children?: React.ReactNode
}

/**
 * Single source of truth for all section headers across LOVIXA.
 * Standardizes:
 * - Eyebrow tracking and font color
 * - Title responsive scale (text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2B1822])
 * - Subtitle line-height and max-width (text-xs sm:text-sm text-[#2B1822]/75 leading-relaxed)
 * - Signature curved brush stroke accent
 */
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  withBrushStroke = true,
  align = 'center',
  className,
  children,
}: SectionHeaderProps) {
  const isCenter = align === 'center'

  return (
    <div className={cn(isCenter ? 'text-center mb-8 sm:mb-12' : 'mb-8 sm:mb-12', className)}>
      {eyebrow && (
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#6B2D5C] font-sans block mb-2">
          {eyebrow}
        </span>
      )}
      <div className={cn('inline-block relative', isCenter ? 'mx-auto' : '')}>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-bold text-[#2B1822] tracking-tight leading-tight">
          {title}
        </h2>
        {withBrushStroke && <BrushStroke className="text-[#6B2D5C]" />}
      </div>
      {subtitle && (
        <p className={cn('text-xs sm:text-sm text-[#2B1822]/75 leading-relaxed font-sans max-w-xl mt-2', isCenter ? 'mx-auto' : '')}>
          {subtitle}
        </p>
      )}
      {children}
    </div>
  )
}

export default SectionHeader
