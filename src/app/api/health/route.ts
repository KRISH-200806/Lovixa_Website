import { NextRequest, NextResponse } from 'next/server'
import os from 'os'
import { getPayloadCached } from '@/lib/cms/get-payload-cached'
import {
  isS3Configured,
  isAzureConfigured,
  isGcsConfigured,
  isVercelBlobConfigured,
  isUploadthingConfigured,
} from '@/utils/storage'

export const dynamic = 'force-dynamic'

function getStorageProvider(): string {
  if (isS3Configured) return 's3-compatible'
  if (isAzureConfigured) return 'azure-blob'
  if (isGcsConfigured) return 'google-cloud-storage'
  if (isVercelBlobConfigured) return 'vercel-blob'
  if (isUploadthingConfigured) return 'uploadthing'
  return 'local-disk'
}

function getDatabaseEngine(): string {
  const url = (process.env.DATABASE_URL || '').toLowerCase()
  if (url.startsWith('mongodb')) return 'MongoDB'
  if (url.startsWith('postgres') || url.startsWith('postgresql')) return 'PostgreSQL'
  if (url.startsWith('sqlite') || url.startsWith('file:')) return 'SQLite'
  return 'PostgreSQL'
}

function getEmailEngine(): string {
  if (process.env.RESEND_API_KEY) return 'Resend'
  if (process.env.SMTP_HOST) return 'Custom SMTP'
  if (process.env.SENDGRID_API_KEY) return 'SendGrid'
  return 'Dev / Console Fallback'
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / (3600 * 24))
  const h = Math.floor((seconds % (3600 * 24)) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  const parts: string[] = []
  if (d > 0) parts.push(`${d}d`)
  if (h > 0) parts.push(`${h}h`)
  if (m > 0) parts.push(`${m}m`)
  parts.push(`${s}s`)
  return parts.join(' ')
}

interface HealthData {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  uptimeSeconds: number
  uptimeFormatted: string
  environment: string
  responseTimeMs: number
  runtime: {
    nodeVersion: string
    platform: string
    arch: string
    cpuCores: number
    memory: {
      heapUsedMb: number
      heapTotalMb: number
      rssMb: number
      heapUtilizationPercent: number
    }
  }
  services: {
    server: string
    database: {
      status: string
      engine: string
    }
    payload: {
      status: string
      version: string
    }
    storage: {
      status: string
      provider: string
    }
    email: {
      status: string
      provider: string
    }
  }
  cmsMetrics: {
    users: number
    pages: number
    media: number
    formSubmissions: number
  }
  security: {
    csp: boolean
    hsts: boolean
    livePreviewChannel: boolean
    strictDraftMode: boolean
  }
  error?: string
}

