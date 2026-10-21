import * as Sentry from '@sentry/nextjs'

// Same DSN-gated no-op contract as sentry.server.config.ts — covers the edge
// runtime (middleware.ts, edge API routes). See
// starter-kit/28-monitoring-and-error-tracking.md.
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  })
}
