import type { SeoCheckResult, SeoReportInput } from '../types'

export function checkAeo(input: SeoReportInput): SeoCheckResult[] {
  const results: SeoCheckResult[] = []

  const first100 = input.bodyText.trim().split(/\s+/).slice(0, 100).join(' ')
  const hasDirectAnswer = /^[A-Z].{20,}[.!?]/.test(first100.trim())
  results.push({
    id: 'aeo.direct-answer-opener',
    category: 'aeo',
    label: 'Direct-answer paragraph in first 100 words',
    mode: 'auto',
    status: hasDirectAnswer ? 'pass' : 'warn',
    message: hasDirectAnswer
      ? 'Opening copy reads as a direct, complete statement.'
      : 'Opening copy may not lead with a directly quotable answer.',
  })

  if (input.faq.length === 0) {
    results.push({
      id: 'aeo.faq-block',
      category: 'aeo',
      label: 'FAQ block present (6-12 Q&A, 40-80 words each)',
      mode: 'auto',
      status: 'warn',
      message: 'No FAQ block on this page — high-leverage for AEO citation.',
    })
  } else {
    const countOk = input.faq.length >= 6 && input.faq.length <= 12
    const badLength = input.faq.filter((f) => {
      const words = f.answer.trim().split(/\s+/).length
      return words < 40 || words > 80
    })
    results.push({
      id: 'aeo.faq-count',
      category: 'aeo',
      label: 'FAQ has 6-12 Q&A pairs',
      mode: 'auto',
      status: countOk ? 'pass' : 'warn',
      message: `${input.faq.length} FAQ pair(s) (target 6-12).`,
    })
    results.push({
      id: 'aeo.faq-answer-length',
      category: 'aeo',
      label: 'FAQ answers are 40-80 words',
      mode: 'auto',
      status: badLength.length === 0 ? 'pass' : 'warn',
      message: badLength.length === 0 ? 'All answers in range.' : `${badLength.length} answer(s) outside 40-80 words.`,
    })
  }

  const hasListOrTable = /<(ul|ol|table)[\s>]/i.test(input.bodyText) || input.faq.length > 0
  results.push({
    id: 'aeo.snippet-formatting',
    category: 'aeo',
    label: 'List/table formatting present for snippet capture',
    mode: 'auto',
    status: hasListOrTable ? 'pass' : 'warn',
    message: hasListOrTable ? 'List/table or FAQ structure present.' : 'No list/table markup detected in body content.',
  })

  return results
}