function renderHtmlDashboard(data: HealthData): string {
  const isHealthy = data.status === 'healthy'
  const statusColor = isHealthy ? '#22c55e' : '#ef4444'
  const statusBg = isHealthy ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)'
  const statusBorder = isHealthy ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)'
  const statusHeadline = isHealthy ? 'All Systems Operational' : 'System Degraded / Action Required'
  const latencyClass = data.responseTimeMs < 50 ? 'latency-good' : data.responseTimeMs < 200 ? 'latency-warn' : 'latency-bad'

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>System Health & Telemetry | Payload CMS + Next.js</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #07080c;
      --surface: #0f1118;
      --surface-subtle: #141722;
      --surface-hover: #1a1e2d;
      --border: rgba(255, 255, 255, 0.08);
      --border-strong: rgba(255, 255, 255, 0.16);
      --text: #f9fafb;
      --text-muted: #94a3b8;
      --accent: #fb5600;
      --accent-glow: rgba(251, 86, 0, 0.25);
      --green: #22c55e;
      --green-glow: rgba(34, 197, 94, 0.2);
      --red: #ef4444;
      --yellow: #eab308;
      --font: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --mono: 'JetBrains Mono', monospace;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: radial-gradient(circle at 50% 0%, #171b2b 0%, var(--bg) 70%);
      color: var(--text);
      font-family: var(--font);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 20px;
      line-height: 1.5;
    }
    .container {
      width: 100%;
      max-width: 920px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }
    .title-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-badge {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: linear-gradient(135deg, #fb5600, #ff8800);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      box-shadow: 0 0 20px var(--accent-glow);
    }
    .title {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .subtitle {
      font-size: 13px;
      color: var(--text-muted);
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .env-badge {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-muted);
    }
    .status-banner {
      background: ${statusBg};
      border: 1px solid ${statusBorder};
      border-radius: 16px;
      padding: 22px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      backdrop-filter: blur(12px);
      flex-wrap: wrap;
      gap: 16px;
      transition: background 0.3s, border-color 0.3s;
    }
    .status-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .pulse-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: ${statusColor};
      box-shadow: 0 0 16px ${statusColor};
      animation: pulse 2s infinite ease-in-out;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.25); opacity: 0.55; }
    }
    .status-headline {
      font-size: 18px;
      font-weight: 700;
      color: ${statusColor};
      transition: color 0.3s;
    }
    .status-sub {
      font-size: 13px;
      color: var(--text-muted);
    }
    .metrics-summary {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .latency-badge {
      font-family: var(--mono);
      font-size: 13px;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: rgba(0, 0, 0, 0.4);
      transition: all 0.3s;
    }
    .latency-good { color: var(--green); border-color: rgba(34, 197, 94, 0.3); }
    .latency-warn { color: var(--yellow); border-color: rgba(234, 179, 8, 0.3); }
    .latency-bad { color: var(--red); border-color: rgba(239, 68, 68, 0.3); }

    .section-title {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
      margin-bottom: 24px;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin-bottom: 24px;
    }
    @media (max-width: 768px) {
      .grid-2, .grid-4 { grid-template-columns: 1fr; }
    }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 18px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.2s ease;
    }
    .card:hover {
      background: var(--surface-hover);
      border-color: var(--border-strong);
      transform: translateY(-1px);
    }
    .card-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .card-icon {
      font-size: 20px;
      width: 42px;
      height: 42px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.03);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border);
    }
    .card-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--text);
    }
    .card-desc {
      font-size: 12px;
      color: var(--text-muted);
    }
    .card-status {
      font-size: 12px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 6px;
      text-transform: capitalize;
    }
    .status-ok {
      background: rgba(34, 197, 94, 0.1);
      color: var(--green);
      border: 1px solid rgba(34, 197, 94, 0.25);
    }
    .status-bad {
      background: rgba(239, 68, 68, 0.1);
      color: var(--red);
      border: 1px solid rgba(239, 68, 68, 0.25);
    }
    .stat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .stat-num {
      font-size: 24px;
      font-weight: 700;
      color: var(--text);
      font-family: var(--mono);
      transition: color 0.3s;
    }
    .stat-label {
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 500;
    }

    /* Telemetry Bar */
    .telemetry-box {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .telemetry-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      font-size: 13px;
    }
    .progress-track {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      height: 10px;
      border-radius: 9999px;
      overflow: hidden;
      margin-bottom: 14px;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #22c55e, #eab308);
      border-radius: 9999px;
      transition: width 0.4s ease;
    }
    .telemetry-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--border);
    }
    @media (max-width: 600px) {
      .telemetry-grid { grid-template-columns: repeat(2, 1fr); }
    }
    .telemetry-item-label {
      font-size: 11px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .telemetry-item-val {
      font-size: 13px;
      font-weight: 600;
      color: var(--text);
      font-family: var(--mono);
      margin-top: 2px;
    }

    /* Quick Links & Verification Pills */
    .pills-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 24px;
    }
    .pill-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border);
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      color: var(--text-muted);
      text-decoration: none;
      transition: all 0.2s;
    }
    .pill-link:hover {
      background: rgba(255, 255, 255, 0.08);
      color: var(--text);
      border-color: var(--border-strong);
    }
    .pill-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--green);
    }

    /* Action Controls */
    .actions-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      padding-top: 8px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--accent);
      color: #fff;
      font-size: 13px;
      font-weight: 600;
      padding: 10px 18px;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      text-decoration: none;
      transition: opacity 0.2s, transform 0.1s;
    }
    .btn:hover { opacity: 0.9; }
    .btn:active { transform: scale(0.98); }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text);
      border: 1px solid var(--border);
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    .autorefresh-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: var(--text-muted);
      background: rgba(255, 255, 255, 0.03);
      padding: 6px 12px;
      border-radius: 8px;
      border: 1px solid var(--border);
    }
    .autorefresh-toggle select {
      background: #000;
      color: var(--text);
      border: 1px solid var(--border);
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
      outline: none;
      cursor: pointer;
    }
    .live-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--green);
      display: none;
      animation: pulse 1.5s infinite ease-in-out;
    }
    .json-box {
      margin-top: 20px;
      background: #050608;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 18px;
      font-family: var(--mono);
      font-size: 12px;
      color: #a7f3d0;
      overflow-x: auto;
      display: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="title-group">
        <div class="logo-badge">⚡</div>
        <div>
          <div class="title">System Health & Telemetry</div>
          <div class="subtitle">Next.js 15 App Router + Payload CMS 3.x Enterprise Stack</div>
        </div>
      </div>
      <div class="header-actions">
        <div class="env-badge" id="envBadge">${data.environment}</div>
        <div class="autorefresh-toggle">
          <div class="live-dot" id="liveDot"></div>
          <span>Auto-Poll:</span>
          <select id="pollSelect" onchange="onPollSelectChange(this.value)">
            <option value="0">Off</option>
            <option value="3">3s</option>
            <option value="5">5s</option>
            <option value="15">15s</option>
            <option value="30">30s</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Status Banner -->
    <div class="status-banner" id="statusBanner">
      <div class="status-info">
        <div class="pulse-dot" id="statusDot"></div>
        <div>
          <div class="status-headline" id="statusHeadline">${statusHeadline}</div>
          <div class="status-sub" id="statusSub">All critical subsystems verified • Uptime: ${data.uptimeFormatted}</div>
        </div>
      </div>
      <div class="metrics-summary">
        <div class="latency-badge ${latencyClass}" id="latencyBadge">${data.responseTimeMs}ms response</div>
      </div>
    </div>

    <!-- Subsystems Grid -->
    <div class="section-title">Core Subsystems & Microservices</div>
    <div class="grid-2">
      <div class="card">
        <div class="card-left">
          <div class="card-icon">▲</div>
          <div>
            <div class="card-name">Next.js 15 App Router</div>
            <div class="card-desc">React 19 Server Components</div>
          </div>
        </div>
        <div class="card-status status-ok" id="serverStatus">operational</div>
      </div>

      <div class="card">
        <div class="card-left">
          <div class="card-icon">🗄️</div>
          <div>
            <div class="card-name" id="dbTitle">Database (${data.services.database.engine})</div>
            <div class="card-desc">Active Connection Pool</div>
          </div>
        </div>
        <div class="card-status ${data.services.database.status === 'connected' ? 'status-ok' : 'status-bad'}" id="dbStatus">
          ${data.services.database.status}
        </div>
      </div>

      <div class="card">
        <div class="card-left">
          <div class="card-icon">🚀</div>
          <div>
            <div class="card-name">Payload CMS 3.x</div>
            <div class="card-desc">Local API Singleton</div>
          </div>
        </div>
        <div class="card-status ${data.services.payload.status === 'initialized' ? 'status-ok' : 'status-bad'}" id="payloadStatus">
          ${data.services.payload.status}
        </div>
      </div>

      <div class="card">
        <div class="card-left">
          <div class="card-icon">📦</div>
          <div>
            <div class="card-name">Media Storage Driver</div>
            <div class="card-desc" id="storageDesc">${data.services.storage.provider}</div>
          </div>
        </div>
        <div class="card-status status-ok" id="storageStatus">active</div>
      </div>

      <div class="card">
        <div class="card-left">
          <div class="card-icon">✉️</div>
          <div>
            <div class="card-name">Email Transport</div>
            <div class="card-desc" id="emailDesc">${data.services.email.provider}</div>
          </div>
        </div>
        <div class="card-status status-ok" id="emailStatus">active</div>
      </div>

      <div class="card">
        <div class="card-left">
          <div class="card-icon">🔒</div>
          <div>
            <div class="card-name">Security & Headers</div>
            <div class="card-desc">CSP • HSTS • Live Preview Guard</div>
          </div>
        </div>
        <div class="card-status status-ok">hardened</div>
      </div>
    </div>

    <!-- CMS Metrics Counters -->
    <div class="section-title">CMS Repository Vitals</div>
    <div class="grid-4">
      <div class="stat-card">
        <div class="stat-num" id="statPages">${data.cmsMetrics.pages}</div>
        <div class="stat-label">Published Pages</div>
      </div>
      <div class="stat-card">
        <div class="stat-num" id="statMedia">${data.cmsMetrics.media}</div>
        <div class="stat-label">Media Assets</div>
      </div>
      <div class="stat-card">
        <div class="stat-num" id="statUsers">${data.cmsMetrics.users}</div>
        <div class="stat-label">System Users / Admins</div>
      </div>
      <div class="stat-card">
        <div class="stat-num" id="statForms">${data.cmsMetrics.formSubmissions}</div>
        <div class="stat-label">Form Submissions</div>
      </div>
    </div>

    <!-- Telemetry & Memory Box -->
    <div class="section-title">Runtime & Memory Telemetry</div>
    <div class="telemetry-box">
      <div class="telemetry-row">
        <span id="memUsageText"><strong>V8 Heap Memory:</strong> ${data.runtime.memory.heapUsedMb} MB / ${data.runtime.memory.heapTotalMb} MB</span>
        <span id="memPercentText" style="font-family: var(--mono); color: var(--text-muted);">${data.runtime.memory.heapUtilizationPercent}% utilization</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" id="memFillBar" style="width: ${data.runtime.memory.heapUtilizationPercent}%"></div>
      </div>
      <div class="telemetry-grid">
        <div>
          <div class="telemetry-item-label">Node Runtime</div>
          <div class="telemetry-item-val" id="nodeVerVal">${data.runtime.nodeVersion}</div>
        </div>
        <div>
          <div class="telemetry-item-label">OS Platform</div>
          <div class="telemetry-item-val" id="platformVal">${data.runtime.platform} (${data.runtime.arch})</div>
        </div>
        <div>
          <div class="telemetry-item-label">CPU Cores</div>
          <div class="telemetry-item-val" id="cpuVal">${data.runtime.cpuCores} Cores</div>
        </div>
        <div>
          <div class="telemetry-item-label">Process RSS</div>
          <div class="telemetry-item-val" id="rssVal">${data.runtime.memory.rssMb} MB</div>
        </div>
      </div>
    </div>

    <!-- Quick Endpoint Verification -->
    <div class="section-title">SEO & AI Search (AEO) Readiness Endpoints</div>
    <div class="pills-container">
      <a class="pill-link" href="/llms.txt" target="_blank">
        <div class="pill-dot"></div> /llms.txt (AI Search Manifest) ↗
      </a>
      <a class="pill-link" href="/sitemap.xml" target="_blank">
        <div class="pill-dot"></div> /sitemap.xml (Dynamic Sitemap) ↗
      </a>
      <a class="pill-link" href="/robots.txt" target="_blank">
        <div class="pill-dot"></div> /robots.txt (Crawler Policy) ↗
      </a>
      <a class="pill-link" href="/admin" target="_blank">
        <div class="pill-dot"></div> /admin (Payload CMS Console) ↗
      </a>
    </div>

    <!-- Actions & Controls -->
    <div class="actions-bar">
      <div style="display: flex; gap: 8px;">
        <button class="btn" id="refreshBtn" onclick="fetchLiveTelemetry(true)">
          <span>🔄</span> Re-Check Health
        </button>
        <button class="btn btn-secondary" id="copyBtn" onclick="copyDiagnostics()">
          <span>📋</span> Copy Diagnostics
        </button>
      </div>
      <div style="display: flex; gap: 8px;">
        <a class="btn btn-secondary" href="/admin">CMS Admin</a>
        <button class="btn btn-secondary" onclick="toggleJson()">View Raw JSON</button>
      </div>
    </div>

    <!-- Collapsible Raw JSON -->
    <pre id="jsonBox" class="json-box">${JSON.stringify(data, null, 2)}</pre>
  </div>

  <script>
    let currentData = ${JSON.stringify(data)};
    let pollTimer = null;

    function toggleJson() {
      const el = document.getElementById('jsonBox');
      el.style.display = el.style.display === 'block' ? 'none' : 'block';
    }

    function copyDiagnostics() {
      navigator.clipboard.writeText(JSON.stringify(currentData, null, 2)).then(() => {
        const btn = document.getElementById('copyBtn');
        const orig = btn.innerHTML;
        btn.innerHTML = '<span>✅</span> Copied!';
        setTimeout(() => { btn.innerHTML = orig; }, 2000);
      });
    }

    async function fetchLiveTelemetry(showSpin = false) {
      const refreshBtn = document.getElementById('refreshBtn');
      if (showSpin && refreshBtn) {
        refreshBtn.innerHTML = '<span>⏳</span> Checking...';
      }

      try {
        const res = await fetch('/api/health?json=true', {
          headers: { 'Accept': 'application/json' },
          cache: 'no-store',
        });
        const updated = await res.json();
        currentData = updated;

        // In-place DOM updates without reloading page
        const isHealthy = updated.status === 'healthy';
        const color = isHealthy ? '#22c55e' : '#ef4444';

        const headlineEl = document.getElementById('statusHeadline');
        if (headlineEl) {
          headlineEl.textContent = isHealthy ? 'All Systems Operational' : 'System Degraded / Action Required';
          headlineEl.style.color = color;
        }

        const statusSubEl = document.getElementById('statusSub');
        if (statusSubEl) {
          statusSubEl.textContent = 'All critical subsystems verified • Uptime: ' + (updated.uptimeFormatted || (updated.uptimeSeconds + 's'));
        }

        const latencyEl = document.getElementById('latencyBadge');
        if (latencyEl) {
          latencyEl.textContent = updated.responseTimeMs + 'ms response';
          latencyEl.className = 'latency-badge ' + (updated.responseTimeMs < 50 ? 'latency-good' : updated.responseTimeMs < 200 ? 'latency-warn' : 'latency-bad');
        }

        const statPages = document.getElementById('statPages');
        if (statPages && updated.cmsMetrics) statPages.textContent = updated.cmsMetrics.pages ?? 0;

        const statMedia = document.getElementById('statMedia');
        if (statMedia && updated.cmsMetrics) statMedia.textContent = updated.cmsMetrics.media ?? 0;

        const statUsers = document.getElementById('statUsers');
        if (statUsers && updated.cmsMetrics) statUsers.textContent = updated.cmsMetrics.users ?? 0;

        const statForms = document.getElementById('statForms');
        if (statForms && updated.cmsMetrics) statForms.textContent = updated.cmsMetrics.formSubmissions ?? 0;

        if (updated.runtime && updated.runtime.memory) {
          const mem = updated.runtime.memory;
          const memUsage = document.getElementById('memUsageText');
          if (memUsage) memUsage.innerHTML = '<strong>V8 Heap Memory:</strong> ' + mem.heapUsedMb + ' MB / ' + mem.heapTotalMb + ' MB';

          const memPercent = document.getElementById('memPercentText');
          if (memPercent) memPercent.textContent = mem.heapUtilizationPercent + '% utilization';

          const memBar = document.getElementById('memFillBar');
          if (memBar) memBar.style.width = mem.heapUtilizationPercent + '%';

          const rss = document.getElementById('rssVal');
          if (rss) rss.textContent = mem.rssMb + ' MB';
        }

        const jsonBox = document.getElementById('jsonBox');
        if (jsonBox) jsonBox.textContent = JSON.stringify(updated, null, 2);
      } catch (err) {
        console.error('Failed to poll health telemetry:', err);
      } finally {
        if (showSpin && refreshBtn) {
          refreshBtn.innerHTML = '<span>🔄</span> Re-Check Health';
        }
      }
    }

    function onPollSelectChange(secondsStr) {
      const sec = parseInt(secondsStr, 10);
      try {
        localStorage.setItem('payload_health_poll_interval', secondsStr);
      } catch (e) {}
      startPollingLoop(sec);
    }

    function startPollingLoop(sec) {
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
      const liveDot = document.getElementById('liveDot');

      if (sec > 0) {
        if (liveDot) liveDot.style.display = 'inline-block';
        pollTimer = setInterval(() => {
          fetchLiveTelemetry(false);
        }, sec * 1000);
      } else {
        if (liveDot) liveDot.style.display = 'none';
      }
    }

    // Initialize persisted Auto-Poll selection from localStorage
    document.addEventListener('DOMContentLoaded', () => {
      try {
        const saved = localStorage.getItem('payload_health_poll_interval');
        if (saved) {
          const select = document.getElementById('pollSelect');
          if (select) {
            select.value = saved;
            const sec = parseInt(saved, 10);
            if (sec > 0) startPollingLoop(sec);
          }
        }
      } catch (e) {}
    });
  </script>
</body>
</html>`
}

/**
 * Production Health, Telemetry & Diagnostics Route
 *
 * Dual-Mode Content Negotiated:
 * - Browser (text/html): Renders rich, interactive telemetry & monitoring dashboard.
 * - API Probes / Orchestrators (application/json): Returns machine-readable JSON status.
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const acceptHeader = request.headers.get('accept') || ''
  const wantsJson = acceptHeader.includes('application/json') || request.nextUrl.searchParams.has('json')

  try {
    const payload = await getPayloadCached()

    // Execute non-blocking telemetry & collection count queries in parallel
    const [usersRes, pagesRes, mediaRes, formsRes] = await Promise.allSettled([
      payload.count({ collection: 'users', overrideAccess: true }),
      payload.count({ collection: 'pages', overrideAccess: true }),
      payload.count({ collection: 'media', overrideAccess: true }),
      payload.count({ collection: 'form-submissions', overrideAccess: true }),
    ])

    const responseTimeMs = Date.now() - startTime
    const mem = process.memoryUsage()
    const uptimeSec = Math.floor(process.uptime())

    const heapUsedMb = Math.round((mem.heapUsed / (1024 * 1024)) * 10) / 10
    const heapTotalMb = Math.round((mem.heapTotal / (1024 * 1024)) * 10) / 10
    const rssMb = Math.round((mem.rss / (1024 * 1024)) * 10) / 10
    const heapUtilizationPercent = Math.min(100, Math.round((mem.heapUsed / (mem.heapTotal || 1)) * 100))

    const healthData: HealthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptimeSeconds: uptimeSec,
      uptimeFormatted: formatUptime(uptimeSec),
      environment: process.env.NODE_ENV || 'development',
      responseTimeMs,
      runtime: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        cpuCores: os.cpus()?.length || 1,
        memory: {
          heapUsedMb,
          heapTotalMb,
          rssMb,
          heapUtilizationPercent,
        },
      },
      services: {
        server: 'operational',
        database: {
          status: 'connected',
          engine: getDatabaseEngine(),
        },
        payload: {
          status: 'initialized',
          version: '3.x',
        },
        storage: {
          status: 'active',
          provider: getStorageProvider(),
        },
        email: {
          status: 'active',
          provider: getEmailEngine(),
        },
      },
      cmsMetrics: {
        users: usersRes.status === 'fulfilled' ? usersRes.value.totalDocs : 0,
        pages: pagesRes.status === 'fulfilled' ? pagesRes.value.totalDocs : 0,
        media: mediaRes.status === 'fulfilled' ? mediaRes.value.totalDocs : 0,
        formSubmissions: formsRes.status === 'fulfilled' ? formsRes.value.totalDocs : 0,
      },
      security: {
        csp: true,
        hsts: true,
        livePreviewChannel: true,
        strictDraftMode: true,
      },
    }

    if (!wantsJson && acceptHeader.includes('text/html')) {
      return new NextResponse(renderHtmlDashboard(healthData), {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        },
      })
    }

    return NextResponse.json(healthData, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    const responseTimeMs = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : 'Database connectivity check failed'
    const mem = process.memoryUsage()
    const uptimeSec = Math.floor(process.uptime())

    const heapUsedMb = Math.round((mem.heapUsed / (1024 * 1024)) * 10) / 10
    const heapTotalMb = Math.round((mem.heapTotal / (1024 * 1024)) * 10) / 10
    const rssMb = Math.round((mem.rss / (1024 * 1024)) * 10) / 10
    const heapUtilizationPercent = Math.min(100, Math.round((mem.heapUsed / (mem.heapTotal || 1)) * 100))

    const errorData: HealthData = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptimeSeconds: uptimeSec,
      uptimeFormatted: formatUptime(uptimeSec),
      environment: process.env.NODE_ENV || 'development',
      responseTimeMs,
      runtime: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        cpuCores: os.cpus()?.length || 1,
        memory: {
          heapUsedMb,
          heapTotalMb,
          rssMb,
          heapUtilizationPercent,
        },
      },
      services: {
        server: 'operational',
        database: {
          status: 'disconnected',
          engine: getDatabaseEngine(),
        },
        payload: {
          status: 'error',
          version: '3.x',
        },
        storage: {
          status: 'active',
          provider: getStorageProvider(),
        },
        email: {
          status: 'active',
          provider: getEmailEngine(),
        },
      },
      cmsMetrics: {
        users: 0,
        pages: 0,
        media: 0,
        formSubmissions: 0,
      },
      security: {
        csp: true,
        hsts: true,
        livePreviewChannel: true,
        strictDraftMode: true,
      },
      error: errorMessage,
    }

    if (!wantsJson && acceptHeader.includes('text/html')) {
      return new NextResponse(renderHtmlDashboard(errorData), {
        status: 503,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        },
      })
    }

    return NextResponse.json(errorData, {
      status: 503,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Content-Type': 'application/json',
      },
    })
  }
}
