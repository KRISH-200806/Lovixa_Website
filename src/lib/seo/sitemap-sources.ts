/**
 * Single registry sitemap.ts and llms.txt both read from. Content changes
 * (add/edit/delete a doc in a registered collection, or publish a registered
 * global) are fully automatic — no code touch, cache-tag revalidated same as
 * every other CMS read (see src/hooks/revalidateNextCache.ts).
 *
 * Registering a brand-new content TYPE (a collection/global that didn't
 * exist before) still needs one entry here — same moment you wire it into
 * seoPlugin and build its frontend route. Payload has no way to infer "this
 * collection is a public indexed page" on its own.
 */
export interface SitemapGlobalSource {
  slug: string
  path: string
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

export interface SitemapCollectionSource {
  collection: string
  pathPrefix: string // e.g. '/services' → /services/{slug}
  slugField?: string // defaults to 'slug'
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
  /** Only set if the collection has drafts enabled — e.g. { _status: { equals: 'published' } } */
  where?: Record<string, unknown>
}

export const SITEMAP_GLOBALS: SitemapGlobalSource[] = [
  { slug: 'home', path: '/', changeFrequency: 'weekly', priority: 1 },
  // { slug: 'about-page', path: '/about', changeFrequency: 'monthly', priority: 0.8 },
]

export const SITEMAP_COLLECTIONS: SitemapCollectionSource[] = [
  // { collection: 'services', pathPrefix: '/services', changeFrequency: 'monthly', priority: 0.7 },
  // { collection: 'blogs', pathPrefix: '/blog', changeFrequency: 'weekly', priority: 0.6, where: { _status: { equals: 'published' } } },
]
