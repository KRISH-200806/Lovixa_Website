import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionAfterReadHook,
  CollectionBeforeChangeHook,
  GlobalAfterChangeHook,
  GlobalAfterReadHook,
  GlobalBeforeChangeHook,
} from 'payload'
import { revalidateSectionSourceMapTags } from '@/lib/cms/payload-revalidate'
import { buildSectionMapSyncOptions } from '@/lib/sectionSourceMapSyncContext'
import { slimSectionDataForSnapshot } from '@/lib/sectionSourceMap'

type BlockWithId = {
  id?: string | null
  clientId?: string | null
  blockType?: string | null
}

type SectionRecord = {
  sectionId: string
  sectionType: string
  position: number
  sectionData: Record<string, unknown>
}

const toSections = (value: unknown): SectionRecord[] => {
  if (!Array.isArray(value)) return []

  return value.flatMap((item, index) => {
    if (!item || typeof item !== 'object') return []
    const block = item as BlockWithId
    const sectionIdRaw =
      typeof block.id === 'string' && block.id.trim()
        ? block.id
        : typeof block.clientId === 'string'
          ? block.clientId
          : ''
    const sectionId = sectionIdRaw.trim()
    const sectionType = typeof block.blockType === 'string' ? block.blockType.trim() : ''
    if (!sectionId || !sectionType) return []

    return [{ sectionId, sectionType, position: index, sectionData: item as Record<string, unknown> }]
  })
}

const syncMappings = async ({
  req,
  sourceTable,
  sourceId,
  sourceField,
  sections,
}: {
  req: Parameters<GlobalAfterChangeHook>[0]['req']
  sourceTable: string
  sourceId: string
  sourceField: string
  sections: SectionRecord[]
}) => {
  await req.payload.delete({
    collection: 'section-source-map',
    where: {
      and: [
        { sourceTable: { equals: sourceTable } },
        { sourceId: { equals: sourceId } },
        { sourceField: { equals: sourceField } },
      ],
    },
    ...buildSectionMapSyncOptions(req),
  })

  for (const section of sections) {
    await req.payload.create({
      collection: 'section-source-map',
      data: {
        sectionType: section.sectionType,
        sectionId: section.sectionId,
        sourceTable,
        sourceId,
        sourceField,
        position: section.position,
        sectionData: slimSectionDataForSnapshot(section.sectionData) as Record<string, unknown>,
      },
      ...buildSectionMapSyncOptions(req),
    })
  }

  revalidateSectionSourceMapTags(sourceTable, sourceId)
}

const rawSectionsContextKey = (sourceTable: string, sourceField: string) =>
  `_rawSections_${sourceTable}_${sourceField}`

export const createCaptureRawSectionsGlobalHook =
  ({ sourceTable, sourceField = 'sections' }: { sourceTable: string; sourceField?: string }): GlobalBeforeChangeHook =>
  ({ data, req }) => {
    const raw = (data as Record<string, unknown>)?.[sourceField]
    if (Array.isArray(raw)) {
      req.context[rawSectionsContextKey(sourceTable, sourceField)] = raw
    }
    return data
  }

export const createCaptureRawSectionsCollectionHook =
  ({ sourceTable, sourceField = 'sections' }: { sourceTable: string; sourceField?: string }): CollectionBeforeChangeHook =>
  ({ data, req }) => {
    const raw = (data as Record<string, unknown>)?.[sourceField]
    if (Array.isArray(raw)) {
      req.context[rawSectionsContextKey(sourceTable, sourceField)] = raw
    }
    return data
  }

/**
 * Junction table (section-source-map) is not itself versioned — it holds one
 * live snapshot per sourceTable/sourceId. If a draft-enabled source synced on
 * every save (including "save draft"), an unpublished edit would leak onto
 * the public frontend immediately, bypassing draft/publish entirely. Skip
 * the sync when the save was a draft — junction stays at the last-published
 * snapshot. Sources without drafts enabled have no `_status` field, so this
 * never blocks them.
 */
const isDraftSave = (doc: unknown): boolean =>
  (doc as Record<string, unknown> | null)?._status === 'draft'

export const createSyncGlobalSectionsHook =
  ({ sourceTable, sourceField = 'sections' }: { sourceTable: string; sourceField?: string }): GlobalAfterChangeHook =>
  async ({ doc, req }) => {
    const sourceId = doc?.id ? String(doc.id) : ''
    if (!sourceId) return doc

    const ctxKey = rawSectionsContextKey(sourceTable, sourceField)
    const captured = req.context[ctxKey]
    delete req.context[ctxKey]

    if (isDraftSave(doc)) return doc

    const raw = Array.isArray(captured) ? captured : (doc as Record<string, unknown>)?.[sourceField]
    const sections = toSections(raw)

    await syncMappings({ req, sourceTable, sourceId, sourceField, sections })

    if (sections.length > 0) {
      ;(doc as Record<string, unknown>)[sourceField] = injectAdminBlockIds(
        sections.map((s) => s.sectionData),
      )
    }

    return doc
  }

