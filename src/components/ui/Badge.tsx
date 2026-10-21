import React from 'react'
import { cn } from '@/lib/cn'

export type BadgeTone = 'brand' | 'blush' | 'neutral' | 'success' | 'gold'

export interface BadgeProps {
  tone?: BadgeTone
  className?: string
  children: React.ReactNode
}

const tones: Record<BadgeTone, string> = {
  brand: 'bg-[#6B2D5C] text-white shadow-xs',
  blush: 'bg-[#E8C4D4]/30 text-[#6B2D5C] border border-[#E8C4D4]/60',
  neutral: 'bg-stone-100 text-[#2B1822]/80 border border-stone-200',
  success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
  gold: 'bg-amber-50 text-amber-900 border border-amber-200',
}

/** Small luxury pill label for statuses, offers, and tags. */
export function Badge({
  tone = 'blush',
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 font-sans text-[10px] sm:text-[11px] font-bold uppercase tracking-widest rounded-full',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export default Badge
