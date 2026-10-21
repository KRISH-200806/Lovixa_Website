import type { ReportDocModel } from './build-report-doc'

const STATUS_ICON: Record<string, string> = {
  pass: '✅',
  fail: '❌',
  warn: '⚠️',
  na: '➖',
}

export function toMarkdown(doc: ReportDocModel): string {
  const lines: string[] = []
  lines.push(`# ${doc.title}`)
  lines.push('')
  lines.push(`Generated: ${doc.generatedAt}`)
  lines.push('')
  lines.push(`**Overall score: ${doc.overallScore}/100**${doc.complianceGated ? ' (capped by a compliance failure)' : ''}`)
  lines.push('')

  for (const section of doc.sections) {
    lines.push(`## ${section.categoryLabel} — ${section.score}/100`)
    lines.push('')
    lines.push('| Status | Check | Details |')
    lines.push('|---|---|---|')
    for (const row of section.rows) {
      const icon = STATUS_ICON[row.status] ?? row.status
      const modeTag = row.mode === 'manual' ? ' _(manual)_' : ''
      lines.push(`| ${icon} | ${row.label}${modeTag} | ${row.message} |`)
    }
    lines.push('')
  }

  lines.push('## Search Console')
  lines.push('')
  if (doc.gsc) {
    lines.push(`- Clicks: ${doc.gsc.clicks}`)
    lines.push(`- Impressions: ${doc.gsc.impressions}`)
    lines.push(`- CTR: ${(doc.gsc.ctr * 100).toFixed(1)}%`)
    lines.push(`- Avg. position: ${doc.gsc.avgPosition.toFixed(1)}`)
    lines.push(`- LCP: ${doc.gsc.coreWebVitals.lcpMs ?? 'n/a'}ms (${doc.gsc.coreWebVitals.lcpPass ? 'pass' : 'fail'})`)
    lines.push(`- INP: ${doc.gsc.coreWebVitals.inpMs ?? 'n/a'}ms (${doc.gsc.coreWebVitals.inpPass ? 'pass' : 'fail'})`)
    lines.push(`- CLS: ${doc.gsc.coreWebVitals.cls ?? 'n/a'} (${doc.gsc.coreWebVitals.clsPass ? 'pass' : 'fail'})`)
    lines.push(`- Crawl errors: ${doc.gsc.crawlErrors}`)
  } else {
    lines.push('_Google Search Console not connected. Connect it in SEO Reports settings to include live Core Web Vitals and search performance data._')
  }
  lines.push('')

  return lines.join('\n')
}
