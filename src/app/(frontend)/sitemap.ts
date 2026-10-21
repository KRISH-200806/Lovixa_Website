import type { MetadataRoute } from 'next'
import { unstable_cache } from 'next/cache'
import { SITE_URL } from '@/lib/seo-constants'
import { getPayloadCached } from '@/lib/cms/get-payload-cached'
import { CMS_CACHE_REVALIDATE_SECONDS, globalTag, listTag } from '@/lib/cms/cache-tags'
import { SITEMAP_COLLECTIONS, SITEMAP_GLOBALS } from '@/lib/seo/sitemap-sources'

/**
 * Fully CMS-driven. Add/edit/delete a doc in any collection listed in
 * sitemap-sources.ts and this regenerates automatically — cache-tagged with
 * the same listTag() every collection read/write already revalidates on
 * publish (src/hooks/revalidateNextCache.ts). No manual per-page edits here.
 * New content TYPES still need one line in sitemap-sources.ts.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const globalEntries = await Promise.all(SITEMAP_GLOBALS.map((g) => getGlobalSitemapEntry(g)))

  const collectionEntries = await Promise.all(
    SITEMAP_COLLECTIONS.map((source) => getCollectionSitemapEntries(source)),
  )

  return [...globalEntries.filter((e): e is MetadataRoute.Sitemap[number] => e !== null), ...collectionEntries.flat()]
}

/** Skips a global that has no published version (draft-only or never published) — see 19-draft-publish-workflow.md. */
async function getGlobalSitemapEntry(
  source: (typeof SITEMAP_GLOBALS)[number],
): Promise<MetadataRoute.Sitemap[number] | null> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadCached()
      const doc = await payload.findGlobal({ slug: source.slug as never, depth: 0, draft: false })
      const status = (doc as Record<string, unknown> | null)?._status
      if (!doc || (status && status !== 'published')) return null
      const updatedAt = (doc as Record<string, unknown>).updatedAt
      return {
        url: `${SITE_URL}${source.path}`,
        lastModified: typeof updatedAt === 'string' ? new Date(updatedAt) : new Date(),
        changeFrequency: source.changeFrequency,
        priority: source.priority,
      }
    },
    [`sitemap-global-${source.slug}`],
    { tags: [globalTag(source.slug)], revalidate: CMS_CACHE_REVALIDATE_SECONDS },
  )()
}

async function getCollectionSitemapEntries(
  source: (typeof SITEMAP_COLLECTIONS)[number],
): Promise<MetadataRoute.Sitemap> {
  const slugField = source.slugField || 'slug'

  return unstable_cache(
    async () => {
      const payload = await getPayloadCached()
      const result = await payload.find({
        collection: source.collection as never,
        limit: 5000,
        depth: 0,
        draft: false,
        ...(source.where ? { where: source.where as never } : {}),
      })

      return result.docs.map((doc) => {
        const slug = (doc as Record<string, unknown>)[slugField]
        const updatedAt = (doc as Record<string, unknown>).updatedAt
        return {
          url: `${SITE_URL}${source.pathPrefix}/${String(slug)}`,
          lastModified: typeof updatedAt === 'string' ? new Date(updatedAt) : new Date(),
          changeFrequency: source.changeFrequency,
          priority: source.priority,
        }
      })
    },
    [`sitemap-${source.collection}`],
    { tags: [listTag(source.collection)], revalidate: CMS_CACHE_REVALIDATE_SECONDS },
  )()
}
