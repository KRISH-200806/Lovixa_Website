import { Section, Heading, Text, SafeImage } from '@/components/ui'

function resolveText(val: unknown): string {
  if (!val) return ''
  if (typeof val === 'string') return val
  if (typeof val === 'object' && val !== null) {
    const values = Object.values(val as Record<string, unknown>)
    for (const v of values) {
      if (typeof v === 'string' && v.trim()) return v
    }
  }
  return String(val)
}

export default function ContentSection({
  block,
}: {
  block?: { heading?: unknown; body?: unknown; image?: unknown }
}) {
  if (!block) return null
  const heading = resolveText(block.heading)
  const body = resolveText(block.body)

  if (!heading && !body && block.image == null) {
    return (
      <Section>
        <div className="rounded-radius border border-dashed border-border/60 bg-surface/30 p-8 text-center text-body-sm text-neutral-400">
          ✨ <strong>Content Section Added</strong> — Expand the section on the left and enter your Heading or Body text to preview it here.
        </div>
      </Section>
    )
  }

  return (
    <Section>
      {heading && (
        <Heading as="h2" className="mb-4">
          {heading}
        </Heading>
      )}
      {body && (
        <Text tone="muted" className="mb-8 max-w-3xl">
          {body}
        </Text>
      )}
      {block.image != null && (
        <div className="relative aspect-[16/9] max-w-3xl overflow-hidden rounded-radius-lg">
          <SafeImage
            media={block.image as { url?: string; filename?: string } | string}
            alt={heading || 'Section image'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}
    </Section>
  )
}
