import { NextRequest, NextResponse } from 'next/server'
import { getMediaUrl } from '@/utils/getMediaUrl'
import type { Redirect } from '@/payload-types'

/**
 * Canonical-host redirect + CMS-managed redirect lookup. Do NOT duplicate the
 * canonical-host redirect as a `redirects()` entry in next.config.mjs —
 * running both causes ERR_TOO_MANY_REDIRECTS. Security headers live in
 * next.config.mjs, not here — keep them in one place. See
 * starter-kit/20-security-hardening.md, 11-environment-and-deployment.md,
 * starter-kit/27-redirects.md.
 */
const CANONICAL_HOST = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL || '').host
  } catch {
    return ''
  }
})()

// Paths that should never trigger a redirect-collection lookup — the lookup
// itself calls /api/redirects, so excluding /api avoids a request loop, and
// /admin/_next are never meaningfully "redirected" content.
const SKIP_REDIRECT_LOOKUP = /^\/(api|admin|_next)(\/|$)/

/**
 * Looks up `/api/redirects?where[from][equals]=<pathname>` (the collection
 * @payloadcms/plugin-redirects adds — see payload.config.ts) and returns the
 * destination URL if a match exists, else null. This plugin manages redirect
 * *data* only, per its own docs — actually performing the redirect is left
 * to the frontend, which is this function.
 */
async function findRedirect(request: NextRequest): Promise<string | null> {
  if (SKIP_REDIRECT_LOOKUP.test(request.nextUrl.pathname)) return null

  try {
    const lookupUrl = new URL('/api/redirects', request.nextUrl.origin)
    lookupUrl.searchParams.set('where[from][equals]', request.nextUrl.pathname)
    lookupUrl.searchParams.set('limit', '1')
    lookupUrl.searchParams.set('depth', '1')

    // ISR-style fetch caching — a redirect lookup on every request is wasted
    // work for content that changes rarely; revalidated by time, not tags
    // (this plugin doesn't emit a cache tag on save).
    const res = await fetch(lookupUrl, { next: { revalidate: 60 } })
    if (!res.ok) return null

    const data = (await res.json()) as { docs?: Redirect[] }
    const redirect = data.docs?.[0]
    if (!redirect?.to) return null

    if (redirect.to.type === 'custom' && redirect.to.url) return redirect.to.url

    if (redirect.to.type === 'reference' && redirect.to.reference) {
      const ref = redirect.to.reference as { relationTo?: string; value?: any }
      if (ref.relationTo === 'media') {
        const url = getMediaUrl(ref.value)
        return url || null
      }
      if (ref.relationTo === 'products' && ref.value) {
        const slug = typeof ref.value === 'object' ? ref.value.slug : ref.value
        return `/products/${slug}`
      }
    }

    return null
  } catch (err) {
    // Never let a redirect-lookup failure break navigation — log and fall through.
    console.error('[middleware] redirect lookup failed:', err instanceof Error ? err.message : err)
    return null
  }
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''

  // No-op for local dev / preview URLs / when NEXT_PUBLIC_SITE_URL isn't a real host yet.
  if (!CANONICAL_HOST || host === CANONICAL_HOST || host.startsWith('localhost') || host.startsWith('127.0.0.1')) {
    const destination = await findRedirect(request)
    if (destination) {
      const url = destination.startsWith('http') ? new URL(destination) : request.nextUrl.clone()
      if (!destination.startsWith('http')) url.pathname = destination
      return NextResponse.redirect(url, 308)
    }
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.host = CANONICAL_HOST
  url.protocol = 'https'
  return NextResponse.redirect(url, 308)
}

export const config = {
  matcher: [
    /*
     * Skip static assets and Next internals — only run on page/API requests.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
