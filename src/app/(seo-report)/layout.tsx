import React from 'react'

/**
 * Minimal standalone layout for /seo-report/[id] — deliberately outside the
 * (payload) admin group and its import-map/RSC-component system, which has
 * proven unreliable for custom document panels in this environment. Plain
 * server-rendered HTML only.
 */
export default function SeoReportLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#fff', color: '#1a1a1a' }}>
        {children}
      </body>
    </html>
  )
}
