import { Section, Heading, Text } from '@/components/ui'
import { faqPageSchema, JsonLd, type FaqItem } from '@/lib/seo/jsonld'

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

/**
 * Renders an accordion-free FAQ list (semantic <details>/<summary> — free
 * keyboard/AT support, no JS) and emits FAQPage JSON-LD for GEO/AEO.
 */
export default function Faq({
  block,
}: {
  block?: { heading?: unknown; items?: Array<{ question?: unknown; answer?: unknown }> }
}) {
  if (!block) return null
  const heading = resolveText(block.heading)
  const rawItems = Array.isArray(block.items) ? block.items : []

  if (!heading && rawItems.length === 0) {
    return (
      <Section>
        <div className="rounded-radius border border-dashed border-border/60 bg-surface/30 p-8 text-center text-body-sm text-neutral-400">
          ✨ <strong>FAQ Section Added</strong> — Expand the section on the left and enter your Heading and FAQ Items to preview them here.
        </div>
      </Section>
    )
  }

  const cleanItems: FaqItem[] = rawItems.map((item) => ({
    question: resolveText(item.question) || 'Untitled Question',
    answer: resolveText(item.answer) || 'Answer...',
  }))

  return (
    <Section>
      {heading && (
        <Heading as="h2" className="mb-8">
          {heading}
        </Heading>
      )}
      {cleanItems.length > 0 && (
        <div className="max-w-3xl divide-y divide-neutral-800">
          {cleanItems.map((item, i) => (
            <details key={i} className="group py-4">
              <summary className="cursor-pointer list-none font-sans text-body-lg font-medium text-neutral-0 marker:content-none">
                {item.question}
              </summary>
              <Text tone="muted" className="mt-2">
                {item.answer}
              </Text>
            </details>
          ))}
        </div>
      )}
      {cleanItems.length > 0 && <JsonLd data={faqPageSchema(cleanItems)} />}
    </Section>
  )
}
