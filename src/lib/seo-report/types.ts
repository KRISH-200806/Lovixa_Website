/**
 * SEO Report engine types. Pure — no Payload/Next imports here.
 * See starter-kit plan: "SEO Reports Feature — Payload Admin".
 */

export type CheckStatus = 'pass' | 'fail' | 'warn' | 'na'

/** How a check's result was determined. 'auto' = computed from field data, 'manual' = admin-attested. */
export type CheckMode = 'auto' | 'manual'

export type SeoCategory =
  | 'meta'
  | 'headings'
  | 'keywords'
  | 'images'
  | 'schema'
  | 'content'
  | 'aeo'
  | 'geo'
  | 'compliance'

export interface SeoCheckResult {
  id: string
  category: SeoCategory
  label: string
  mode: CheckMode
  status: CheckStatus
  message: string
  details?: Record<string, unknown>
}

export interface SeoImageInput {
  alt: string | null
  url: string | null
}

export interface SeoFaqItemInput {
  question: string
  answer: string
}

export interface SeoHeadingInput {
  level: 1 | 2 | 3
  text: string
}

/** Page type drives which JSON-LD schema types are required and which word-count tier applies. */
export type SeoPageType = 'home' | 'service' | 'article' | 'generic'

/** Normalized shape every rule module reads from — built by normalize.ts per target. */
export interface SeoReportInput {
  targetSlug: string
  pageType: SeoPageType
  metaTitle: string | null
  metaDescription: string | null
  canonicalUrl: string | null
  slug: string
  headings: SeoHeadingInput[]
  bodyText: string
  wordCount: number
  images: SeoImageInput[]
  faq: SeoFaqItemInput[]
  jsonLdTypes: string[]
  primaryKeyword: string | null
  authorName: string | null
  lastUpdated: string | null
}

export interface GscSnapshot {
  siteUrl: string
  fetchedAt: string
  clicks: number
  impressions: number
  ctr: number
  avgPosition: number
  coreWebVitals: {
    lcpMs: number | null
    inpMs: number | null
    cls: number | null
    lcpPass: boolean | null
    inpPass: boolean | null
    clsPass: boolean | null
  }
  crawlErrors: number
}

export interface CategoryScore {
  category: SeoCategory
  score: number // 0-100
  passCount: number
  failCount: number
  warnCount: number
  naCount: number
}

export interface SeoReportResult {
  checks: SeoCheckResult[]
  score: number // 0-100, overall
  categoryScores: CategoryScore[]
  complianceGated: boolean // true if a compliance fail capped the overall score
  gsc: GscSnapshot | null
}
