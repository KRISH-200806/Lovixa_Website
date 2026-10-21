import { cn } from '@/lib/cn'

type Tone = 'brand' | 'neutral' | 'success' | 'error'

const tones: Record<Tone, string> = {
  brand: 'bg-brand-500/15 text-brand-500',
  neutral: 'bg-neutral-800 text-neutral-400',
  success: 'bg-semantic-success/15 text-semantic-success',
  error: 'bg-semantic-error/15 text-semantic-error',
}

/** Small pill label for statuses and tags. */
export default function Badge({
  tone = 'neutral',
  className,
  children,
}: {
  tone?: Tone
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-radius-pill px-3 py-1 font-sans text-body-xs font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
