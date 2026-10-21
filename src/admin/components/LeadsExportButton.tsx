'use client'

import React, { useState } from 'react'

export function LeadsExportButton() {
  const [isExporting, setIsExporting] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const url = `/api/admin/leads/export?status=${statusFilter}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Export failed with status ${res.status}`)

      const blob = await res.blob()
      const contentDisposition = res.headers.get('Content-Disposition')
      let filename = 'leads-export.csv'
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/)
        if (match && match[1]) filename = match[1]
      }

      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(downloadUrl)
      document.body.removeChild(a)
    } catch (err: any) {
      alert(`Export error: ${err?.message || 'Failed to download leads.'}`)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '12px 16px',
        backgroundColor: 'var(--theme-elevation-50, #fafafa)',
        border: '1px solid var(--theme-elevation-200, #e5e7eb)',
        borderRadius: '6px',
        margin: '12px 0 20px 0',
      }}
    >
      <div>
        <p style={{ margin: '0 0 2px 0', fontWeight: 600, fontSize: '0.9rem', color: 'var(--theme-text, #111)' }}>
          Lead Management & Export Center
        </p>
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--theme-elevation-500, #666)' }}>
          Every inquiry from contact, quote, and newsletter forms is captured here automatically.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '6px 10px',
            borderRadius: '4px',
            border: '1px solid var(--theme-elevation-300, #ccc)',
            fontSize: '0.825rem',
            backgroundColor: 'var(--theme-input-bg, #fff)',
          }}
        >
          <option value="all">All Statuses</option>
          <option value="new">New (Unread) Only</option>
          <option value="contacted">Contacted Only</option>
          <option value="qualified">Qualified Leads</option>
        </select>

        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            backgroundColor: isExporting ? '#9ca3af' : 'var(--theme-primary, #fb5600)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: isExporting ? 'not-allowed' : 'pointer',
          }}
        >
          {isExporting ? 'Exporting...' : '📥 Export to CSV / Excel'}
        </button>
      </div>
    </div>
  )
}
