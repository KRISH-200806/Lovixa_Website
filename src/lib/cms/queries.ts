import { unstable_cache } from 'next/cache'
import type { Payload } from 'payload'
import { applySectionSourceMap } from '@/lib/sectionSourceMap'
import {
  CMS_CACHE_REVALIDATE_SECONDS,
  docTag,
  globalTag,
  sectionMapPairTag,
  sectionSourceMapTag,
  sourceTableTag,
} from '@/lib/cms/cache-tags'
import { buildFrontendMappedFetchOptions } from '@/lib/cms/fetchContext'
import { getPayloadCached } from '@/lib/cms/get-payload-cached'

const frontendFetch = buildFrontendMappedFetchOptions()

const mapPayload = (p: Payload) =>
  p as unknown as Parameters<typeof applySectionSourceMap>[0]['payload']

function tagsForMappedGlobal(slug: string, sourceTable: string) {
  return [globalTag(slug), sourceTableTag(sourceTable), sectionSourceMapTag()]
}

export async function getHeaderFooterForLayout() {
  return unstable_cache(
    async () => {
      const payload = await getPayloadCached()
      const [headerData, footerData, themeSettings, storeSettings] = await Promise.all([
        payload.findGlobal({ slug: 'header' }).catch(() => null),
        payload.findGlobal({ slug: 'footer' }).catch(() => null),
        payload.findGlobal({ slug: 'theme-settings' }).catch(() => null),
        payload.findGlobal({ slug: 'store-settings' }).catch(() => null),
      ])
      return { headerData, footerData, themeSettings, storeSettings }
    },
    ['cms-layout-header-footer'],
    {
      tags: [globalTag('header'), globalTag('footer'), globalTag('theme-settings'), globalTag('store-settings')],
      revalidate: CMS_CACHE_REVALIDATE_SECONDS,
    },
  )()
}

export async function getStoreSettings() {
  return unstable_cache(
    async () => {
      try {
        const payload = await getPayloadCached()
        return await payload.findGlobal({ slug: 'store-settings' })
      } catch (err) {
        return null
      }
    },
    ['cms-store-settings'],
    {
      tags: [globalTag('store-settings')],
      revalidate: CMS_CACHE_REVALIDATE_SECONDS,
    },
  )()
}

export async function getHomePageData() {
  return unstable_cache(
    async () => {
      const payload = await getPayloadCached()
      // draft: false is explicit here even though it's the Local API default —
      // this fetcher must never surface an unpublished edit. See 19-draft-publish-workflow.md.
      const homeData = (await payload.findGlobal({ slug: 'home' as never, depth: 0, draft: false, ...frontendFetch })) as {
        id?: unknown
        sections?: unknown
        _status?: string
      } | null
      if (!homeData?.id || (homeData._status && homeData._status !== 'published')) return null

      const sourceId = String(homeData.id)
      ;(homeData as { sections?: unknown }).sections = await applySectionSourceMap({
        payload: mapPayload(payload),
        sourceTable: 'home',
        sourceId,
        sections: [],
        mapOnly: true,
      })
      return homeData
    },
    ['cms-home-page-mapped'],
    {
      tags: tagsForMappedGlobal('home', 'home'),
      revalidate: CMS_CACHE_REVALIDATE_SECONDS,
    },
  )()
}

/**
 * Fetch one collection doc by slug for a section-mapped detail route
 * (e.g. `/services/[slug]/page.tsx`). Returns `null` for a doc that doesn't
 * exist OR isn't published — the route must call `notFound()` on `null`, not
 * render a partial page. draft:false + the collection's `where.and` filter
 * both exclude drafts; keep both — access control (`publicReadPublished`)
 * is the third layer for anyone hitting the REST/GraphQL API directly.
 * See starter-kit/19-draft-publish-workflow.md.
 */
export async function getMappedCollectionDoc(sourceTable: string, collectionSlug: string, docSlug: string) {
  return unstable_cache(
    async () => {
      const payload = await getPayloadCached()
      const result = await payload.find({
        collection: collectionSlug as never,
        where: {
          and: [
            { slug: { equals: docSlug } },
            { _status: { equals: 'published' } },
          ],
        } as never,
        depth: 0,
        draft: false,
        limit: 1,
        ...frontendFetch,
      })
      const data = result.docs?.[0] as { id?: unknown; sections?: unknown; _status?: string } | undefined
      if (!data?.id || (data._status && data._status !== 'published')) return null

      const sourceId = String(data.id)
      data.sections = await applySectionSourceMap({
        payload: mapPayload(payload),
        sourceTable,
        sourceId,
        sections: [],
        mapOnly: true,
      })
      return data
    },
    [`cms-mapped-collection-${collectionSlug}-${docSlug}`],
    {
      tags: [docTag(collectionSlug, docSlug), sourceTableTag(sourceTable), sectionSourceMapTag()],
      revalidate: CMS_CACHE_REVALIDATE_SECONDS,
    },
  )()
}

export async function getMappedGlobalPage(sourceTable: string, slug: string) {
  return unstable_cache(
    async () => {
      const payload = await getPayloadCached()
      // draft: false — public frontend never sees an unpublished global.
      // Cast the result (not just the slug arg) — passing `slug as never`
      // makes findGlobal's generic overload resolve its return type to
      // `never` too, which then breaks every `data.*` access below.
      const data = (await payload.findGlobal({ slug: slug as never, depth: 0, draft: false, ...frontendFetch })) as {
        id?: unknown
        sections?: unknown
        _status?: string
      } | null
      if (!data?.id || (data._status && data._status !== 'published')) return null

      const sourceId = String(data.id)
      ;(data as { sections?: unknown }).sections = await applySectionSourceMap({
        payload: mapPayload(payload),
        sourceTable,
        sourceId,
        sections: [],
        mapOnly: true,
      })
      return data
    },
    [`cms-mapped-global-${slug}`],
    {
      tags: [...tagsForMappedGlobal(slug, sourceTable), sectionMapPairTag(sourceTable, slug)],
      revalidate: CMS_CACHE_REVALIDATE_SECONDS,
    },
  )()
}
