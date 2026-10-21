import { NextRequest, NextResponse } from 'next/server'
import { getPayloadCached } from '@/lib/cms/get-payload-cached'
import { buildReportDoc, type SeoReportDocLike } from '@/lib/seo-report/export/build-report-doc'
import { toMarkdown } from '@/lib/seo-report/export/to-markdown'
import { toPdf } from '@/lib/seo-report/export/to-pdf'
import { toDocx } from '@/lib/seo-report/export/to-docx'

/** Exports a saved SEO Report as Markdown, PDF, or DOCX. */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await getPayloadCached()
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const format = request.nextUrl.searchParams.get('format') ?? 'md'

  let report: SeoReportDocLike
  try {
    report = (await payload.findByID({
      collection: 'seo-reports',
      id,
      overrideAccess: true,
    })) as unknown as SeoReportDocLike
  } catch {
    return NextResponse.json({ error: 'Report not found.' }, { status: 404 })
  }

  const doc = buildReportDoc(report)
  const filenameBase = `seo-report-${report.targetSlug}-${new Date(report.createdAt).toISOString().slice(0, 10)}`

  try {
    if (format === 'md') {
      const body = toMarkdown(doc)
      return new NextResponse(body, {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filenameBase}.md"`,
        },
      })
    }

    if (format === 'pdf') {
      const buffer = await toPdf(doc)
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filenameBase}.pdf"`,
        },
      })
    }

    if (format === 'docx') {
      const buffer = await toDocx(doc)
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': `attachment; filename="${filenameBase}.docx"`,
        },
      })
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack : undefined
    payload.logger.error({ err, format, reportId: id, msg: '[seo-reports/export] render failed' })
    return NextResponse.json(
      {
        error: 'Export rendering failed. Check server logs.',
        ...(process.env.NODE_ENV !== 'production' ? { detail: message, stack } : {}),
      },
      { status: 500 },
    )
  }

  return NextResponse.json({ error: `Unknown format: ${format}` }, { status: 400 })
}
