import type { SeoCheckResult, SeoReportInput } from '../types'

const QUESTION_START = /^(what|how|why|when|where|can|do|does|is|are)\b/i

export function checkHeadings(input: SeoReportInput): SeoCheckResult[] {
  const results: SeoCheckResult[] = []
  const h1s = input.headings.filter((h) => h.level === 1)
  const h2s = input.headings.filter((h) => h.level === 2)
  const h3s = input.headings.filter((h) => h.level === 3)

  results.push({
    id: 'headings.single-h1',
    category: 'headings',
    label: 'Exactly one H1',
    mode: 'auto',
    status: h1s.length === 1 ? 'pass' : 'fail',
    message: `Found ${h1s.length} H1(s).`,
  })

  let hasSkippedLevel = false
  let prevLevel = 1
  for (const h of input.headings) {
    if (h.level > prevLevel + 1) {
      hasSkippedLevel = true
      break
    }
    prevLevel = Math.max(prevLevel, h.level)
  }

  results.push({
    id: 'headings.hierarchy',
    category: 'headings',
    label: 'No skipped heading levels (e.g. H3 without H2)',
    mode: 'auto',
    status: hasSkippedLevel ? 'fail' : 'pass',
    message: hasSkippedLevel
      ? 'Heading levels skipped (e.g. H1 followed directly by H3). Use sequential H1 > H2 > H3.'
      : 'Heading hierarchy is sequential.',
  })

  const questionH2s = h2s.filter((h) => QUESTION_START.test(h.text.trim()))
  results.push({
    id: 'headings.question-format',
    category: 'headings',
    label: 'At least one question-format H2 (AEO)',
    mode: 'auto',
    status: h2s.length === 0 ? 'na' : questionH2s.length > 0 ? 'pass' : 'warn',
    message:
      h2s.length === 0
        ? 'No H2 headings to evaluate.'
        : `${questionH2s.length} of ${h2s.length} H2s are question-format.`,
  })

  return results
}
