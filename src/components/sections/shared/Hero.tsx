import { Section, Heading, Text } from '@/components/ui'

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

export default function Hero({ hero }: { hero?: { title?: unknown; subtitle?: unknown } }) {
  if (!hero) return null
  const title = resolveText(hero.title)
  const subtitle = resolveText(hero.subtitle)

  if (!title && !subtitle) return null

  return (
    <Section spacing="lg">
      {title && (
        <Heading as="h1" className="mb-6">
          {title}
        </Heading>
      )}
      {subtitle && (
        <Text size="lg" tone="muted" className="max-w-2xl">
          {subtitle}
        </Text>
      )}
    </Section>
  )
}
