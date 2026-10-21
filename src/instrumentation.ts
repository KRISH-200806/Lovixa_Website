import * as Sentry from '@sentry/nextjs'

/**
 * Next.js instrumentation hook — runs once per runtime on boot. Loads the
 * matching Sentry config file for whichever runtime is active; both are
 * DSN-gated no-ops when SENTRY_DSN is unset. See
 * starter-kit/28-monitoring-and-error-tracking.md.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}

// Captures errors from Server Components/Route Handlers that Next.js's own
// error handling would otherwise swallow before error.tsx/global-error.tsx
// see them. Safe to export unconditionally — no-ops without an initialized
// Sentry client.
export const onRequestError = Sentry.captureRequestError
