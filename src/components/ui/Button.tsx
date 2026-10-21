import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

type BaseProps = {
  variant?: Variant
  size?: Size
  className?: string
  children: React.ReactNode
}

const variants: Record<Variant, string> = {
  primary: 'bg-brand-500 text-neutral-0 hover:bg-brand-600 shadow-elev-1',
  secondary: 'bg-brand-50 text-brand-900 border border-brand-200 hover:bg-brand-100',
  ghost: 'bg-transparent text-foreground hover:bg-brand-50',
}

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-body-xs',
  md: 'px-6 py-3 text-body-sm',
  lg: 'px-8 py-4 text-body-md',
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-radius-pill font-sans font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none'

/**
 * Shared button. Renders an `<a>` when `href` is provided, otherwise a `<button>`.
 * Use everywhere instead of raw button/anchor styling.
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  href,
  ...rest
}: BaseProps &
  (
    | ({ href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
    | ({ href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>)
  )) {
  const classes = cn(base, variants[variant], sizes[size], className)

  if (href) {
    return (
      <a href={href} className={classes} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
