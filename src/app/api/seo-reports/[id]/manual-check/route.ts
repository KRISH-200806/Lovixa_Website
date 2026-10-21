import { NextRequest, NextResponse } from 'next/server'
import { getPayloadCached } from '@/lib/cms/get-payload-cached'
import type { CheckStatus } from '@/lib/seo-report/types'

const VALID_STATUSES: CheckStatus[] = ['pass', 'fail', 'warn', 'na']

/** Persists one admin-attested (manual) checklist answer onto a saved SEO Report. */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await getPayloadCached()
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  let body: { checkId?: string; status?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const { checkId, status } = body
  if (!checkId || !status || !VALID_STATUSES.includes(status as CheckStatus)) {
    return NextResponse.json({ error: 'checkId and a valid status (pass|fail|warn|na) are required.' }, { status: 400 })
  }

  try {
    const existing = await payload.findByID({ collection: 'seo-reports', id, overrideAccess: true })
    const manualChecks = { ...(existing as { manualChecks?: Record<string, string> }).manualChecks }
    manualChecks[checkId] = status

    const updated = await payload.update({
      collection: 'seo-reports',
      id,
      overrideAccess: true,
      data: { manualChecks },
    })

    return NextResponse.json({ success: true, manualChecks: (updated as { manualChecks?: unknown }).manualChecks })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    payload.logger.error({ err, reportId: id, checkId, msg: '[seo-reports/manual-check] failed' })
    return NextResponse.json(
      {
        error: 'Update failed. Check server logs.',
        ...(process.env.NODE_ENV !== 'production' ? { detail: message } : {}),
      },
      { status: 500 },
    )
  }
}
