import { cn } from '@/lib/cn'

type TextSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs'
type TextTone = 'default' | 'muted' | 'brand'

type TextProps<T extends React.ElementType> = {
  as?: T
  size?: TextSize
  tone?: TextTone
  className?: string
  children: React.ReactNode
}

const sizeClasses: Record<TextSize, string> = {
  xl: 'text-body-xl',
  lg: 'text-body-lg',
  md: 'text-body-md',
  sm: 'text-body-sm',
  xs: 'text-body-xs',
}

const toneClasses: Record<TextTone, string> = {
  default: 'text-neutral-0',
  muted: 'text-neutral-400',
  brand: 'text-brand-500',
}

/** Single source of truth for body copy. Always uses the body font family. */
export default function Text<T extends React.ElementType = 'p'>({
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
