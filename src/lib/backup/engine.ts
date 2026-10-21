import type { Payload } from 'payload'
import { revalidateTag } from 'next/cache'

export interface BackupMetadata {
  schemaVersion: number
  exportedAt: string
  siteUrl?: string
  databaseAdapter?: string
  totalRecords: number
  collectionsCount: Record<string, number>
  globalsCount: number
}

export interface BackupData {
  _meta: BackupMetadata
  globals: Record<string, any>
  collections: Record<string, any[]>
}

export interface RestoreSummary {
  success: boolean
  globalsRestored: number
  collectionsRestored: Record<string, { created: number; updated: number; failed: number }>
  totalRecordsProcessed: number
  errors: string[]
}

const SYSTEM_COLLECTIONS_TO_SKIP = ['payload-preferences', 'payload-migrations', 'payload-locked-documents']

/**
 * Exports a full portable snapshot of all collections and globals in the database.
 * Universal and adapter-agnostic (works on PostgreSQL, MongoDB, SQLite).
 */
export async function exportFullDatabase(payload: Payload): Promise<BackupData> {
  const collectionsData: Record<string, any[]> = {}
  const collectionsCount: Record<string, number> = {}
  let totalRecords = 0

  // 1. Export Collections
  const collections = payload.config.collections || []
  for (const col of collections) {
    const slug = col.slug
    if (SYSTEM_COLLECTIONS_TO_SKIP.includes(slug)) continue

    collectionsData[slug] = []
    let page = 1
    let hasMore = true

    while (hasMore) {
      try {
        const result = await payload.find({
          collection: slug as any,
          limit: 100,
          page,
          draft: true,
          overrideAccess: true,
        })

        if (result.docs && result.docs.length > 0) {
          // If Users collection, sanitize sensitive auth tokens while preserving profile data
          const sanitizedDocs = result.docs.map((doc: any) => {
            if (slug === 'users') {
              const { salt, hash, resetPasswordToken, resetPasswordExpiration, ...safeUser } = doc
              return safeUser
            }
            return doc
          })

          collectionsData[slug].push(...sanitizedDocs)
          totalRecords += result.docs.length
        }

        hasMore = result.hasNextPage
        page++
      } catch (err: any) {
        console.warn(`[Backup Engine] Warning: Failed to export collection ${slug}:`, err?.message)
        hasMore = false
      }
    }

    collectionsCount[slug] = collectionsData[slug].length
  }

  // 2. Export Globals
  const globalsData: Record<string, any> = {}
  const globals = payload.config.globals || []
  let globalsCount = 0

  for (const glob of globals) {
    const slug = glob.slug
    try {
      const data = await payload.findGlobal({
        slug: slug as any,
        draft: true,
        overrideAccess: true,
      })
      if (data) {
        globalsData[slug] = data
        globalsCount++
      }
    } catch (err: any) {
      console.warn(`[Backup Engine] Warning: Failed to export global ${slug}:`, err?.message)
    }
  }

  const metadata: BackupMetadata = {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || '',
    databaseAdapter: process.env.DATABASE_URL?.startsWith('mongodb') ? 'mongodb' : 'postgres',
    totalRecords: totalRecords + globalsCount,
    collectionsCount,
    globalsCount,
  }

  return {
    _meta: metadata,
    globals: globalsData,
    collections: collectionsData,
  }
}

/**
 * Restores all collections and globals from a backup JSON payload.
 */
export async function restoreFullDatabase(
  payload: Payload,
  backupData: BackupData,
): Promise<RestoreSummary> {
  const summary: RestoreSummary = {
    success: true,
    globalsRestored: 0,
    collectionsRestored: {},
    totalRecordsProcessed: 0,
    errors: [],
  }

  if (!backupData || !backupData._meta || !backupData.collections || !backupData.globals) {
    throw new Error('Invalid backup file structure: missing _meta, collections, or globals.')
  }

  // 1. Restore Globals
  for (const [slug, data] of Object.entries(backupData.globals)) {
    try {
      const { id, createdAt, updatedAt, ...cleanData } = data as any
      await payload.updateGlobal({
        slug: slug as any,
        data: cleanData,
        draft: false,
        overrideAccess: true,
      })
      summary.globalsRestored++
      summary.totalRecordsProcessed++
    } catch (err: any) {
      const msg = `Failed to restore global '${slug}': ${err?.message}`
      console.error(`[Backup Engine] ${msg}`)
      summary.errors.push(msg)
    }
  }

  // 2. Restore Collections
  for (const [slug, docs] of Object.entries(backupData.collections)) {
    summary.collectionsRestored[slug] = { created: 0, updated: 0, failed: 0 }

    if (!Array.isArray(docs)) continue

    for (const doc of docs) {
      summary.totalRecordsProcessed++
      try {
        const { id, createdAt, updatedAt, ...docData } = doc

        // If doc has an ID, check if it already exists
        let exists = false
        if (id) {
          try {
            const existing = await payload.findByID({
              collection: slug as any,
              id,
              draft: true,
              overrideAccess: true,
            })
            if (existing) exists = true
          } catch {
            exists = false
          }
        }

        if (exists && id) {
          await payload.update({
            collection: slug as any,
            id,
            data: docData,
            draft: Boolean(doc._status === 'draft'),
            overrideAccess: true,
          })
          summary.collectionsRestored[slug].updated++
        } else {
          // If inserting a user that didn't have password restored, provide a random temporary password if needed
          if (slug === 'users' && !docData.password) {
            docData.password = `TempPass_${Math.random().toString(36).substring(2, 10)}!`
          }

          await payload.create({
            collection: slug as any,
            data: docData,
            draft: Boolean(doc._status === 'draft'),
            overrideAccess: true,
          })
          summary.collectionsRestored[slug].created++
        }
      } catch (err: any) {
        summary.collectionsRestored[slug].failed++
        const msg = `Failed to restore doc in '${slug}' (ID: ${doc?.id || 'unknown'}): ${err?.message}`
        console.error(`[Backup Engine] ${msg}`)
        summary.errors.push(msg)
      }
    }
  }

  // 3. Purge site caches
  try {
    revalidateTag('site-cache')
  } catch (err) {
    // Context might not be within standard request lifecycle
  }

  if (summary.errors.length > 0 && summary.totalRecordsProcessed === summary.errors.length) {
    summary.success = false
  }

  return summary
}
