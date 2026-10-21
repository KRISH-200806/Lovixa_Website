/**
 * schema.org JSON-LD builders + injector. Structured data is the primary lever
 * for GEO/AEO — AI answer engines (Google AI Overviews, ChatGPT browsing,
 * Perplexity) extract from JSON-LD and clear semantic content far more
 * reliably than from prose alone. See starter-kit/17-seo-geo-aeo.md.
 */
import { SITE_NAME, SITE_URL } from '@/lib/seo-constants'

export interface FaqItem {
  question: string
  answer: string
}

export interface BreadcrumbItem {
  name: string
  path: string // relative, e.g. '/services/commercial-roofing'
}

export function organizationSchema(opts?: { logoPath?: string; sameAs?: string[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    // logoPath may already be absolute (any cloud storage adapter returns a
    // full https:// URL) or root-relative (local disk storage) — only
    // prefix SITE_URL in the relative case. See getMediaUrl().
    ...(opts?.logoPath
      ? { logo: opts.logoPath.startsWith('http') ? opts.logoPath : `${SITE_URL}${opts.logoPath}` }
      : {}),
    ...(opts?.sameAs?.length ? { sameAs: opts.sameAs } : {}),
  }
}

/**
 * No `potentialAction`/`SearchAction` here on purpose — that tells Google a
 * `/search?q=` route exists and works; this kit doesn't ship a search route.
 * If a project adds one, add the SearchAction back pointing at it (see
 * https://schema.org/SearchAction) — don't advertise a route that 404s.
 */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  }
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

/**
 * FAQPage schema — the single highest-leverage GEO/AEO structured data type.
 * Answer engines lift `acceptedAnswer.text` directly into generated answers.
 * Keep answers self-contained, direct, and factually complete — no "see above".
 */
export function faqPageSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function articleSchema(opts: {
  headline: string
  description?: string
  path: string
  imageUrl?: string
  datePublished?: string
  dateModified?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    url: `${SITE_URL}${opts.path}`,
    ...(opts.imageUrl ? { image: [opts.imageUrl] } : {}),
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  }
}

/** Renders one or more schema objects as `<script type="application/ld+json">` tags. */
export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data]
  return (
    <>
      {items.map((item, i) => (
        // eslint-disable-next-line react/no-danger
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  )
}
