'use client'

import { useState } from 'react'

/**
 * Plain client component imported directly by /seo-report/[id]/page.tsx via
 * normal Next.js module resolution — NOT through Payload's admin import-map
 * system, which has proven unreliable for custom panels in this environment.
 */
const STATUSES = ['pass', 'fail', 'warn', 'na'] as const

export function SeoManualCheckSelect({
  reportId,
  checkId,
  initialStatus,
}: {
  reportId: string
  checkId: string
  initialStatus: string
}) {
  const [status, setStatus] = useState(initialStatus)
  const [pending, setPending] = useState(false)

  async function handleChange(next: string) {
    setPending(true)
    setStatus(next)
    try {
      await fetch(`/api/seo-reports/${reportId}/manual-check`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkId, status: next }),
      })
    } finally {
      setPending(false)
    }
  }

  return (
    <select value={status} disabled={pending} onChange={(e) => handleChange(e.target.value)}>
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s.toUpperCase()}
        </option>
      ))}
    </select>
  )
}
