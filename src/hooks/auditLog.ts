import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

function extractTitle(doc: any): string {
  if (!doc) return 'Unnamed'
  if (typeof doc.title === 'string' && doc.title.trim()) return doc.title.trim()
  if (typeof doc.name === 'string' && doc.name.trim()) return doc.name.trim()
  if (typeof doc.filename === 'string' && doc.filename.trim()) return doc.filename.trim()
  if (typeof doc.label === 'string' && doc.label.trim()) return doc.label.trim()
  if (typeof doc.slug === 'string' && doc.slug.trim()) return doc.slug.trim()
  return doc.id ? `Doc #${doc.id}` : 'Unnamed Document'
}

/**
 * AfterChange hook for Collections that logs creates, updates, and publishes.
 */
export function createAuditLogCollectionHook(collectionSlug: string): CollectionAfterChangeHook {
  return async ({ doc, previousDoc, operation, req }) => {
    // Skip if running internal seeding or no user session present
    if (!req.user && !req.payload) return doc
    if (collectionSlug === 'audit-logs') return doc

    const userEmail = req.user?.email || 'System'
    const userId = req.user?.id

    let action: 'create' | 'update' | 'publish' | 'unpublish' = operation === 'create' ? 'create' : 'update'

    if (doc?._status === 'published' && previousDoc?._status === 'draft') {
      action = 'publish'
    } else if (doc?._status === 'draft' && previousDoc?._status === 'published') {
      action = 'unpublish'
    }

    // Run async in background without blocking response
    Promise.resolve().then(async () => {
      try {
        await req.payload.create({
          collection: 'audit-logs' as any,
          data: {
            action,
            entityType: 'collection',
            entitySlug: collectionSlug,
            documentTitle: extractTitle(doc),
            documentId: doc?.id ? String(doc.id) : '',
            userEmail,
            user: userId || undefined,
            details: `Operation: ${operation}. Status: ${doc?._status || 'N/A'}.`,
          },
          overrideAccess: true,
        })
      } catch (err: any) {
        console.warn(`[AuditLog Hook] Failed to record log for ${collectionSlug}:`, err?.message)
      }
    })

    return doc
  }
}

/**
 * AfterDelete hook for Collections that logs deletions.
 */
export function createAuditLogDeleteHook(collectionSlug: string): CollectionAfterDeleteHook {
  return async ({ doc, id, req }) => {
    if (collectionSlug === 'audit-logs') return doc

    const userEmail = req.user?.email || 'System'
    const userId = req.user?.id

    Promise.resolve().then(async () => {
      try {
        await req.payload.create({
          collection: 'audit-logs' as any,
          data: {
            action: 'delete',
            entityType: 'collection',
            entitySlug: collectionSlug,
            documentTitle: extractTitle(doc),
            documentId: String(id),
            userEmail,
            user: userId || undefined,
            details: `Document deleted permanently.`,
          },
          overrideAccess: true,
        })
      } catch (err: any) {
        console.warn(`[AuditLog Hook] Failed to record delete log for ${collectionSlug}:`, err?.message)
      }
    })

    return doc
  }
}

/**
 * AfterChange hook for Globals that logs updates.
 */
export function createAuditLogGlobalHook(globalSlug: string): GlobalAfterChangeHook {
  return async ({ doc, req }) => {
    const userEmail = req.user?.email || 'System'
    const userId = req.user?.id

    Promise.resolve().then(async () => {
      try {
        await req.payload.create({
          collection: 'audit-logs' as any,
          data: {
            action: 'update',
            entityType: 'global',
            entitySlug: globalSlug,
            documentTitle: `${globalSlug.charAt(0).toUpperCase() + globalSlug.slice(1)} Settings`,
            userEmail,
            user: userId || undefined,
            details: `Global settings updated.`,
          },
          overrideAccess: true,
        })
      } catch (err: any) {
        console.warn(`[AuditLog Hook] Failed to record global log for ${globalSlug}:`, err?.message)
      }
    })

    return doc
  }
}
