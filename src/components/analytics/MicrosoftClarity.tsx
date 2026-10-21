'use client'

import Script from 'next/script'
import { useAnalyticsConsent } from '@/lib/hooks/useAnalyticsConsent'

/**
 * Microsoft Clarity. Same rules as GoogleAnalytics.tsx — next/script,
 * afterInteractive, no-op when unset, cookie-consent gated when
 * NEXT_PUBLIC_REQUIRE_COOKIE_CONSENT=true.
 */
export default function MicrosoftClarity() {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID
  const consented = useAnalyticsConsent()
  if (!projectId || !consented) return null

  return (
    <Script id="ms-clarity-init" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${projectId}");
      `}
    </Script>
  )
}
