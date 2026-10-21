/** Stable Next.js cache tags for Payload-backed reads and tag invalidation. */

export const CMS_CACHE_REVALIDATE_SECONDS = 3600

export const globalTag = (slug: string) => `cms:global:${slug}`

export const listTag = (collectionSlug: string) => `cms:list:${collectionSlug}`

export const docTag = (collectionSlug: string, idOrSlug: string) =>
  `cms:doc:${collectionSlug}:${idOrSlug}`

export const sectionSourceMapTag = () => 'cms:section-source-map'

export const sectionMapPairTag = (sourceTable: string, sourceId: string) =>
  `cms:section-map:${sourceTable}:${sourceId}`

/** Matches `sourceTable` in section-source-map and applySectionSourceMap. */
export const sourceTableTag = (sourceTable: string) => `cms:source-table:${sourceTable}`

export const keywordLinksTag = () => 'cms:list:keyword-links'
