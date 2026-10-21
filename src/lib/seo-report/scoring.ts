import type { CategoryScore, SeoCategory, SeoCheckResult } from './types'

/**
 * Category weights (must sum to 100 across the non-gated categories).
 * 'compliance' is not weighted into the base score — it's a gate: any
 * auto-computed compliance fail caps the overall score (see below). No
 * source doc in `seo/` defined numeric weighting; this scheme is new.
 */
const WEIGHTS: Record<Exclude<SeoCategory, 'compliance'>, number> = {
  meta: 15,
  keywords: 15,
  schema: 15,
  content: 15,
  headings: 10,
  images: 10,
  aeo: 10,
  geo: 10,
}

const COMPLIANCE_FAIL_CAP = 40

function scoreCategory(checks: SeoCheckResult[]): CategoryScore['score'] {
  const scored = checks.filter((c) => c.status !== 'na')
  if (scored.length === 0) return 100
  const points = scored.reduce((sum, c) => {
    if (c.status === 'pass') return sum + 1
    if (c.status === 'warn') return sum + 0.5
    return sum
  }, 0)
  return Math.round((points / scored.length) * 100)
}

export function computeScore(checks: SeoCheckResult[]): {
  overall: number
  categoryScores: CategoryScore[]
  complianceGated: boolean
} {
  const categories = Array.from(new Set(checks.map((c) => c.category))) as SeoCategory[]
  const categoryScores: CategoryScore[] = categories.map((category) => {
    const catChecks = checks.filter((c) => c.category === category)
    return {
      category,
      score: scoreCategory(catChecks),
      passCount: catChecks.filter((c) => c.status === 'pass').length,
      failCount: catChecks.filter((c) => c.status === 'fail').length,
      warnCount: catChecks.filter((c) => c.status === 'warn').length,
      naCount: catChecks.filter((c) => c.status === 'na').length,
    }
  })

  let weightedSum = 0
  let weightTotal = 0
  for (const cs of categoryScores) {
    if (cs.category === 'compliance') continue
    const weight = WEIGHTS[cs.category as Exclude<SeoCategory, 'compliance'>] ?? 0
    weightedSum += cs.score * weight
    weightTotal += weight
  }
  let overall = weightTotal > 0 ? Math.round(weightedSum / weightTotal) : 0

  const complianceFail = checks.some((c) => c.category === 'compliance' && c.mode === 'auto' && c.status === 'fail')
  const complianceGated = complianceFail && overall > COMPLIANCE_FAIL_CAP
  if (complianceGated) overall = COMPLIANCE_FAIL_CAP

  return { overall, categoryScores, complianceGated }
}
