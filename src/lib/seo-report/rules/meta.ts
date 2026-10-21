import type { SeoCheckResult, SeoReportInput } from '../types'

export function checkMeta(input: SeoReportInput): SeoCheckResult[] {
  const results: SeoCheckResult[] = []
  const title = input.metaTitle?.trim() ?? ''
  const desc = input.metaDescription?.trim() ?? ''

  results.push({
    id: 'meta.title-length',
    category: 'meta',
    label: 'Title tag length (50-60 chars)',
    mode: 'auto',
    status: !title ? 'fail' : title.length >= 50 && title.length <= 60 ? 'pass' : 'warn',
    message: !title
      ? 'No meta title set.'
      : `Title is ${title.length} chars (target 50-60).`,
  })

  results.push({
    id: 'meta.description-length',
    category: 'meta',
    label: 'Meta description length (140-160 chars)',
    mode: 'auto',
    status: !desc ? 'fail' : desc.length >= 140 && desc.length <= 160 ? 'pass' : 'warn',
    message: !desc
      ? 'No meta description set.'
      : `Description is ${desc.length} chars (target 140-160).`,
  })

  results.push({
    id: 'meta.canonical',
    category: 'meta',
    label: 'Canonical URL present',
    mode: 'auto',
    status: input.canonicalUrl ? 'pass' : 'fail',
    message: input.canonicalUrl ? `Canonical: ${input.canonicalUrl}` : 'No canonical URL resolved.',
  })

  results.push({
    id: 'meta.slug-keyword',
    category: 'meta',
    label: 'Slug is keyword-relevant',
    mode: 'auto',
    status: input.primaryKeyword
      ? input.slug.toLowerCase().includes(input.primaryKeyword.toLowerCase().split(' ')[0])
        ? 'pass'
        : 'warn'
      : 'na',
    message: input.primaryKeyword
      ? `Primary keyword: "${input.primaryKeyword}"`
      : 'No primary keyword planned for this page in keyword-plan.json.',
  })

  return results
}
