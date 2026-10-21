import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/cn'
import { Loader2 } from 'lucide-react'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface BaseButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  fullWidth?: boolean
  disabled?: boolean
  className?: string
  children: React.ReactNode
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-[#6B2D5C] hover:bg-[#562349] text-white active:scale-98 shadow-xs border border-transparent',
  secondary:
    'bg-white hover:bg-[#FBF6F8] text-[#2B1822] hover:text-[#6B2D5C] border border-[#E8C4D4] active:scale-98 shadow-2xs',
  outline:
    'bg-transparent hover:bg-[#6B2D5C] text-[#6B2D5C] hover:text-white border-2 border-[#6B2D5C] active:scale-98',
  ghost:
    'bg-transparent hover:bg-[#E8C4D4]/30 text-[#2B1822] hover:text-[#6B2D5C] active:scale-98 border border-transparent',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs min-h-[36px]',
  md: 'px-6 py-3 text-xs sm:text-sm min-h-[44px]',
  lg: 'px-8 py-3.5 sm:py-4 text-sm sm:text-base min-h-[48px]',
}

const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-full font-sans font-bold uppercase tracking-wider transition-all duration-200 select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none'

export type ButtonProps = BaseButtonProps &
  (
    | ({ href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>)
    | ({ href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>)
  )

/**
 * LOVIXA Single source of truth for buttons.
 * Renders a Next.js `<Link>` when `href` is provided, otherwise a `<button>`.
 * Uniform border radius (rounded-full), typography (Outfit uppercase), and palette (#6B2D5C / #E8C4D4).
 */
export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className,
  children,
  href,
  disabled,
  ...rest
}: ButtonProps) {
  const classes = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    className,
  )

  const content = (
    <>
      {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {children}
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  )
}

export default Button
