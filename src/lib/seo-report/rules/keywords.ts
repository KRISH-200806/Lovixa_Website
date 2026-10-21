import type { SeoCheckResult, SeoReportInput } from '../types'

function contains(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase())
}

export function checkKeywords(input: SeoReportInput): SeoCheckResult[] {
  const results: SeoCheckResult[] = []
  const kw = input.primaryKeyword

  if (!kw) {
    results.push({
      id: 'keywords.no-plan',
      category: 'keywords',
      label: 'Primary keyword placement',
      mode: 'auto',
      status: 'na',
      message: 'No primary keyword planned for this page in keyword-plan.json — skipping placement checks.',
    })
    return results
  }

  const h1 = input.headings.find((h) => h.level === 1)?.text ?? ''
  const first100 = input.bodyText.trim().split(/\s+/).slice(0, 100).join(' ')
  const h2Match = input.headings.some((h) => h.level === 2 && contains(h.text, kw))

  results.push({
    id: 'keywords.in-h1',
    category: 'keywords',
    label: 'Primary keyword in H1',
    mode: 'auto',
    status: contains(h1, kw) ? 'pass' : 'fail',
    message: contains(h1, kw) ? `Found in H1: "${h1}"` : `Keyword "${kw}" not found in H1.`,
  })

  results.push({
    id: 'keywords.in-first-100',
    category: 'keywords',
    label: 'Primary keyword in first 100 words',
    mode: 'auto',
    status: contains(first100, kw) ? 'pass' : 'fail',
    message: contains(first100, kw) ? 'Found in opening copy.' : 'Not found in first 100 words.',
  })

  results.push({
    id: 'keywords.in-h2',
    category: 'keywords',
    label: 'Primary keyword in at least one H2',
    mode: 'auto',
    status: h2Match ? 'pass' : 'warn',
    message: h2Match ? 'Found in an H2.' : 'Not found in any H2.',
  })

  results.push({
    id: 'keywords.in-meta-title',
    category: 'keywords',
    label: 'Primary keyword in meta title',
    mode: 'auto',
    status: input.metaTitle && contains(input.metaTitle, kw) ? 'pass' : 'fail',
    message: input.metaTitle && contains(input.metaTitle, kw) ? 'Found in meta title.' : 'Not found in meta title.',
  })

  results.push({
    id: 'keywords.in-meta-description',
    category: 'keywords',
    label: 'Primary keyword in meta description',
    mode: 'auto',
    status: input.metaDescription && contains(input.metaDescription, kw) ? 'pass' : 'fail',
    message:
      input.metaDescription && contains(input.metaDescription, kw)
        ? 'Found in meta description.'
        : 'Not found in meta description.',
  })

  // Stuffing check: keyword density over 3% of body word count flags a warning.
  if (input.wordCount > 0) {
    const kwWords = kw.toLowerCase().split(/\s+/).length
    const occurrences = input.bodyText.toLowerCase().split(kw.toLowerCase()).length - 1
    const density = (occurrences * kwWords) / input.wordCount
    results.push({
      id: 'keywords.no-stuffing',
      category: 'keywords',
      label: 'No keyword stuffing (density < 3%)',
      mode: 'auto',
      status: density > 0.03 ? 'warn' : 'pass',
      message: `Keyword density ${(density * 100).toFixed(1)}%.`,
    })
  }

  return results
}
