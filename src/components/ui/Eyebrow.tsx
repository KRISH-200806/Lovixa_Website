import { cn } from '@/lib/cn'

/** Small uppercase label placed above a heading. */
export default function Eyebrow({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-block font-sans text-body-xs uppercase tracking-widest text-brand-500',
        className,
      )}
    >
      {children}
    </span>
  )
}
