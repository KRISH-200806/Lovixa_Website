/**
 * Server-side Cloudflare Turnstile verification. Call from any public form's
 * route handler / Server Action before writing to the DB or sending email.
 * See starter-kit/20-security-hardening.md.
 */
const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export async function verifyTurnstile(token: string | undefined | null, remoteIp?: string): Promise<boolean> {
  if (process.env.DISABLE_TURNSTILE === 'true') {
    if (process.env.NODE_ENV === 'production') {
      // Refuse to silently no-op the check in production even if misconfigured.
      console.error('[turnstile] DISABLE_TURNSTILE=true in production — refusing to bypass verification.')
      return false
    }
    return true
  }

  if (!token) return false

  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    console.error('[turnstile] TURNSTILE_SECRET_KEY is not set.')
    return false
  }

  try {
    const body = new URLSearchParams({ secret, response: token })
    if (remoteIp) body.set('remoteip', remoteIp)

    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch (err) {
    console.error('[turnstile] verification request failed:', err instanceof Error ? err.message : err)
    return false
  }
}
