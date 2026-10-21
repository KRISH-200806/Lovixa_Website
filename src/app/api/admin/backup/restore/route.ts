import { NextRequest, NextResponse } from 'next/server'
import { getPayloadCached } from '@/lib/cms/get-payload-cached'
import { restoreFullDatabase, type BackupData } from '@/lib/backup/engine'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadCached()
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Staff session required.' }, { status: 401 })
    }

    let backupData: BackupData
    try {
      backupData = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 })
    }

    if (!backupData._meta || !backupData.collections || !backupData.globals) {
      return NextResponse.json(
        { error: 'Invalid backup file format. Must contain _meta, collections, and globals.' },
        { status: 400 },
      )
    }

    const summary = await restoreFullDatabase(payload, backupData)

    return NextResponse.json({
      success: true,
      message: 'Database backup restored successfully.',
      summary,
    })
  } catch (err: any) {
    console.error('[API /api/admin/backup/restore] Restore failed:', err)
    return NextResponse.json(
      { error: 'Failed to restore database from backup.', detail: err?.message },
      { status: 500 },
    )
  }
}
