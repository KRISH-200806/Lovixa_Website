import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'
import {
  revalidateCollectionDocTags,
  revalidateGlobalTags,
  revalidateSectionSourceMapTags,
} from '@/lib/cms/payload-revalidate'

export const createRevalidateGlobalHook =
  (slug: string): GlobalAfterChangeHook =>
  async ({ doc }) => {
    revalidateGlobalTags(slug)
    return doc
  }

export const createRevalidateCollectionHook =
  (collectionSlug: string): CollectionAfterChangeHook =>
  async ({ doc }) => {
    revalidateCollectionDocTags(collectionSlug, doc)
    return doc
  }

export const createRevalidateCollectionDeleteHook =
  (collectionSlug: string): CollectionAfterDeleteHook =>
  async ({ doc }) => {
    if (doc) revalidateCollectionDocTags(collectionSlug, doc)
    return doc
  }

export const revalidateSectionSourceMapAfterChange: CollectionAfterChangeHook = async ({
  doc,
  req,
}) => {
  if (req?.context?.skipSectionMapRevalidate) return doc
  const sourceTable = typeof doc?.sourceTable === 'string' ? doc.sourceTable : ''
  const sourceId = doc?.sourceId != null ? String(doc.sourceId) : ''
  if (sourceTable && sourceId) revalidateSectionSourceMapTags(sourceTable, sourceId)
  return doc
}

export const revalidateSectionSourceMapAfterDelete: CollectionAfterDeleteHook = async ({
  doc,
  req,
}) => {
  if (req?.context?.skipSectionMapRevalidate) return doc
  const sourceTable = typeof doc?.sourceTable === 'string' ? doc.sourceTable : ''
  const sourceId = doc?.sourceId != null ? String(doc.sourceId) : ''
  if (sourceTable && sourceId) revalidateSectionSourceMapTags(sourceTable, sourceId)
  return doc
}
