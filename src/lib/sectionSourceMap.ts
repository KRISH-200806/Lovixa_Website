type SectionBlock = {
  id?: string | null
  clientId?: string | null
  blockType?: string | null
  [key: string]: unknown
}

type MappingDoc = {
  sectionId?: string | null
  position?: number | null
  sectionType?: string | null
  sectionData?: SectionBlock | null
}

type RelationId = string | number

const isMediaKey = (key?: string): boolean => {
  if (!key) return false
  return /image|logo|icon|avatar|thumbnail|photo|picture|banner|cover|asset|media|illustration|bg/i.test(key)
}

const isMediaObject = (obj: unknown): boolean =>
  typeof obj === 'object' && obj !== null && ('filename' in obj || 'url' in obj || 'mimeType' in obj)

const toRelationKey = (value: unknown): RelationId | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) return value.trim()
  return null
}

export function slimSectionDataForSnapshot(value: unknown, currentKey?: string): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => slimSectionDataForSnapshot(item, currentKey))
  }

  if (!value || typeof value !== 'object') return value

  const obj = value as Record<string, unknown>

  if (currentKey && isMediaKey(currentKey)) {
    const id = toRelationKey(obj.id ?? value)
    if (id != null) return id
  }

  const out: Record<string, unknown> = {}
  for (const [key, nested] of Object.entries(obj)) {
    out[key] = slimSectionDataForSnapshot(nested, key)
  }
  return out
}

const collectMediaIds = (value: unknown, mediaIds: Set<RelationId>, currentKey?: string) => {
  if (Array.isArray(value)) {
    for (const item of value) collectMediaIds(item, mediaIds, currentKey)
    return
  }

  if (!value || typeof value !== 'object') {
    const relationId = toRelationKey(value)
    if (relationId != null && currentKey && isMediaKey(currentKey)) {
      mediaIds.add(relationId)
    }
    return
  }

  const obj = value as Record<string, unknown>
  if (isMediaObject(obj)) {
    const relationId = toRelationKey(obj.id)
    if (relationId != null) mediaIds.add(relationId)
  }

  for (const [key, nested] of Object.entries(obj)) {
    collectMediaIds(nested, mediaIds, key)
  }
}

const hydrateMedia = (value: unknown, mediaById: Map<string | number, unknown>, currentKey?: string): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => hydrateMedia(item, mediaById, currentKey))
  }

  if (!value || typeof value !== 'object') {
    const relationKey = toRelationKey(value)
    if (relationKey != null && currentKey && isMediaKey(currentKey)) {
      return mediaById.get(relationKey) ?? mediaById.get(String(relationKey)) ?? value
    }
    return value
  }

  const obj = value as Record<string, unknown>
  if (obj.id != null && (isMediaObject(obj) || (currentKey && isMediaKey(currentKey)))) {
    const populated = mediaById.get(obj.id as RelationId) ?? mediaById.get(String(obj.id))
    if (populated) return populated
  }

  const out: Record<string, unknown> = {}
  for (const [key, nested] of Object.entries(obj)) {
    out[key] = hydrateMedia(nested, mediaById, key)
  }
  return out
}

export const applySectionSourceMap = async ({
  payload,
  sourceTable,
  sourceId,
  sections,
  mapOnly = false,
}: {
  payload: {
    find: (args: Record<string, unknown>) => Promise<{ docs?: MappingDoc[] | null }>
  }
  sourceTable: string
  sourceId: string
  sections: SectionBlock[] | null | undefined
  mapOnly?: boolean
}) => {
  const rawSections = Array.isArray(sections) ? sections : []
  if (!sourceId) return rawSections
  if (rawSections.length === 0 && !mapOnly) return rawSections

  let result: { docs?: MappingDoc[] | null } | null = null
  try {
    result = await payload.find({
      collection: 'section-source-map',
      where: {
        and: [
          { sourceTable: { equals: sourceTable } },
          { sourceId: { equals: sourceId } },
          { sourceField: { equals: 'sections' } },
        ],
      },
      sort: 'position',
      pagination: false,
      depth: 0,
      select: {
        sectionId: true,
        position: true,
        sectionType: true,
        sectionData: true,
      },
    })
  } catch (err) {
    console.warn(
      `[section-source-map] applySectionSourceMap failed for ${sourceTable}/${sourceId}: ${err instanceof Error ? err.message : String(err)}`,
    )
    return rawSections
  }

  const docs = Array.isArray(result?.docs) ? result.docs : []
  if (docs.length === 0) return rawSections

  const snapshotOrdered = docs
    .map((doc) =>
      doc?.sectionData && typeof doc.sectionData === 'object' ? doc.sectionData : null,
    )
    .filter(Boolean) as SectionBlock[]

  if (snapshotOrdered.length === 0) return rawSections

  const mediaIds = new Set<RelationId>()
  for (const block of snapshotOrdered) collectMediaIds(block, mediaIds)

  const mediaById = new Map<string | number, unknown>()
  if (mediaIds.size > 0) {
    const ids = Array.from(mediaIds)
    const mediaResult = await payload.find({
      collection: 'media',
      where: { id: { in: ids } },
      limit: ids.length,
      pagination: false,
      depth: 1,
    })
    const mediaDocs = Array.isArray(mediaResult?.docs) ? mediaResult.docs : []
    for (const mediaDoc of mediaDocs) {
      if (mediaDoc && typeof mediaDoc === 'object') {
        const docId = (mediaDoc as { id?: unknown }).id
        if (docId != null) {
          mediaById.set(docId as RelationId, mediaDoc)
          mediaById.set(String(docId), mediaDoc)
        }
      }
    }
  }

  return snapshotOrdered.map((block) => hydrateMedia(block, mediaById) as SectionBlock)
}
