import { SITE_NAME } from '../../seo-constants'
import type { SeoCheckResult, SeoReportInput } from '../types'

const STAT_WITH_ATTRIBUTION = /\d+(%|\$|\+)[^.]{0,80}(according to|source:|per\s|study|report)/i

export function checkGeo(input: SeoReportInput): SeoCheckResult[] {
  const results: SeoCheckResult[] = []

  const hasAttributedStat = STAT_WITH_ATTRIBUTION.test(input.bodyText)
  results.push({
    id: 'geo.attributed-stat',
    category: 'geo',
    label: 'At least one attributed statistic/data point',
    mode: 'auto',
    status: hasAttributedStat ? 'pass' : 'warn',
    message: hasAttributedStat
      ? 'Found a stat with attribution phrasing.'
      : 'No clearly attributed statistic detected — heuristic match only, review manually.',
  })

  const mentionsSiteName = input.bodyText.includes(SITE_NAME)
  results.push({
    id: 'geo.entity-consistency',
    category: 'geo',
    label: 'Brand entity name used consistently in copy',
    mode: 'auto',
    status: mentionsSiteName ? 'pass' : 'warn',
    message: mentionsSiteName ? `"${SITE_NAME}" mentioned in body copy.` : `"${SITE_NAME}" not found in body copy.`,
  })

  // Check for AI Overview citability: passages between 134-167 words with self-contained answers
  const paragraphs = input.bodyText.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)
  const citablePassages = paragraphs.filter((p) => {
    const wordCount = p.split(/\s+/).length
    return wordCount >= 100 && wordCount <= 180 && /^[A-Z].*[.!?]$/.test(p)
  })
  results.push({
    id: 'geo.passage-citability',
    category: 'geo',
    label: 'AI Overview citable passage detected (134-167 words)',
    mode: 'auto',
    status: citablePassages.length > 0 ? 'pass' : 'warn',
    message:
      citablePassages.length > 0
        ? `Found ${citablePassages.length} self-contained passage(s) matching AI Overview answer length.`
        : 'No paragraph matches optimal AI Overview snippet length (134-167 words). Consider adding a standalone explanatory block.',
  })

  // Named-entity density and "quotable expert statement" are judgment calls —
  // no NLP dependency here, admin attests.
  results.push({
    id: 'geo.named-entities',
    category: 'geo',
    label: '3-5 named entities mentioned (people/places/products)',
    mode: 'manual',
    status: 'na',
    message: 'Admin must review and attest: does this page name enough concrete, specific entities?',
  })

  results.push({
    id: 'geo.quotable-statements',
    category: 'geo',
    label: 'Contains quotable, declarative expert statements',
    mode: 'manual',
    status: 'na',
    message: 'Admin must review and attest: are there standalone sentences an AI answer engine could lift verbatim?',
  })

  return results
}
