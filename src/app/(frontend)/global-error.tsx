'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

/**
 * Catches errors thrown by the root layout itself (e.g. getHeaderFooterForLayout()
 * failing) — error.tsx does NOT catch these, since it renders inside the layout.
 * Per Next.js's contract this file must render its own <html>/<body> (it
 * replaces the root layout on failure) and can't rely on styles.css/theme
 * tokens having loaded, so styling here is inline and static. See
 * starter-kit/25-error-handling-and-asset-fallback.md,
 * starter-kit/28-monitoring-and-error-tracking.md,
 * agent-skills/next-best-practices/error-handling.md.
 */
export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  // Safe to call unconditionally — no-ops when SENTRY_DSN is unset.
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '2rem',
          fontFamily: 'system-ui, sans-serif',
          background: '#0a0a0a',
          color: '#fafafa',
        }}
      >
        <div style={{ maxWidth: '32rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#a3a3a3', marginBottom: '2rem' }}>{error.message}</p>
          <button
            onClick={reset}
            style={{
              padding: '0.625rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: '#fafafa',
              color: '#0a0a0a',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
