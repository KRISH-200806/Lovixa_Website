/**
 * Cookie-consent gate for the analytics components (GoogleAnalytics,
 * MicrosoftClarity, MetaPixel). Opt-in via NEXT_PUBLIC_REQUIRE_COOKIE_CONSENT
 * — unset/false means zero behavior change from before this existed (every
 * analytics component still loads unconditionally once its own ID env var is
 * set, same contract as always). Set to 'true' for a client operating in a
 * jurisdiction requiring consent before analytics cookies fire (GDPR/EU, UK,
 * etc.) — see starter-kit/21-analytics.md.
 */

export const CONSENT_REQUIRED = process.env.NEXT_PUBLIC_REQUIRE_COOKIE_CONSENT === 'true'

export const CONSENT_STORAGE_KEY = 'cookie-consent'
export const CONSENT_CHANGE_EVENT = 'cookie-consent-change'

export type ConsentValue = 'granted' | 'denied'

export function getStoredConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    return value === 'granted' || value === 'denied' ? value : null
  } catch {
    // Private browsing / storage blocked — treat as no decision yet.
    return null
  }
}

export function setStoredConsent(value: ConsentValue): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value)
  } catch {
    // Storage blocked — the in-memory event still fires, banner just
    // reappears next load. Not fatal.
  }
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT))
}
