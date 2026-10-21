/**
 * Disposable-email check for public form submissions (contact forms, job
 * applications, newsletter signup). `@isdisposable/js` is offline-first
 * (160k+ domain list, zero deps, synchronous, no network call) — reject at
 * submit time, don't silently drop the lead. See starter-kit/20-security-hardening.md.
 */
import { isDisposable } from '@isdisposable/js'

export function isDisposableEmail(email: string): boolean {
  if (!email || !email.includes('@')) return false
  return isDisposable(email)
}
