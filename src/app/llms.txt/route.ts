import { unstable_cache } from 'next/cache'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/seo-constants'
import { getHomePageData } from '@/lib/cms/queries'
import { getPayloadCached } from '@/lib/cms/get-payload-cached'
import { CMS_CACHE_REVALIDATE_SECONDS, listTag } from '@/lib/cms/cache-tags'
import { SITEMAP_COLLECTIONS } from '@/lib/seo/sitemap-sources'

/**
 * llms.txt — machine-readable site summary for LLM/answer-engine crawlers
 * (llmstxt.org). Registry-driven off sitemap-sources.ts, same as sitemap.ts —
 * add/edit/delete a doc in a registered collection and this regenerates
 * automatically. See starter-kit/17-seo-geo-aeo.md.
 */
export async function GET() {
  const homeData = await getHomePageData()
  const homeDescription = homeData?.hero?.subtitle || SITE_DESCRIPTION

  const collectionLines = await Promise.all(
    SITEMAP_COLLECTIONS.map((source) => getCollectionLlmsLines(source)),
  )

  const lines = [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    '## Pages',
    '',
    `- [Home](${SITE_URL}): ${homeDescription}`,
    ...collectionLines.flat(),
  ]

  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}

async function getCollectionLlmsLines(source: (typeof SITEMAP_COLLECTIONS)[number]): Promise<string[]> {
  const slugField = source.slugField || 'slug'
  const titleField = 'title' // adjust per collection if the title field is named differently

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
        const record = doc as Record<string, unknown>
        const slug = String(record[slugField])
        const title = typeof record[titleField] === 'string' ? record[titleField] : slug
        return `- [${title}](${SITE_URL}${source.pathPrefix}/${slug})`
      })
    },
    [`llms-txt-${source.collection}`],
    { tags: [listTag(source.collection)], revalidate: CMS_CACHE_REVALIDATE_SECONDS },
  )()
}
