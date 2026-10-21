'use client'

import React, { useEffect, useRef } from 'react'

export interface TurnstileWidgetProps {
  onVerify: (token: string) => void
  onError?: (error: Error | string) => void
  onExpire?: () => void
  className?: string
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string
          callback: (token: string) => void
          'error-callback'?: (err: unknown) => void
          'expired-callback'?: () => void
        },
      ) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
    onloadTurnstileCallback?: () => void
  }
}

export function TurnstileWidget({ onVerify, onError, onExpire, className }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DISABLE_TURNSTILE === 'true') {
      onVerify('mock-turnstile-token')
      return
    }

    let isMounted = true

    const renderWidget = () => {
      if (!containerRef.current || !window.turnstile || widgetIdRef.current) return
      try {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => {
            if (isMounted) onVerify(token)
          },
          'error-callback': (err: unknown) => {
            if (isMounted && onError) onError(String(err))
          },
          'expired-callback': () => {
            if (isMounted && onExpire) onExpire()
          },
        })
      } catch (err) {
        if (isMounted && onError) onError(err instanceof Error ? err : String(err))
      }
    }

    if (window.turnstile) {
      renderWidget()
    } else {
      const existingScript = document.getElementById('cf-turnstile-script')
      if (!existingScript) {
        const script = document.createElement('script')
        script.id = 'cf-turnstile-script'
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
        script.async = true
        script.defer = true
        script.onload = () => {
          if (isMounted) renderWidget()
        }
        document.head.appendChild(script)
      } else {
        existingScript.addEventListener('load', renderWidget)
      }
    }

    return () => {
      isMounted = false
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch {}
      }
    }
  }, [onVerify, onError, onExpire, siteKey])

  return <div ref={containerRef} className={className || 'my-2 flex justify-center'} />
}

export default TurnstileWidget
