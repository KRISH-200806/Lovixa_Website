import { cn } from '@/lib/cn'

/** Surface container for grouped content. */
export default function Card({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('rounded-radius-lg border border-brand-200 bg-brand-50 p-6', className)}>
      {children}
    </div>
  )
}
