import { unstable_cache } from 'next/cache'
import { getPayloadCached } from '@/lib/cms/get-payload-cached'
import { CMS_CACHE_REVALIDATE_SECONDS, keywordLinksTag } from '@/lib/cms/cache-tags'

export interface ActiveKeywordLink {
  keyword: string
  targetURL: string
  priority: number
  matchType: 'exact' | 'partial'
}

/** Active keyword-links rows, longest keyword first (avoids short terms shadowing longer matches). */
export async function getActiveKeywordLinks(): Promise<ActiveKeywordLink[]> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadCached()
      const result = await payload.find({
        collection: 'keyword-links',
        where: { active: { equals: true } },
        limit: 500,
        sort: 'priority',
        depth: 0,
      })
      return result.docs
        .map((doc) => ({
          keyword: String(doc.keyword),
          targetURL: String(doc.targetURL),
          priority: typeof doc.priority === 'number' ? doc.priority : 100,
          matchType: doc.matchType === 'exact' ? 'exact' : 'partial',
        }))
        .sort((a, b) => b.keyword.length - a.keyword.length) as ActiveKeywordLink[]
    },
    ['cms-active-keyword-links'],
    { tags: [keywordLinksTag()], revalidate: CMS_CACHE_REVALIDATE_SECONDS },
  )()
}
