import { cn } from '@/lib/cn'
import Container from './Container'

type SectionProps = {
  id?: string
  containerSize?: 'sm' | 'md' | 'lg'
  spacing?: 'sm' | 'md' | 'lg'
  className?: string
  children: React.ReactNode
}

const spacings = {
  sm: 'py-10',
  md: 'py-16',
  lg: 'py-24',
}

/** Vertical rhythm wrapper. Standardizes section spacing site-wide. */
export default function Section({
  id,
  containerSize = 'lg',
  spacing = 'md',
  className,
  children,
}: SectionProps) {
  return (
    <section id={id} className={cn(spacings[spacing], className)}>
      <Container size={containerSize}>{children}</Container>
    </section>
  )
}
