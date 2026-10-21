import type { SeoCheckResult, SeoReportInput } from '../types'

const HIDDEN_TEXT_PATTERN = /(display\s*:\s*none|visibility\s*:\s*hidden|font-size\s*:\s*0)/i

/**
 * 17-item spam/compliance red-flag checklist (flexion-seo-playbook.md §11.1).
 * Auto-computable items are checked here; the rest are judgment calls the
 * admin must attest to. A single fail in this category caps the overall
 * report score (see scoring.ts) — compliance is a gate, not a weighted input.
 */
const MANUAL_COMPLIANCE_ITEMS: { id: string; label: string }[] = [
  { id: 'doorway-pages', label: 'No doorway pages (near-duplicate pages targeting keyword variants)' },
  { id: 'scraped-content', label: 'No scraped/duplicated content from other sites' },
  { id: 'thin-affiliate', label: 'No thin affiliate content with no added value' },
  { id: 'unedited-ai-content', label: 'No unedited/unreviewed AI-generated content published' },
  { id: 'automated-mass-content', label: 'No automated mass content generation' },
  { id: 'sneaky-redirects', label: 'No sneaky redirects' },
  { id: 'misleading-functionality', label: 'No misleading page functionality' },
  { id: 'expired-domain-abuse', label: 'No expired-domain abuse' },
  { id: 'site-reputation-abuse', label: 'No third-party content hosted purely to exploit site reputation' },
  { id: 'ai-overview-manipulation', label: 'No content designed to manipulate AI Overviews' },
  { id: 'recommendation-poisoning', label: 'No recommendation poisoning (manufactured self-favoring lists)' },
  { id: 'link-schemes', label: 'No link schemes (bought links, PBNs, exchanges)' },
]

export function checkCompliance(input: SeoReportInput): SeoCheckResult[] {
  const results: SeoCheckResult[] = []

  const hasHiddenText = HIDDEN_TEXT_PATTERN.test(input.bodyText)
  results.push({
    id: 'compliance.no-hidden-text',
    category: 'compliance',
    label: 'No hidden text/links (CSS-hidden content)',
    mode: 'auto',
    status: hasHiddenText ? 'fail' : 'pass',
    message: hasHiddenText ? 'Body content contains hidden-text CSS patterns.' : 'No hidden-text patterns detected.',
  })

  const stuffed = input.headings.some((h) => /(.)\1{0,1}\b(\w+)\b.*\b\2\b.*\b\2\b/i.test(h.text))
  results.push({
    id: 'compliance.no-heading-stuffing',
    category: 'compliance',
    label: 'No keyword stuffing in headings',
    mode: 'auto',
    status: stuffed ? 'warn' : 'pass',
    message: stuffed ? 'A heading repeats the same word 3+ times — review for stuffing.' : 'Headings look clean.',
  })

  const schemaTypeMismatch = input.jsonLdTypes.includes('FAQPage') && input.faq.length === 0
  results.push({
    id: 'compliance.no-deceptive-schema',
    category: 'compliance',
    label: 'Structured data matches visible content (no deceptive schema)',
    mode: 'auto',
    status: schemaTypeMismatch ? 'fail' : 'pass',
    message: schemaTypeMismatch
      ? 'FAQPage schema emitted with no matching visible FAQ content.'
      : 'Schema types match visible content.',
  })

  for (const item of MANUAL_COMPLIANCE_ITEMS) {
    results.push({
      id: `compliance.${item.id}`,
      category: 'compliance',
      label: item.label,
      mode: 'manual',
      status: 'na',
      message: 'Admin must review and attest.',
    })
  }

  return results
}
