'use client'

import React, { useState, useRef } from 'react'

export function BackupManager() {
  const [isExporting, setIsExporting] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<any | null>(null)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)
  const [restoreSummary, setRestoreSummary] = useState<any | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 1. Export Flow
  const handleExport = async () => {
    setIsExporting(true)
    setStatusMessage({ type: 'info', text: 'Generating full database snapshot...' })
    try {
      const res = await fetch('/api/admin/backup/export')
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || `Export failed with status ${res.status}`)
      }

      const blob = await res.blob()
      const contentDisposition = res.headers.get('Content-Disposition')
      let filename = 'website-backup.json'
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/)
        if (match && match[1]) filename = match[1]
      }

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setStatusMessage({ type: 'success', text: `Backup downloaded successfully (${filename})` })
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Failed to download backup snapshot.' })
    } finally {
      setIsExporting(false)
    }
  }

  // 2. File Selection & Preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setStatusMessage(null)
    setRestoreSummary(null)

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string)
        if (json && json._meta) {
          setFilePreview(json)
        } else {
          setStatusMessage({ type: 'error', text: 'File is missing standard backup _meta header.' })
          setFilePreview(null)
        }
      } catch {
        setStatusMessage({ type: 'error', text: 'Invalid JSON file format.' })
        setFilePreview(null)
      }
    }
    reader.readAsText(file)
  }

  // 3. Restore Flow
  const handleRestore = async () => {
    if (!filePreview) {
      setStatusMessage({ type: 'error', text: 'Please select a valid backup JSON file first.' })
      return
    }

    const confirmed = window.confirm(
      `Are you sure you want to restore this backup from ${new Date(filePreview._meta.exportedAt).toLocaleString()}?\n\nThis will update matching content in the database.`,
    )
    if (!confirmed) return

    setIsRestoring(true)
    setStatusMessage({ type: 'info', text: 'Restoring database records... please wait.' })

    try {
      const res = await fetch('/api/admin/backup/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filePreview),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Restore failed.')
      }

      setStatusMessage({ type: 'success', text: 'Website database successfully restored!' })
      setRestoreSummary(data.summary)
      setSelectedFile(null)
      setFilePreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Restore operation failed.' })
    } finally {
      setIsRestoring(false)
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '960px', margin: '0 auto', fontFamily: 'inherit' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--theme-text, #111)' }}>
          Database Backup & Recovery
        </h2>
        <p style={{ margin: 0, color: 'var(--theme-elevation-500, #666)', fontSize: '0.925rem' }}>
          Create complete, portable JSON snapshots of all website content (Pages, Blocks, Media metadata, Theme Settings, Header, Footer, and SEO).
        </p>
      </div>

      {/* Alert / Notification */}
      {statusMessage && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '0.875rem',
            backgroundColor:
              statusMessage.type === 'success'
                ? 'rgba(16, 185, 129, 0.12)'
                : statusMessage.type === 'error'
                  ? 'rgba(239, 68, 68, 0.12)'
                  : 'rgba(59, 130, 246, 0.12)',
            color:
              statusMessage.type === 'success'
                ? '#059669'
                : statusMessage.type === 'error'
                  ? '#dc2626'
                  : '#2563eb',
            border: `1px solid ${
              statusMessage.type === 'success'
                ? 'rgba(16, 185, 129, 0.3)'
                : statusMessage.type === 'error'
                  ? 'rgba(239, 68, 68, 0.3)'
                  : 'rgba(59, 130, 246, 0.3)'
            }`,
          }}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Grid of Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Card 1: Export */}
        <div
          style={{
            border: '1px solid var(--theme-elevation-200, #e5e7eb)',
            borderRadius: '8px',
            padding: '24px',
            backgroundColor: 'var(--theme-elevation-50, #fafafa)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.25rem' }}>📦</span>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600 }}>Create Full Backup</h3>
            </div>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.875rem', color: 'var(--theme-elevation-600, #555)', lineHeight: 1.5 }}>
              Generates an instant portable snapshot of all collections and globals in a single JSON file. Ideal to run before making major changes.
            </p>
            <ul style={{ margin: '0 0 20px 0', paddingLeft: '20px', fontSize: '0.825rem', color: 'var(--theme-elevation-600, #666)' }}>
              <li>All Pages, Blocks & Content</li>
              <li>Theme & Color Palettes</li>
              <li>Header & Footer Navigation</li>
              <li>Media Metadata & Redirects</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            style={{
              width: '100%',
              padding: '12px 20px',
              backgroundColor: isExporting ? '#9ca3af' : 'var(--theme-primary, #fb5600)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: isExporting ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            {isExporting ? 'Generating Snapshot...' : '⬇️ Download Full Backup (.json)'}
          </button>
        </div>

        {/* Card 2: Restore */}
        <div
          style={{
            border: '1px solid var(--theme-elevation-200, #e5e7eb)',
            borderRadius: '8px',
            padding: '24px',
            backgroundColor: 'var(--theme-elevation-50, #fafafa)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.25rem' }}>📥</span>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600 }}>Restore Snapshot</h3>
            </div>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.875rem', color: 'var(--theme-elevation-600, #555)', lineHeight: 1.5 }}>
              Upload a previously exported backup file to restore your database.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px dashed var(--theme-elevation-300, #ccc)',
                borderRadius: '4px',
                marginBottom: '16px',
                fontSize: '0.85rem',
              }}
            />

            {filePreview && (
              <div
                style={{
                  padding: '12px',
                  backgroundColor: 'var(--theme-elevation-100, #f3f4f6)',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  marginBottom: '16px',
                  lineHeight: 1.4,
                }}
              >
                <div><strong>Exported:</strong> {new Date(filePreview._meta.exportedAt).toLocaleString()}</div>
                <div><strong>Total Records:</strong> {filePreview._meta.totalRecords}</div>
                <div><strong>Globals:</strong> {filePreview._meta.globalsCount}</div>
                <div><strong>Collections:</strong> {Object.keys(filePreview._meta.collectionsCount || {}).join(', ')}</div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleRestore}
            disabled={!filePreview || isRestoring}
            style={{
              width: '100%',
              padding: '12px 20px',
              backgroundColor: !filePreview || isRestoring ? '#9ca3af' : '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: !filePreview || isRestoring ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            {isRestoring ? 'Restoring Records...' : '🔄 Restore Website'}
          </button>
        </div>
      </div>

      {/* Restore Summary Report */}
      {restoreSummary && (
        <div
          style={{
            marginTop: '24px',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
          }}
        >
          <h4 style={{ margin: '0 0 8px 0', color: '#059669', fontSize: '1rem' }}>Restore Details</h4>
          <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: '#374151' }}>
            Processed <strong>{restoreSummary.totalRecordsProcessed}</strong> records ({restoreSummary.globalsRestored} globals).
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {Object.entries(restoreSummary.collectionsRestored || {}).map(([col, counts]: [string, any]) => (
              <span
                key={col}
                style={{
                  fontSize: '0.75rem',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                }}
              >
                {col}: +{counts.created} created, {counts.updated} updated
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
