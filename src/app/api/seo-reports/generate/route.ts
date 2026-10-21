import { NextRequest, NextResponse } from 'next/server'
import type { BasePayload } from 'payload'
import { getPayloadCached } from '@/lib/cms/get-payload-cached'
import { normalizeTarget } from '@/lib/seo-report/normalize'
import { findSeoReportTarget, listAllSeoReportTargets, WHOLE_SITE_TARGET_SLUG, type SeoReportTarget } from '@/lib/seo-report/targets'
import { runSeoReport } from '@/lib/seo-report/engine'
import { fetchGscSnapshot } from '@/lib/gsc/client'
import type { User } from '@/payload-types'

/**
 * Generates one SEO Report run for a target (global/collection) and saves it
 * as a `seo-reports` doc. Staff-only — this is an internal admin tool, not a
 * public endpoint. GSC/PSI fetch is best-effort: unset GSC_SITE_URL, missing
 * ADC, or an API error all just fall back to gscConnected: false rather than
 * failing the whole report.
 *
 * targetSlug === WHOLE_SITE_TARGET_SLUG generates one report per target
 * returned by listAllSeoReportTargets (the `home` global plus every
 * `other-pages` doc) instead of a single one — see targets.ts.
 */
async function fetchTargetDoc(payload: BasePayload, target: SeoReportTarget) {
  if (target.type === 'global') {
    return payload.findGlobal({ slug: target.slug as 'home', overrideAccess: true })
  }

  const result = await payload.find({
    collection: (target.collectionSlug ?? 'other-pages') as 'other-pages',
    where: { slug: { equals: target.slug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  return result.docs[0] ?? null
}

async function generateOneReport(payload: BasePayload, userId: User['id'], target: SeoReportTarget) {
  const doc = await fetchTargetDoc(payload, target)
  const input = normalizeTarget(target, doc)

  const siteBase = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? ''
  const pageUrl = `${siteBase}${target.path}`
  let gsc = null as Awaited<ReturnType<typeof fetchGscSnapshot>>
  try {
    gsc = await fetchGscSnapshot(pageUrl)
  } catch (gscErr) {
    // Non-fatal — report still generates, just without live GSC data.
    payload.logger.warn({ err: gscErr, pageUrl, msg: '[seo-reports/generate] GSC fetch failed' })
  }

  const result = await runSeoReport(input, gsc)

  const label = `${target.label} — ${new Date().toLocaleString()}`
  return payload.create({
    collection: 'seo-reports',
    overrideAccess: true,
    data: {
      label,
      targetType: target.type,
      targetSlug: target.slug,
      score: result.score,
      categoryScores: result.categoryScores,
      checks: result.checks,
      manualChecks: {},
      complianceGated: result.complianceGated,
      gscConnected: gsc !== null,
      gscSnapshot: gsc as unknown as Record<string, unknown> | null,
      generatedBy: userId,
      status: 'draft',
    },
  })
}

export async function POST(request: NextRequest) {
  const payload = await getPayloadCached()
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { targetType?: 'global' | 'collection'; targetSlug?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const { targetType, targetSlug } = body
  if (!targetSlug) {
    return NextResponse.json({ error: 'targetSlug is required.' }, { status: 400 })
  }

  if (targetSlug === WHOLE_SITE_TARGET_SLUG) {
    try {
      const targets = await listAllSeoReportTargets(payload)
      const reports = []
      for (const target of targets) {
        reports.push(await generateOneReport(payload, user.id, target))
      }
      return NextResponse.json({ success: true, reports })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      const stack = err instanceof Error ? err.stack : undefined
      payload.logger.error({ err, msg: '[seo-reports/generate] whole-site run failed' })
      return NextResponse.json(
        {
          error: 'Whole-site report generation failed. Check server logs.',
          ...(process.env.NODE_ENV !== 'production' ? { detail: message, stack } : {}),
        },
        { status: 500 },
      )
    }
  }

  if (!targetType) {
    return NextResponse.json({ error: 'targetType is required.' }, { status: 400 })
  }

  const target = await findSeoReportTarget(payload, targetSlug, targetType)
  if (!target) {
    return NextResponse.json({ error: `Unknown target: ${targetType}/${targetSlug}` }, { status: 404 })
  }

  try {
    const report = await generateOneReport(payload, user.id, target)
    return NextResponse.json({ success: true, report })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack : undefined
    payload.logger.error({ err, targetSlug, targetType, msg: '[seo-reports/generate] failed' })
    return NextResponse.json(
      {
        error: 'Report generation failed. Check server logs.',
        // Dev-only: real error surfaced so the admin UI can show it directly
        // instead of a generic message while triaging.
        ...(process.env.NODE_ENV !== 'production' ? { detail: message, stack } : {}),
      },
      { status: 500 },
    )
  }
}
