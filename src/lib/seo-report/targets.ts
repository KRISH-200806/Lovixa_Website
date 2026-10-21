/**
 * Registry of auditable SEO Report targets. `home` is the only global. Every
 * `other-pages` doc (see src/collections/OtherPages.ts) auto-registers as a
 * `collection` target too — no manual edit needed per page, see
 * listAllSeoReportTargets.
 */
import type { BasePayload } from 'payload'
import type { SeoPageType } from './types'

export interface SeoReportTarget {
  slug: string
  type: 'global' | 'collection'
  label: string
  pageType: SeoPageType
  /** Site-relative path used for canonical/keyword-plan lookups. */
  path: string
  /** Only set for type: 'collection' — which Payload collection to look the doc up in. */
  collectionSlug?: string
}

export const SEO_REPORT_TARGETS: SeoReportTarget[] = [
  { slug: 'home', type: 'global', label: 'Home Page', pageType: 'home', path: '/' },
]

/** Sentinel targetSlug for "generate a report for every target at once" — see /api/seo-reports/generate. */
export const WHOLE_SITE_TARGET_SLUG = '__whole-site__'

/**
 * Full target list: the static globals above plus a live query against
 * other-pages (published + draft, staff-only tool — overrideAccess so an
 * admin can audit a draft page before publishing it).
 */
export async function listAllSeoReportTargets(payload: BasePayload): Promise<SeoReportTarget[]> {
  try {
    const products = await payload.find({
      collection: 'products',
      depth: 0,
      limit: 100,
      overrideAccess: true,
      select: { title: true, slug: true },
    })

    const collectionTargets: SeoReportTarget[] = (products.docs || [])
      .filter((doc) => typeof doc.slug === 'string' && doc.slug.trim() !== '')
      .map((doc) => ({
        slug: doc.slug,
        type: 'collection',
        label: `Product: ${doc.title || doc.slug}`,
        pageType: 'generic',
        path: `/products/${doc.slug}`,
        collectionSlug: 'products',
      }))

    return [...SEO_REPORT_TARGETS, ...collectionTargets]
  } catch {
    return [...SEO_REPORT_TARGETS]
  }
}

export async function findSeoReportTarget(
  payload: BasePayload,
  slug: string,
  type: 'global' | 'collection',
): Promise<SeoReportTarget | undefined> {
  const targets = await listAllSeoReportTargets(payload)
  return targets.find((t) => t.slug === slug && t.type === type)
}
