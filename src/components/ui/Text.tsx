import React from 'react'
import { cn } from '@/lib/cn'

type TextSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs'
type TextTone = 'default' | 'dark' | 'muted' | 'brand'

export interface TextProps<T extends React.ElementType> {
  as?: T
  size?: TextSize
  tone?: TextTone
  className?: string
  children: React.ReactNode
}

const sizeClasses: Record<TextSize, string> = {
  xl: 'text-lg sm:text-xl leading-relaxed',
  lg: 'text-base sm:text-lg leading-relaxed',
  md: 'text-sm sm:text-base leading-relaxed',
  sm: 'text-xs sm:text-sm leading-normal',
  xs: 'text-[11px] sm:text-xs leading-normal',
}

const toneClasses: Record<TextTone, string> = {
  default: 'text-[#2B1822]/80',
  dark: 'text-[#2B1822]',
  muted: 'text-[#2B1822]/65',
  brand: 'text-[#6B2D5C]',
}

/** Single source of truth for body copy. Always uses the Outfit body font family. */
export function Text<T extends React.ElementType = 'p'>({
  as,
  size = 'md',
  tone = 'default',
  className,
  children,
  ...rest
}: TextProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof TextProps<T>>) {
  const Component = as || 'p'
  return (
    <Component className={cn('font-sans', sizeClasses[size], toneClasses[tone], className)} {...rest}>
      {children}
    </Component>
  )
}

export default Text
