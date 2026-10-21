import { revalidateTag } from 'next/cache'
import {
  docTag,
  globalTag,
  listTag,
  sectionMapPairTag,
  sectionSourceMapTag,
  sourceTableTag,
} from '@/lib/cms/cache-tags'

export function revalidateGlobalTags(slug: string): void {
  try {
    revalidateTag(globalTag(slug))
    revalidateTag(sourceTableTag(slug))
    revalidateTag(sectionSourceMapTag())
  } catch {
    /* next/cache unavailable outside App Router */
  }
}

export function revalidateCollectionDocTags(
  collectionSlug: string,
  doc: { id?: unknown; slug?: unknown },
): void {
  try {
    revalidateTag(listTag(collectionSlug))
    revalidateTag(sourceTableTag(collectionSlug))
    revalidateTag(sectionSourceMapTag())
    const slug = typeof doc.slug === 'string' && doc.slug.trim() ? doc.slug.trim() : ''
    if (slug) revalidateTag(docTag(collectionSlug, slug))
    const idStr = doc.id != null ? String(doc.id) : ''
    if (idStr) {
      revalidateTag(docTag(collectionSlug, idStr))
      revalidateTag(sectionMapPairTag(collectionSlug, idStr))
    }
  } catch {
    /* next/cache unavailable outside App Router */
  }
}

export function revalidateSectionSourceMapTags(sourceTable: string, sourceId: string): void {
  try {
    revalidateTag(sectionSourceMapTag())
    revalidateTag(sourceTableTag(sourceTable))
    revalidateTag(sectionMapPairTag(sourceTable, sourceId))
    revalidateTag(listTag(sourceTable))
  } catch {
    /* next/cache unavailable outside App Router */
  }
}
