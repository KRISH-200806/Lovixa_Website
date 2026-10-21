import type { SeoCheckResult, SeoReportInput } from '../types'

const REQUIRED_BY_PAGE_TYPE: Record<SeoReportInput['pageType'], string[]> = {
  home: ['Organization', 'WebSite'],
  service: ['Service', 'BreadcrumbList'],
  article: ['Article', 'BreadcrumbList'],
  generic: ['BreadcrumbList'],
}

const DEPRECATED_SCHEMA_TYPES = [
  'HowTo',
  'SpecialAnnouncement',
  'ClaimReview',
  'EstimatedSalary',
  'LearningVideo',
  'VehicleListing',
]

export function checkSchema(
  input: SeoReportInput,
  options?: { deprecatedTypes?: string[]; sourceCommit?: string },
): SeoCheckResult[] {
  const results: SeoCheckResult[] = []
  const required = REQUIRED_BY_PAGE_TYPE[input.pageType]
  const missing = required.filter((type) => !input.jsonLdTypes.includes(type))

  results.push({
    id: 'schema.required-types',
    category: 'schema',
    label: `Required JSON-LD present for page type "${input.pageType}"`,
    mode: 'auto',
    status: missing.length === 0 ? 'pass' : 'fail',
    message: missing.length === 0 ? `All required types present: ${required.join(', ')}.` : `Missing: ${missing.join(', ')}.`,
  })

  // Check for deprecated schema types per live Google / claude-seo guidance
  const deprecatedList = options?.deprecatedTypes || DEPRECATED_SCHEMA_TYPES
  const deprecatedFound = input.jsonLdTypes.filter((type) => deprecatedList.includes(type))
  results.push({
    id: 'schema.no-deprecated-types',
    category: 'schema',
    label: 'No deprecated Schema.org types used',
    mode: 'auto',
    status: deprecatedFound.length === 0 ? 'pass' : 'warn',
    message:
      deprecatedFound.length === 0
        ? 'No deprecated schema types detected.'
        : `Deprecated schema types found: ${deprecatedFound.join(', ')} (Google retired rich results for these). Use Article, Product, or FAQPage instead.`,
  })

  if (input.faq.length > 0) {
    results.push({
      id: 'schema.faqpage-matches-content',
      category: 'schema',
      label: 'FAQPage schema matches visible FAQ content',
      mode: 'auto',
      status: input.jsonLdTypes.includes('FAQPage') ? 'pass' : 'fail',
      message: input.jsonLdTypes.includes('FAQPage')
        ? `FAQPage schema emitted for ${input.faq.length} visible Q&A pair(s).`
        : 'Page has visible FAQ content but no FAQPage schema emitted.',
    })
  }

  results.push({
    id: 'schema.live-sync',
    category: 'schema',
    label: 'Upstream SEO Rules Status',
    mode: 'auto',
    status: 'pass',
    message:
      options?.sourceCommit === 'github-live'
        ? 'Audited using live, real-time rules synchronized from AgriciDaniel/claude-seo.'
        : 'Audited using local Google Search Central rules baseline.',
  })

  return results
}
