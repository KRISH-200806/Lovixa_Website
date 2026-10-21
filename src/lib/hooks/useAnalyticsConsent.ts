'use client'

import { useEffect, useState } from 'react'
import { CONSENT_CHANGE_EVENT, CONSENT_REQUIRED, getStoredConsent } from '@/lib/cookieConsent'

/**
 * True when an analytics component is allowed to load: either consent isn't
 * required at all (CONSENT_REQUIRED=false, the default), or it's required
 * and the visitor has granted it. Re-evaluates live when CookieConsent
 * records a decision, no reload needed. See src/lib/cookieConsent.ts.
 */
export function useAnalyticsConsent(): boolean {
  const [allowed, setAllowed] = useState(() => !CONSENT_REQUIRED || getStoredConsent() === 'granted')

  useEffect(() => {
    if (!CONSENT_REQUIRED) return
    const update = () => setAllowed(getStoredConsent() === 'granted')
    update()
    window.addEventListener(CONSENT_CHANGE_EVENT, update)
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, update)
  }, [])

  return allowed
}
