import * as Sentry from '@sentry/nextjs'

// Client-side DSN is a separate, NEXT_PUBLIC_-prefixed var on purpose — lets
// a project run server-side error tracking without shipping a DSN to the
// browser bundle, if that's the only tracking wanted. No-op when unset, same
// contract as every other analytics component. See
// starter-kit/28-monitoring-and-error-tracking.md.
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  })
}

export const onRouterTransitionStart = (Sentry as Record<string, any>).captureRouterTransitionStart
