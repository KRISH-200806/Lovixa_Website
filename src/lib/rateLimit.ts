/**
 * In-memory sliding-window rate limiter. Defense-in-depth only — this is
 * per-process state, so it resets on redeploy/restart and doesn't share
 * state across multiple instances (serverless, multi-replica). The real
 * rate limit / DDoS layer belongs at the edge (Cloudflare, Vercel Firewall,
 * reverse proxy) — see starter-kit/20-security-hardening.md. Use this to
 * blunt obvious single-instance abuse (repeated hits on /api/revalidate,
 * a form endpoint, etc.), not as the only defense.
 */
const buckets = new Map<string, { count: number; resetAt: number }>()

// Periodic cleanup so the map doesn't grow unbounded under sustained traffic.
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000
let lastCleanup = Date.now()

function cleanup(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return
  lastCleanup = now
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

/**
 * Returns true if the request is within limit (and records the hit), false
 * if the caller should be rejected (429).
 */
export function checkRateLimit(key: string, { limit, windowMs }: { limit: number; windowMs: number }): boolean {
  const now = Date.now()
  cleanup(now)

  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (bucket.count >= limit) return false

  bucket.count++
  return true
}

/** Best-effort client IP from common proxy headers — trust only behind a real proxy/CDN that sets these. */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0].trim()
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp.trim()
  return 'unknown'
}