export const createSyncCollectionSectionsHook =
  ({ sourceTable, sourceField = 'sections' }: { sourceTable: string; sourceField?: string }): CollectionAfterChangeHook =>
  async ({ doc, req }) => {
    const sourceId = doc?.id ? String(doc.id) : ''
    if (!sourceId) return doc

    const ctxKey = rawSectionsContextKey(sourceTable, sourceField)
    const captured = req.context[ctxKey]
    delete req.context[ctxKey]

    if (isDraftSave(doc)) return doc

    const raw = Array.isArray(captured) ? captured : (doc as Record<string, unknown>)?.[sourceField]
    const sections = toSections(raw)

    await syncMappings({ req, sourceTable, sourceId, sourceField, sections })

    if (sections.length > 0) {
      ;(doc as Record<string, unknown>)[sourceField] = injectAdminBlockIds(
        sections.map((s) => s.sectionData),
      )
    }

    return doc
  }

const readMappedSections = async ({
  req,
  sourceTable,
  sourceId,
  sourceField,
}: {
  req: Parameters<GlobalAfterChangeHook>[0]['req']
  sourceTable: string
  sourceId: string
  sourceField: string
}) => {
  const result = await req.payload.find({
    collection: 'section-source-map',
    where: {
      and: [
        { sourceTable: { equals: sourceTable } },
        { sourceId: { equals: sourceId } },
        { sourceField: { equals: sourceField } },
      ],
    },
    sort: 'position',
    pagination: false,
    depth: 0,
    req,
  })

  const docs = Array.isArray(result?.docs) ? result.docs : []
  return docs
    .map((doc) =>
      doc?.sectionData && typeof doc.sectionData === 'object' ? doc.sectionData : null,
    )
    .filter(Boolean) as Record<string, unknown>[]
}

const injectAdminBlockIds = (sections: Record<string, unknown>[]): Record<string, unknown>[] =>
  sections.map((section) => {
    const clientId = typeof section.clientId === 'string' ? section.clientId.trim() : ''
    const id = typeof section.id === 'string' ? section.id.trim() : ''
    if (!id && clientId) return { ...section, id: clientId }
    return section
  })

export const createReadMappedGlobalSectionsHook =
  ({ sourceTable, sourceField = 'sections' }: { sourceTable: string; sourceField?: string }): GlobalAfterReadHook =>
  async ({ doc, req }) => {
    if (req?.context?.skipSectionSourceMapRead) return doc
    const sourceId = doc?.id ? String(doc.id) : ''
    if (!sourceId) return doc

    const mapped = await readMappedSections({ req, sourceTable, sourceId, sourceField })
    if (mapped.length > 0) {
      ;(doc as Record<string, unknown>)[sourceField] = injectAdminBlockIds(mapped)
    }

    return doc
  }

/**
 * Deleting a sectioned collection doc (e.g. an Other Pages entry) leaves its
 * junction rows in section-source-map behind unless something purges them —
 * afterChange's sync only runs on create/update, never on delete. Pair this
 * with createSyncCollectionSectionsHook on the same collection.
 */
export const createCleanupSectionsOnDeleteHook =
  ({ sourceTable, sourceField = 'sections' }: { sourceTable: string; sourceField?: string }): CollectionAfterDeleteHook =>
  async ({ id, req }) => {
    const sourceId = id ? String(id) : ''
    if (!sourceId) return

    await req.payload.delete({
      collection: 'section-source-map',
      where: {
        and: [
          { sourceTable: { equals: sourceTable } },
          { sourceId: { equals: sourceId } },
          { sourceField: { equals: sourceField } },
        ],
      },
      ...buildSectionMapSyncOptions(req),
    })

    revalidateSectionSourceMapTags(sourceTable, sourceId)
  }

export const createReadMappedCollectionSectionsHook =
  ({ sourceTable, sourceField = 'sections' }: { sourceTable: string; sourceField?: string }): CollectionAfterReadHook =>
  async ({ doc, req }) => {
    if (req?.context?.skipSectionSourceMapRead) return doc
    const sourceId = doc?.id ? String(doc.id) : ''
    if (!sourceId) return doc

    const mapped = await readMappedSections({ req, sourceTable, sourceId, sourceField })
    if (mapped.length > 0) {
      ;(doc as Record<string, unknown>)[sourceField] = injectAdminBlockIds(mapped)
    }

    return doc
  }
