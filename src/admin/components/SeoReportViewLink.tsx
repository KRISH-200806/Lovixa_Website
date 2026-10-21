'use client'

import { Button, useDocumentInfo } from '@payloadcms/ui'

/**
 * Prominent link to the standalone /seo-report/[id] preview, shown above the
 * default edit view. Deliberately minimal (no fetch/state) — the previous
 * data-fetching panel in this same slot hung indefinitely in some
 * environments; this is just a static anchor built from the doc id.
 */
export function SeoReportViewLink() {
  const { id } = useDocumentInfo()
  if (!id) return null

  return (
    <Button el="link" url={`/seo-report/${id}`} buttonStyle="secondary" size="medium">
      View Full Report →
    </Button>
  )
}
