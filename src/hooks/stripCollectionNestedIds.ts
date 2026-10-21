import type { CollectionBeforeOperationHook, CollectionBeforeValidateHook } from 'payload'
import { randomUUID } from 'crypto'

const isTopLevelSectionRowPath = (currentPath: string) => /^data\.sections\[\d+\]$/.test(currentPath)

const stripInvalidNestedIds = (value: unknown, currentPath = 'data'): unknown => {
  if (Array.isArray(value)) {
    return value.map((item, index) => stripInvalidNestedIds(item, `${currentPath}[${index}]`))
  }

  if (!value || typeof value !== 'object') {
    return value
  }

  const obj = value as Record<string, unknown>
  const result: Record<string, unknown> = {}

  for (const [key, nested] of Object.entries(obj)) {
    const nextPath = `${currentPath}.${key}`

    if (key === 'id') {
      // Keep Payload block row ids only for top-level sections rows.
      if (isTopLevelSectionRowPath(currentPath)) {
        result[key] = nested
        continue
      }
      continue
    }

    result[key] = stripInvalidNestedIds(nested, nextPath)
  }

  return result
}

const ensureClientIds = (
  value: unknown,
  seen = new Set<string>(),
  inArrayItem = false,
  currentPath = 'data',
): unknown => {
  if (Array.isArray(value)) {
    return value.map((item, index) => ensureClientIds(item, seen, true, `${currentPath}[${index}]`))
  }

  if (!value || typeof value !== 'object') return value

  const obj = value as Record<string, unknown>
  const out: Record<string, unknown> = {}

  if (inArrayItem) {
    if (isTopLevelSectionRowPath(currentPath) && typeof obj.id === 'string') {
      out.id = obj.id
    }

    const existingClient = typeof obj.clientId === 'string' ? obj.clientId.trim() : ''
    const fromLegacyId = typeof obj.id === 'string' ? obj.id.trim() : ''
    const preferred = existingClient || fromLegacyId
    const nextId = preferred && !seen.has(preferred) ? preferred : randomUUID()
    out.clientId = nextId
    seen.add(nextId)
  }

  for (const [key, nested] of Object.entries(obj)) {
    if (key === 'clientId') continue
    if (key === 'id' && !isTopLevelSectionRowPath(currentPath)) continue
    out[key] = ensureClientIds(nested, seen, false, `${currentPath}.${key}`)
  }

  return out
}

const sanitizeCollectionData = (value: unknown): Record<string, unknown> | undefined => {
  if (!value || typeof value !== 'object') return undefined

  const mutableData = { ...(value as Record<string, unknown>) }
  delete mutableData.id
  delete mutableData._id
  delete mutableData.updatedAt
  delete mutableData.createdAt

  const noInvalidIds = stripInvalidNestedIds(mutableData) as Record<string, unknown>
  return ensureClientIds(noInvalidIds) as Record<string, unknown>
}

export const stripCollectionNestedIdsHook: CollectionBeforeValidateHook = ({ data }) => {
  const sanitized = sanitizeCollectionData(data)
  return sanitized ?? data
}

export const stripCollectionNestedIdsBeforeOperationHook: CollectionBeforeOperationHook = ({
  args,
  operation,
}) => {
  if (!args || typeof args !== 'object') return
  if (operation !== 'create' && operation !== 'update') return

  const argsAsRecord = args as Record<string, unknown>
  const directData = argsAsRecord.data
  const nestedArgsData =
    argsAsRecord.args && typeof argsAsRecord.args === 'object'
      ? (argsAsRecord.args as Record<string, unknown>).data
      : undefined

  const sourceData = directData ?? nestedArgsData
  const sanitized = sanitizeCollectionData(sourceData)
  if (!sanitized) return

  if ('data' in argsAsRecord) {
    argsAsRecord.data = sanitized
  }
  if (argsAsRecord.args && typeof argsAsRecord.args === 'object') {
    ;(argsAsRecord.args as Record<string, unknown>).data = sanitized
  }
}
