/**
 * Turns a raw Payload doc (global or collection item) into the normalized
 * SeoReportInput shape the rules engine reads. Add a branch per target
 * pageType as new page kinds ship.
 */
import { getPrimaryKeyword } from '../keyword-plan/keyword-plan'
import type { SeoFaqItemInput, SeoHeadingInput, SeoImageInput, SeoReportInput } from './types'
import type { SeoReportTarget } from './targets'

interface RawBlock {
  blockType?: string
  heading?: string
  body?: string
  image?: { url?: string; alt?: string } | string | null
  items?: { question?: string; answer?: string }[]
}

interface RawDoc {
  hero?: { title?: string; subtitle?: string }
  sections?: RawBlock[]
  meta?: { title?: string; description?: string; image?: { url?: string } | string | null }
  slug?: string
  updatedAt?: string
  author?: { name?: string } | string | null
}

export function normalizeTarget(target: SeoReportTarget, doc: unknown): SeoReportInput {
  const raw = (doc || {}) as RawDoc
  const sections = Array.isArray(raw.sections) ? raw.sections : []

  const headings: SeoHeadingInput[] = []
  if (raw.hero?.title) headings.push({ level: 1, text: raw.hero.title })
  for (const block of sections) {
    if (block.heading) headings.push({ level: 2, text: block.heading })
  }

  const bodyParts: string[] = []
  if (raw.hero?.subtitle) bodyParts.push(raw.hero.subtitle)
  const images: SeoImageInput[] = []
  const faq: SeoFaqItemInput[] = []

  for (const block of sections) {
    if (block.blockType === 'content') {
      if (block.body) bodyParts.push(block.body)
      if (block.image) {
        const img = typeof block.image === 'string' ? { url: block.image } : block.image
        images.push({ url: img?.url ?? null, alt: (img as { alt?: string })?.alt ?? null })
      }
    }
    if (block.blockType === 'faq' && Array.isArray(block.items)) {
      for (const item of block.items) {
        if (item.question && item.answer) {
          faq.push({ question: item.question, answer: item.answer })
        }
      }
    }
  }

  const bodyText = bodyParts.join('\n\n')
  const wordCount = bodyText.trim() ? bodyText.trim().split(/\s+/).length : 0

  const jsonLdTypes: string[] = []
  if (target.pageType === 'home') jsonLdTypes.push('Organization', 'WebSite')
  if (faq.length > 0) jsonLdTypes.push('FAQPage')

  return {
    targetSlug: target.slug,
    pageType: target.pageType,
    metaTitle: raw.meta?.title ?? null,
    metaDescription: raw.meta?.description ?? null,
    canonicalUrl: target.path,
    slug: target.path,
    headings,
    bodyText,
    wordCount,
    images,
    faq,
    jsonLdTypes,
    primaryKeyword: getPrimaryKeyword(target.path) ?? null,
    authorName: typeof raw.author === 'string' ? raw.author : raw.author?.name ?? null,
    lastUpdated: raw.updatedAt ?? null,
  }
}
