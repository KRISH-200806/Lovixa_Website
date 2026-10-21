import * as Sentry from '@sentry/nextjs'

// No-op entirely when SENTRY_DSN is unset — same contract as every other
// optional integration in this kit (analytics, image compression). Sentry's
// own guidance: conditionally call Sentry.init() rather than passing an
// empty/undefined dsn, since methods called before/without init safely no-op
// but init itself shouldn't run half-configured. See
// starter-kit/28-monitoring-and-error-tracking.md.
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  })
}
