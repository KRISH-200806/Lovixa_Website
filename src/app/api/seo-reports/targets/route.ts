import { NextRequest, NextResponse } from 'next/server'
import { getPayloadCached } from '@/lib/cms/get-payload-cached'
import { listAllSeoReportTargets } from '@/lib/seo-report/targets'

/**
 * Live target list for the "Generate Report" dropdown (see
 * SeoReportsGenerateButton) — the `home` global plus every `other-pages`
 * doc, auto-registered (see targets.ts). Staff-only, same as
 * /api/seo-reports/generate.
 */
export async function GET(request: NextRequest) {
  const payload = await getPayloadCached()
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const targets = await listAllSeoReportTargets(payload)
  return NextResponse.json({
    targets: targets.map((t) => ({ slug: t.slug, type: t.type, label: t.label })),
  })
}
