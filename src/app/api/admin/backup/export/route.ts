import { NextRequest, NextResponse } from 'next/server'
import { getPayloadCached } from '@/lib/cms/get-payload-cached'
import { exportFullDatabase } from '@/lib/backup/engine'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadCached()
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Staff session required.' }, { status: 401 })
    }

    const backupData = await exportFullDatabase(payload)

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const filename = `backup-${timestamp}.json`
    const jsonString = JSON.stringify(backupData, null, 2)

    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    })
  } catch (err: any) {
    console.error('[API /api/admin/backup/export] Export failed:', err)
    return NextResponse.json(
      { error: 'Failed to generate database backup snapshot.', detail: err?.message },
      { status: 500 },
    )
  }
}
