/**
 * Shared report-document model. Every export renderer (Markdown/PDF/DOCX)
 * consumes this instead of re-deriving structure from a SeoReports doc.
 */
import type { CategoryScore, SeoCheckResult, GscSnapshot } from '../types'

export interface ReportDocSection {
  category: string
  categoryLabel: string
  score: number
  rows: SeoCheckResult[]
}

export interface ReportDocModel {
  title: string
  targetLabel: string
  generatedAt: string
  overallScore: number
  complianceGated: boolean
  sections: ReportDocSection[]
  gsc: GscSnapshot | null
}

const CATEGORY_LABELS: Record<string, string> = {
  meta: 'Meta',
  headings: 'Headings',
  keywords: 'Keywords',
  images: 'Images',
  schema: 'Schema / Structured Data',
  content: 'Content Quality',
  aeo: 'AEO (Answer Engine Optimization)',
  geo: 'GEO (Generative Engine Optimization)',
  compliance: 'Compliance',
}

export interface SeoReportDocLike {
  label: string
  targetSlug: string
  score: number
  categoryScores: CategoryScore[]
  checks: SeoCheckResult[]
  complianceGated: boolean
  gscSnapshot: GscSnapshot | null
  createdAt: string
}

export function buildReportDoc(report: SeoReportDocLike): ReportDocModel {
  const sections: ReportDocSection[] = report.categoryScores.map((cs) => ({
    category: cs.category,
    categoryLabel: CATEGORY_LABELS[cs.category] ?? cs.category,
    score: cs.score,
    rows: report.checks.filter((c) => c.category === cs.category),
  }))

  return {
    title: `SEO Report — ${report.label}`,
    targetLabel: report.targetSlug,
    generatedAt: report.createdAt,
    overallScore: report.score,
    complianceGated: report.complianceGated,
    sections,
    gsc: report.gscSnapshot,
  }
}
