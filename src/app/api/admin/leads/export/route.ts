import { NextRequest, NextResponse } from 'next/server'
import { getPayloadCached } from '@/lib/cms/get-payload-cached'

export const dynamic = 'force-dynamic'

function escapeCsvField(field: unknown): string {
  if (field === null || field === undefined) return '""'
  const str = typeof field === 'object' ? JSON.stringify(field) : String(field)
  const escaped = str.replace(/"/g, '""')
  return `"${escaped}"`
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadCached()
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Staff session required.' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status')
    const formTypeFilter = searchParams.get('formType')

    const where: Record<string, any> = {}
    if (statusFilter && statusFilter !== 'all') {
      where.status = { equals: statusFilter }
    }
    if (formTypeFilter && formTypeFilter !== 'all') {
      where.formType = { equals: formTypeFilter }
    }

    const result = await payload.find({
      collection: 'form-submissions',
      where,
      limit: 1000,
      sort: '-createdAt',
      overrideAccess: true,
    })

    const headers = [
      'Submission Date',
      'Name',
      'Email',
      'Phone',
      'Form Type',
      'Subject',
      'Message',
      'Status',
      'Spam Score',
      'Source Page',
      'Turnstile Verified',
      'Internal Notes',
    ]

    const rows = (result.docs || []).map((doc: any) => [
      doc.createdAt ? new Date(doc.createdAt).toLocaleString() : '',
      doc.name || '',
      doc.email || '',
      doc.phone || '',
      doc.formType || '',
      doc.subject || '',
      doc.message || '',
      doc.status || '',
      doc.spamScore || '',
      doc.sourcePage || '',
      doc.turnstileVerified ? 'Yes' : 'No',
      doc.notes || '',
    ])

    const csvContent = [
      headers.map(escapeCsvField).join(','),
      ...rows.map((row) => row.map(escapeCsvField).join(',')),
    ].join('\r\n')

    const dateStr = new Date().toISOString().slice(0, 10)
    const filename = `leads-${dateStr}.csv`

    return new NextResponse('\uFEFF' + csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    })
  } catch (err: any) {
    console.error('[API /api/admin/leads/export] Export failed:', err)
    return NextResponse.json({ error: 'Failed to export leads CSV.', detail: err?.message }, { status: 500 })
  }
}
