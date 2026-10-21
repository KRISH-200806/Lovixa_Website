import type { GlobalBeforeValidateHook } from 'payload'
import { randomUUID } from 'crypto'

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

    // Strip every incoming `id` so Payload can mint a consistent tree of row IDs.
    // Keeping stale top-level IDs can break nested FK chains during global updates.
    if (key === 'id') continue

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
    const existingClient = typeof obj.clientId === 'string' ? obj.clientId.trim() : ''
    // Back-compat: if old data had `id` but no `clientId`, reuse it.
    const fromLegacyId = typeof obj.id === 'string' ? obj.id.trim() : ''
    const preferred = existingClient || fromLegacyId
    const nextId = preferred && !seen.has(preferred) ? preferred : randomUUID()
    out.clientId = nextId
    seen.add(nextId)
  }

  for (const [key, nested] of Object.entries(obj)) {
    if (key === 'clientId') continue
    if (key === 'id') continue
    out[key] = ensureClientIds(nested, seen, false, `${currentPath}.${key}`)
  }

  return out
}

const sanitizeRootSystemFields = (value: unknown): Record<string, unknown> | undefined => {
  if (!value || typeof value !== 'object') return undefined

  const mutableData = { ...(value as Record<string, unknown>) }
  delete mutableData.id
  delete mutableData._id
  delete mutableData.updatedAt
  delete mutableData.createdAt

  const noInvalidIds = stripInvalidNestedIds(mutableData) as Record<string, unknown>
  return ensureClientIds(noInvalidIds) as Record<string, unknown>
}

const collectIdPaths = (value: unknown, currentPath = 'data', paths: string[] = []): string[] => {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectIdPaths(item, `${currentPath}[${index}]`, paths))
    return paths
  }

  if (!value || typeof value !== 'object') {
    return paths
  }

  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    const nextPath = `${currentPath}.${key}`
    if (key === 'id') paths.push(`${nextPath} (${typeof nested})`)
    collectIdPaths(nested, nextPath, paths)
  }

  return paths
}

export const stripIdHook: GlobalBeforeValidateHook = ({ data }) => {
  const sanitized = sanitizeRootSystemFields(data)
  return sanitized ?? data
}
