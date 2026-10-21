'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'
import { Section, Heading, Text, Button } from '@/components/ui'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  // Safe to call unconditionally — Sentry.captureException no-ops when the
  // SDK was never initialized (SENTRY_DSN unset). See sentry.server.config.ts.
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <Section spacing="lg" containerSize="sm" className="text-center">
      <Heading as="h1" size={3} className="mb-4">
        Something went wrong
      </Heading>
      <Text tone="muted" className="mb-8">
        {error.message}
      </Text>
      <Button onClick={reset}>Try again</Button>
    </Section>
  )
}
