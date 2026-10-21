import { timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { revalidateAllSiteCache } from '@/lib/cms/revalidateAllSiteCache'
import { globalTag } from '@/lib/cms/cache-tags'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

/**
 * Uses a dedicated REVALIDATE_SECRET, not PAYLOAD_SECRET — this endpoint is
 * hit over a plain query string (logged in proxy/CDN/browser history), so it
 * must never carry the same secret that also signs Payload auth tokens.
 * See starter-kit/20-security-hardening.md.
 */
function constantTimeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

export async function GET(request: NextRequest) {
  const ip = getClientIp(request)
  if (!checkRateLimit(`revalidate:${ip}`, { limit: 10, windowMs: 60_000 })) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const secret = request.nextUrl.searchParams.get('secret')
  const tag = request.nextUrl.searchParams.get('tag')
  const all = request.nextUrl.searchParams.get('all')
  const expectedSecret = process.env.REVALIDATE_SECRET

  if (!expectedSecret) {
    return NextResponse.json({ error: 'REVALIDATE_SECRET is not set.' }, { status: 500 })
  }

  if (!secret || !constantTimeEqual(secret, expectedSecret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (all === '1' || all === 'true') {
    const result = revalidateAllSiteCache()
    return NextResponse.json({ revalidated: true, type: 'all', ...result, now: Date.now() })
  }

  if (tag) {
    revalidateTag(tag)
    return NextResponse.json({ revalidated: true, type: 'tag', target: tag, now: Date.now() })
  }

  revalidateTag(globalTag('header'))
  revalidateTag(globalTag('footer'))

  return NextResponse.json({
    revalidated: true,
    message: 'Revalidated header and footer tags by default.',
    now: Date.now(),
  })
}
