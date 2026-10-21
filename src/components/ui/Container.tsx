import { cn } from '@/lib/cn'

type ContainerProps<T extends React.ElementType> = {
  as?: T
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children: React.ReactNode
}

const sizes = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
}

/** Centered, horizontally padded content wrapper used by every section. */
export default function Container<T extends React.ElementType = 'div'>({
  as,
  size = 'lg',
  className,
  children,
  ...rest
}: ContainerProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof ContainerProps<T>>) {
  const Component = as || 'div'
  return (
    <Component className={cn('mx-auto w-full px-6', sizes[size], className)} {...rest}>
      {children}
    </Component>
  )
}
