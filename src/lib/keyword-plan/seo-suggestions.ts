/**
 * Keyword-plan-aware fallback SEO copy. Used as generateTitle/generateDescription
 * in the seoPlugin config (payload.config.ts) — only fires when the admin leaves
 * the SEO tab blank, never overrides an explicit editorial value.
 */
import { getKeywordsForPage, getPrimaryKeyword } from './keyword-plan'

export function suggestSeoTitle(targetPage: string, fallback: string, siteName?: string): string {
  const primary = getPrimaryKeyword(targetPage)
  if (!primary) return fallback
  const title = fallback.toLowerCase().includes(primary.toLowerCase()) ? fallback : `${fallback} | ${capitalize(primary)}`
  return siteName ? `${title} | ${siteName}` : title
}

export function suggestSeoDescription(targetPage: string, fallback: string): string {
  const keywords = getKeywordsForPage(targetPage)
    .slice(0, 3)
    .map((e) => e.keyword)
  if (keywords.length === 0) return fallback
  const suffix = keywords.join(', ')
  const description = `${fallback} Serving: ${suffix}.`
  return description.length <= 160 ? description : description.slice(0, 157).trimEnd() + '...'
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
