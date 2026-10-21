import type { SeoCheckResult, SeoReportInput } from '../types'

const MIN_WORD_COUNT: Record<SeoReportInput['pageType'], number> = {
  home: 500,
  service: 1200,
  article: 1500,
  generic: 500,
}

const STALE_DAYS = 90

export function checkContent(input: SeoReportInput): SeoCheckResult[] {
  const results: SeoCheckResult[] = []
  const min = MIN_WORD_COUNT[input.pageType]

  results.push({
    id: 'content.word-count',
    category: 'content',
    label: `Word count meets ${input.pageType} tier minimum (${min}+)`,
    mode: 'auto',
    status: input.wordCount >= min ? 'pass' : 'warn',
    message: `${input.wordCount} words (target ${min}+ for ${input.pageType} pages).`,
  })

  results.push({
    id: 'content.author-byline',
    category: 'content',
    label: 'Author byline present (E-E-A-T)',
    mode: 'auto',
    status: input.authorName ? 'pass' : 'warn',
    message: input.authorName ? `Author: ${input.authorName}` : 'No author byline set.',
  })

  if (input.lastUpdated) {
    const days = (Date.now() - new Date(input.lastUpdated).getTime()) / 86_400_000
    results.push({
      id: 'content.freshness',
      category: 'content',
      label: `Updated within last ${STALE_DAYS} days`,
      mode: 'auto',
      status: days <= STALE_DAYS ? 'pass' : 'warn',
      message: `Last updated ${Math.round(days)} day(s) ago.`,
    })
  } else {
    results.push({
      id: 'content.freshness',
      category: 'content',
      label: 'Content freshness',
      mode: 'auto',
      status: 'na',
      message: 'No last-updated date available.',
    })
  }

  // Helpful Content self-audit — inherently judgment calls, admin-attested.
  results.push({
    id: 'content.helpful-content-audit',
    category: 'content',
    label: 'Helpful Content self-audit (13 questions) reviewed',
    mode: 'manual',
    status: 'na',
    message: 'Admin must review and attest: does this page provide original value beyond what search results already show?',
  })

  return results
}
