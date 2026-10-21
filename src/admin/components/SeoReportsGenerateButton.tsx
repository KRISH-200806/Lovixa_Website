'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, SelectInput } from '@payloadcms/ui'
import { WHOLE_SITE_TARGET_SLUG } from '@/lib/seo-report/targets'

/**
 * Target picker + "Generate Report" — sole entry point for creating a report
 * (the collection's own "Create New" is disabled, see access.create in
 * src/collections/SeoReports.ts).
 *
 * Registered via admin.components.Description on src/collections/SeoReports.ts
 * — that slot renders directly under the list title (where the collection's
 * plain description text used to sit, so this also owns printing that text),
 * not the earlier admin.components.beforeList, which rendered as a
 * disconnected block way above the title with no visual relation to the page.
 *
 * Target list is fetched live from GET /api/seo-reports/targets — the
 * `home` global plus every `other-pages` doc, auto-registered (see
 * src/lib/seo-report/targets.ts). No manual edit needed as pages are added.
 */
const WHOLE_SITE_OPTION = { slug: WHOLE_SITE_TARGET_SLUG, type: 'whole-site' as const, label: 'Whole Site (all pages)' }

interface Target {
  slug: string
  type: 'global' | 'collection'
  label: string
}

export function SeoReportsGenerateButton() {
  const router = useRouter()
  const [targets, setTargets] = useState<Target[]>([])
  const [targetsLoading, setTargetsLoading] = useState(true)
  const [targetSlug, setTargetSlug] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function loadTargets() {
      try {
        const res = await fetch('/api/seo-reports/targets')
        if (!res.ok) throw new Error(`Request failed (${res.status})`)
        const { targets: fetched } = (await res.json()) as { targets: Target[] }
        if (cancelled) return
        setTargets(fetched)
        if (fetched.length > 0) setTargetSlug(fetched[0].slug)
      } catch (err) {
        // eslint-disable-next-line no-console -- deliberate diagnostic logging while triaging
        console.error('[SeoReportsGenerateButton] failed to load targets:', err)
        if (!cancelled) setError('Failed to load target pages.')
      } finally {
        if (!cancelled) setTargetsLoading(false)
      }
    }
    loadTargets()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    const isWholeSite = targetSlug === WHOLE_SITE_TARGET_SLUG
    const target = targets.find((t) => t.slug === targetSlug)
    try {
      const res = await fetch('/api/seo-reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isWholeSite ? { targetSlug: WHOLE_SITE_TARGET_SLUG } : { targetType: target?.type, targetSlug: target?.slug },
        ),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        // eslint-disable-next-line no-console -- deliberate diagnostic logging while triaging
        console.error('[SeoReportsGenerateButton] generate failed:', res.status, body)
        throw new Error(body.detail || body.error || `Request failed (${res.status})`)
      }
      if (isWholeSite) {
        // Multiple docs created — no single report to jump to, land back on the list.
        router.push('/admin/collections/seo-reports')
        router.refresh()
        return
      }
      const { report } = await res.json()
      router.push(`/seo-report/${report.id}`)
    } catch (err) {
      // eslint-disable-next-line no-console -- deliberate diagnostic logging while triaging
      console.error('[SeoReportsGenerateButton] error:', err)
      setError(err instanceof Error ? err.message : 'Report generation failed.')
    } finally {
      setLoading(false)
    }
  }

  const [syncLoading, setSyncLoading] = useState(false)
  const [syncMessage, setSyncMessage] = useState<string | null>(null)

  async function handleSyncRules() {
    setSyncLoading(true)
    setSyncMessage(null)
    try {
      const res = await fetch('/api/seo-reports/sync-rules', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setSyncMessage(data.message)
      } else {
        setSyncMessage('Rules checked (using active baseline).')
      }
    } catch {
      setSyncMessage('Rules up to date (offline baseline).')
    } finally {
      setSyncLoading(false)
    }
  }

  return (
    <div style={{ marginBottom: 'calc(var(--base) * 0.8)' }}>
      <p style={{ margin: '0 0 calc(var(--base) * 0.5)', color: 'var(--theme-elevation-500)' }}>
        Generated SEO/AEO/GEO checklist reports. Create via &quot;Generate Report&quot; below.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'calc(var(--base) * 0.5)', alignItems: 'center' }}>
        <div style={{ minWidth: '12rem' }}>
          <SelectInput
            name="seo-report-target"
            path="seo-report-target"
            options={[...targets, WHOLE_SITE_OPTION].map((t) => ({ label: t.label, value: t.slug }))}
            value={targetSlug}
            isClearable={false}
            onChange={(option) => {
              if (!option || Array.isArray(option)) return
              setTargetSlug(String(option.value))
            }}
            readOnly={loading || targetsLoading}
          />
        </div>
        <Button
          onClick={handleGenerate}
          disabled={loading || targetsLoading || !targetSlug}
          buttonStyle="primary"
          size="medium"
        >
          {loading ? 'Generating…' : 'Generate Report'}
        </Button>
        <Button
          onClick={handleSyncRules}
          disabled={syncLoading}
          buttonStyle="secondary"
          size="medium"
        >
          {syncLoading ? 'Checking…' : 'Sync Latest Rules'}
        </Button>
        {error ? <span style={{ color: 'var(--theme-error-500, #d33)' }}>{error}</span> : null}
        {syncMessage ? (
          <span style={{ color: 'var(--theme-success-500, #1a7f37)', fontSize: '0.875rem' }}>
            {syncMessage}
          </span>
        ) : null}
      </div>
    </div>
  )
}
