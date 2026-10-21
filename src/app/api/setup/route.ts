import { timingSafeEqual } from 'crypto'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { getPayloadCached } from '@/lib/cms/get-payload-cached'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

/**
 * One-time, password-gated first-run setup: creates the first admin user +
 * seeds placeholder content for Header/Footer/Home. Self-disables permanently
 * once any user exists — the idempotency check runs BEFORE the password
 * check, so this cannot be re-triggered even with the correct password once
 * setup has happened once. See starter-kit/24-github-deploy-and-setup.md.
 *
 * Does NOT run database migrations — schema migration is a deploy-time
 * concern (pnpm run payload:migrate), not something a public HTTP route
 * should perform. This route assumes the schema already exists.
 */
function constantTimeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  if (!checkRateLimit(`setup:${ip}`, { limit: 5, windowMs: 60_000 })) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const payload = await getPayloadCached()

  // Idempotency guard FIRST, before touching the password at all — once any
  // user exists, this route is permanently inert regardless of secret.
  const existing = await payload.count({ collection: 'users', overrideAccess: true })
  if (existing.totalDocs > 0) {
    return NextResponse.json({ error: 'Setup already completed.' }, { status: 409 })
  }

  const expectedSecret = process.env.SETUP_SECRET
  if (!expectedSecret) {
    return NextResponse.json({ error: 'SETUP_SECRET is not set.' }, { status: 500 })
  }

  let body: { secret?: string; email?: string; password?: string; siteName?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const { secret, email, password, siteName } = body

  if (!secret || !constantTimeEqual(secret, expectedSecret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!email || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: 'A valid admin email is required.' }, { status: 400 })
  }
  if (!password || password.length < 12) {
    return NextResponse.json({ error: 'Password must be at least 12 characters.' }, { status: 400 })
  }

  try {
    // Re-check inside the same flow (best-effort race guard — Users.email is
    // unique at the DB level too, so a genuine race still can't create two admins).
    const recheck = await payload.count({ collection: 'users', overrideAccess: true })
    if (recheck.totalDocs > 0) {
      return NextResponse.json({ error: 'Setup already completed.' }, { status: 409 })
    }

    const user = await payload.create({
      collection: 'users',
      data: { email, password, role: 'admin' } as any,
      overrideAccess: true,
    })

    // Seed placeholder content only where it's still empty — never overwrite
    // real content on a re-run attempt (blocked anyway by the guard above,
    // but keeps this function safe to reason about independently).
    const [home, header] = await Promise.all([
      payload.findGlobal({ slug: 'home' as never, overrideAccess: true }),
      payload.findGlobal({ slug: 'header', overrideAccess: true }),
    ])

    const heroTitle = (home as { hero?: { title?: string } })?.hero?.title
    if (!heroTitle) {
      await payload.updateGlobal({
        slug: 'home' as never,
        overrideAccess: true,
        data: {
          hero: {
            title: siteName || 'Welcome',
            subtitle: 'Edit this from /admin — Home → Hero.',
          },
        } as any,
      })
    }

    const currentSiteName = (header as { siteName?: string })?.siteName
    const currentLogo = (header as { logo?: unknown })?.logo

    const headerUpdate: { siteName?: string; logo?: unknown } = {}
    if (siteName && (!currentSiteName || currentSiteName === 'Your Site Name')) {
      headerUpdate.siteName = siteName
    }
    if (!currentLogo) {
      // Placeholder logo, seeded once so /admin → Header shows a real (obviously
      // placeholder) logo instead of an empty field. Uploads through whichever
      // storage adapter setup.sh wired (S3/Azure/GCS/Vercel Blob/UploadThing/local)
      // — filePath goes through the same Media collection hooks as a real admin
      // upload. See starter-kit/26-default-branding.md.
      try {
        const logoDoc = await payload.create({
          collection: 'media',
          data: { alt: 'Placeholder logo — replace in /admin → Header or Media' },
          filePath: path.resolve(process.cwd(), 'public/branding/placeholder-logo.svg'),
          overrideAccess: true,
        })
        headerUpdate.logo = logoDoc.id
      } catch (err) {
        // Non-fatal — admin creation already succeeded above; a missing
        // placeholder logo shouldn't fail the whole setup flow.
        console.error('[setup] placeholder logo seed failed:', err instanceof Error ? err.message : err)
      }
    }
    if (Object.keys(headerUpdate).length > 0) {
      await payload.updateGlobal({
        slug: 'header',
        overrideAccess: true,
        data: headerUpdate as any,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Setup complete. Log in at /admin.',
      userId: user.id,
    })
  } catch (err) {
    console.error('[setup] failed:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Setup failed. Check server logs.' }, { status: 500 })
  }
}
