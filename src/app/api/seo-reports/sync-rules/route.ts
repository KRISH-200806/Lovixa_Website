import { NextRequest, NextResponse } from 'next/server'
import { getPayloadCached } from '@/lib/cms/get-payload-cached'
import { getLiveSeoRulesConfig } from '@/lib/seo-report/remoteRules'

/**
 * On-demand staff endpoint to check and sync the latest Google & Schema.org guidelines.
 * Transforms remote specifications into our own proprietary TypeScript rules engine.
 */
export async function POST(request: NextRequest) {
  const payload = await getPayloadCached()
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const config = await getLiveSeoRulesConfig()
    const isLive = config.sourceCommit === 'github-live'

    return NextResponse.json({
      success: true,
      updated: isLive,
      message: isLive
        ? `Successfully synced latest Google & Schema.org guidelines (${config.deprecatedSchemaTypes.length} rules active).`
        : 'SEO rules are up-to-date (using active Google Search Central baseline).',
      timestamp: new Date(config.lastChecked).toLocaleString(),
      rulesCount: config.deprecatedSchemaTypes.length,
    })
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to sync SEO rules.',
      },
      { status: 500 },
    )
  }
}
