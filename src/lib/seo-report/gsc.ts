/**
 * Pure formatter: raw Google Search Console / PageSpeed Insights API
 * responses → the normalized GscSnapshot shape. No network calls live here —
 * see src/lib/gsc/client.ts for the actual API calls.
 */
import type { GscSnapshot } from './types'

interface RawSearchAnalyticsRow {
  clicks?: number
  impressions?: number
  ctr?: number
  position?: number
}

interface RawPsiResult {
  lighthouseResult?: {
    audits?: Record<string, { numericValue?: number }>
  }
}

const LCP_PASS_MS = 2500
const INP_PASS_MS = 200
const CLS_PASS = 0.1

export function buildGscSnapshot(opts: {
  siteUrl: string
  searchAnalytics: RawSearchAnalyticsRow | null
  psi: RawPsiResult | null
  crawlErrors: number
}): GscSnapshot {
  const row = opts.searchAnalytics
  const audits = opts.psi?.lighthouseResult?.audits ?? {}
  const lcpMs = audits['largest-contentful-paint']?.numericValue ?? null
  const inpMs = audits['interaction-to-next-paint']?.numericValue ?? null
  const cls = audits['cumulative-layout-shift']?.numericValue ?? null

  return {
    siteUrl: opts.siteUrl,
    fetchedAt: new Date().toISOString(),
    clicks: row?.clicks ?? 0,
    impressions: row?.impressions ?? 0,
    ctr: row?.ctr ?? 0,
    avgPosition: row?.position ?? 0,
    coreWebVitals: {
      lcpMs,
      inpMs,
      cls,
      lcpPass: lcpMs === null ? null : lcpMs <= LCP_PASS_MS,
      inpPass: inpMs === null ? null : inpMs <= INP_PASS_MS,
      clsPass: cls === null ? null : cls <= CLS_PASS,
    },
    crawlErrors: opts.crawlErrors,
  }
}
