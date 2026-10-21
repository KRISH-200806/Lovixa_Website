'use client'

import { useEffect, useState } from 'react'
import { Button, Text } from '@/components/ui'
import { CONSENT_REQUIRED, getStoredConsent, setStoredConsent } from '@/lib/cookieConsent'

/**
 * Cookie-consent banner — only renders anything when
 * NEXT_PUBLIC_REQUIRE_COOKIE_CONSENT=true AND no decision is stored yet.
 * No-op entirely otherwise, same contract as every other optional component
 * in this kit. Gates GoogleAnalytics/MicrosoftClarity/MetaPixel via
 * useAnalyticsConsent() — see src/lib/cookieConsent.ts,
 * starter-kit/21-analytics.md.
 */
export default function CookieConsent() {
  // Starts false on both server and first client render (SSR can't read
  // localStorage) — a useEffect check after mount is the only safe way to
  // decide whether to show this without a hydration mismatch.
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!CONSENT_REQUIRED) return
    setVisible(getStoredConsent() === null)
  }, [])

  if (!CONSENT_REQUIRED || !visible) return null

  const decide = (granted: boolean) => {
    setStoredConsent(granted ? 'granted' : 'denied')
    setVisible(false)
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-800 bg-neutral-1000">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-4 sm:flex-row sm:justify-between">
        <Text tone="muted" className="text-body-sm">
          This site uses cookies for analytics. See our privacy policy for details.
        </Text>
        <div className="flex shrink-0 gap-3">
          <Button variant="ghost" size="sm" onClick={() => decide(false)}>
            Decline
          </Button>
          <Button variant="primary" size="sm" onClick={() => decide(true)}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  )
}
