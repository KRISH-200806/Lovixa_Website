import { cn } from '@/lib/cn'

type HeadingLevel = 1 | 2 | 3 | 4 | 5

type HeadingProps = {
  as?: `h${HeadingLevel}`
  size?: HeadingLevel
  className?: string
  children: React.ReactNode
}

const sizeClasses: Record<HeadingLevel, string> = {
  1: 'text-h1',
  2: 'text-h2',
  3: 'text-h3',
  4: 'text-h4',
  5: 'text-h5',
}

/**
 * Single source of truth for headings.
 * `as` controls the semantic tag; `size` controls the visual scale.
 * Always uses the heading font family from the design tokens.
 */
export default function Heading({ as = 'h2', size, className, children }: HeadingProps) {
  const Tag = as
  const level = (size ?? Number(as.replace('h', ''))) as HeadingLevel
  return <Tag className={cn('font-heading', sizeClasses[level], className)}>{children}</Tag>
}
