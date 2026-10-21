'use client'

import Script from 'next/script'
import { useAnalyticsConsent } from '@/lib/hooks/useAnalyticsConsent'

/**
 * GA4. `strategy="afterInteractive"` — never render this via a raw <script>
 * tag (blocks first paint, breaks Next's script dedup). See
 * starter-kit/18-performance.md, cursor-rules/performance.mdc.
 *
 * No-ops entirely when NEXT_PUBLIC_GA_MEASUREMENT_ID is unset — safe to
 * leave mounted in every project, only fires once the client sets the ID.
 * Also gated behind cookie consent when NEXT_PUBLIC_REQUIRE_COOKIE_CONSENT=true
 * — see src/lib/cookieConsent.ts, starter-kit/21-analytics.md.
 */
export default function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  const consented = useAnalyticsConsent()
  if (!measurementId || !consented) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  )
}
