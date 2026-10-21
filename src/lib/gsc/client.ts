/**
 * Phase 3: live Google Search Console + PageSpeed Insights calls.
 *
 * Auth: reuses GOOGLE_APPLICATION_CREDENTIALS (same service-account JSON
 * documented for GCS in .env.example — standard GCP ADC, not Payload-
 * specific). That service account must additionally be added as a user
 * (Restricted is enough) on the target property in Search Console.
 *
 * Every call here is best-effort: any missing env var, auth failure, or API
 * error is caught by the caller (see fetchGscSnapshot) and downgrades the
 * report to gscConnected: false rather than failing report generation.
 */
import { GoogleAuth } from 'google-auth-library'
import type { GscSnapshot } from '../seo-report/types'
import { buildGscSnapshot } from '../seo-report/gsc'

const SEARCH_CONSOLE_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly'
const SEARCH_ANALYTICS_URL = (siteUrl: string) =>
  `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`
const URL_INSPECTION_URL = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect'
const PSI_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'

let cachedAuth: GoogleAuth | null = null
function getAuth(): GoogleAuth {
  if (!cachedAuth) {
    cachedAuth = new GoogleAuth({ scopes: [SEARCH_CONSOLE_SCOPE] })
  }
  return cachedAuth
}

interface SearchAnalyticsRow {
  clicks?: number
  impressions?: number
  ctr?: number
  position?: number
}

/** Last 28 days of clicks/impressions/ctr/position for one exact page URL. */
async function fetchSearchAnalytics(gscSiteUrl: string, pageUrl: string): Promise<SearchAnalyticsRow | null> {
  const auth = getAuth()
  const client = await auth.getClient()
  const end = new Date()
  const start = new Date(end.getTime() - 28 * 24 * 60 * 60 * 1000)
  const toDate = (d: Date) => d.toISOString().slice(0, 10)

  const res = await client.request<{ rows?: SearchAnalyticsRow[] }>({
    url: SEARCH_ANALYTICS_URL(gscSiteUrl),
    method: 'POST',
    data: {
      startDate: toDate(start),
      endDate: toDate(end),
      dimensions: ['page'],
      dimensionFilterGroups: [
        { filters: [{ dimension: 'page', operator: 'equals', expression: pageUrl }] },
      ],
      rowLimit: 1,
    },
  })

  return res.data.rows?.[0] ?? null
}

/**
 * URL Inspection API — used only for a coarse crawl-error signal (the old
 * "Crawl Errors" report has no API replacement). Returns 1 if the page has a
 * verdict other than a clean PASS/indexed state, else 0.
 */
async function fetchCrawlErrorCount(gscSiteUrl: string, pageUrl: string): Promise<number> {
  const auth = getAuth()
  const client = await auth.getClient()

  const res = await client.request<{
    inspectionResult?: { indexStatusResult?: { verdict?: string; coverageState?: string } }
  }>({
    url: URL_INSPECTION_URL,
    method: 'POST',
    data: { inspectionUrl: pageUrl, siteUrl: gscSiteUrl },
  })

  const verdict = res.data.inspectionResult?.indexStatusResult?.verdict
  return verdict && verdict !== 'PASS' && verdict !== 'NEUTRAL' ? 1 : 0
}

interface PsiResult {
  lighthouseResult?: {
    audits?: Record<string, { numericValue?: number }>
  }
}

/** PageSpeed Insights (mobile, Lighthouse) for Core Web Vitals. Optional — skipped if PSI_API_KEY unset. */
async function fetchPsiResult(pageUrl: string): Promise<PsiResult | null> {
  const apiKey = process.env.PSI_API_KEY
  if (!apiKey) return null

  const url = new URL(PSI_URL)
  url.searchParams.set('url', pageUrl)
  url.searchParams.set('key', apiKey)
  url.searchParams.set('strategy', 'mobile')
  url.searchParams.append('category', 'performance')

  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`PageSpeed Insights request failed (${res.status})`)
  }
  return (await res.json()) as PsiResult
}

/**
 * Fetches everything Phase 3 needs for one page and normalizes it into a
 * GscSnapshot. Returns null (never throws) when GSC isn't configured or the
 * API calls fail — callers should treat null the same as "not connected".
 */
export async function fetchGscSnapshot(pageUrl: string): Promise<GscSnapshot | null> {
  const gscSiteUrl = process.env.GSC_SITE_URL
  if (!gscSiteUrl) return null

  const [searchAnalytics, crawlErrors, psi] = await Promise.all([
    fetchSearchAnalytics(gscSiteUrl, pageUrl),
    fetchCrawlErrorCount(gscSiteUrl, pageUrl),
    fetchPsiResult(pageUrl),
  ])

  return buildGscSnapshot({
    siteUrl: pageUrl,
    searchAnalytics,
    psi,
    crawlErrors,
  })
}
