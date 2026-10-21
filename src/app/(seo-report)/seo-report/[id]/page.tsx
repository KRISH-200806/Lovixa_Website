import { headers as getHeaders } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { getPayloadCached } from '@/lib/cms/get-payload-cached'
import { SeoManualCheckSelect } from '@/admin/components/SeoManualCheckSelect'

/**
 * Standalone server-rendered SEO Report view — deliberately outside Payload's
 * admin panel (no custom-component import map involved). The "Generate
 * Report" button redirects here directly. Export buttons point at the
 * existing /api/seo-reports/[id]/export route.
 */
interface CheckRow {
  id: string
  category: string
  label: string
  mode: 'auto' | 'manual'
  status: 'pass' | 'fail' | 'warn' | 'na'
  message: string
}

interface CategoryScore {
  category: string
  score: number
  passCount: number
  failCount: number
  warnCount: number
  naCount: number
}

const STATUS_META: Record<string, { label: string; bg: string; fg: string }> = {
  pass: { label: 'Pass', bg: '#e6f6ea', fg: '#1a7f37' },
  fail: { label: 'Fail', bg: '#fdedee', fg: '#cf222e' },
  warn: { label: 'Warn', bg: '#fdf3d8', fg: '#9a6700' },
  na: { label: 'N/A', bg: '#eef0f2', fg: '#57606a' },
}

const CATEGORY_LABEL: Record<string, string> = {
  meta: 'Meta',
  headings: 'Headings',
  keywords: 'Keywords',
  images: 'Images',
  schema: 'Schema & Structured Data',
  content: 'Content Quality',
  aeo: 'AEO — Answer Engine Optimization',
  geo: 'GEO — Generative Engine Optimization',
  compliance: 'Compliance',
}

function scoreTier(score: number): { color: string; label: string } {
  if (score >= 80) return { color: '#1a7f37', label: 'Strong' }
  if (score >= 50) return { color: '#9a6700', label: 'Needs work' }
  return { color: '#cf222e', label: 'At risk' }
}

function ScoreGauge({ score }: { score: number }) {
  const tier = scoreTier(score)
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - score / 100)

  return (
    <div className="gauge">
      <svg width="132" height="132" viewBox="0 0 132 132">
        <circle cx="66" cy="66" r={radius} fill="none" stroke="#e8eaed" strokeWidth="12" />
        <circle
          cx="66"
          cy="66"
          r={radius}
          fill="none"
          stroke={tier.color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 66 66)"
        />
      </svg>
      <div className="gauge-label">
        <span className="gauge-score">{score}</span>
        <span className="gauge-max">/100</span>
      </div>
    </div>
  )
}

export default async function SeoReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayloadCached()
  const reqHeaders = await getHeaders()
  const { user } = await payload.auth({ headers: reqHeaders })

  if (!user) {
    redirect(`/admin/login?redirect=/seo-report/${id}`)
  }

  let report: {
    id: string
    label: string
    targetSlug: string
    score: number
    categoryScores: CategoryScore[]
    complianceGated: boolean
    checks: CheckRow[]
    manualChecks: Record<string, string>
    gscConnected: boolean
    gscSnapshot: {
      clicks: number
      impressions: number
      ctr: number
      avgPosition: number
      coreWebVitals: { lcpMs: number | null; inpMs: number | null; cls: number | null }
      crawlErrors: number
    } | null
    createdAt: string
  }

  try {
    report = (await payload.findByID({
      collection: 'seo-reports',
      id,
      overrideAccess: true,
    })) as unknown as typeof report
  } catch {
    notFound()
  }

  const rows = Array.isArray(report.checks) ? report.checks : []
  const byCategory = rows.reduce<Record<string, CheckRow[]>>((acc, row) => {
    acc[row.category] = acc[row.category] || []
    acc[row.category].push(row)
    return acc
  }, {})
  const categoryOrder = (report.categoryScores || []).map((c) => c.category)
  const tier = scoreTier(report.score)
  const generatedDate = new Date(report.createdAt)

  return (
    <div className="wrap">
      {/* eslint-disable-next-line react/no-danger -- static CSS string, no user input */}
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="page">
        <a className="back" href="/admin/collections/seo-reports">
          ← Back to SEO Reports
        </a>

        <header className="hero">
          <div className="hero-main">
            <p className="eyebrow">SEO / AEO / GEO Audit</p>
            <h1>{report.label.split(' — ')[0]}</h1>
            <p className="meta-line">
              Target: <code>{report.targetSlug}</code> · Generated{' '}
              {generatedDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })} at{' '}
              {generatedDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
            </p>
            {report.complianceGated ? (
              <p className="gated-banner">⚠ Score capped by a compliance failure — see Compliance section.</p>
            ) : null}

            <div className="export-row">
              <a className="btn btn-primary" href={`/api/seo-reports/${report.id}/export?format=pdf`}>
                <DownloadIcon /> Export PDF
              </a>
              <a className="btn btn-secondary" href={`/api/seo-reports/${report.id}/export?format=docx`}>
                <DownloadIcon /> Export DOCX
              </a>
              <a className="btn btn-secondary" href={`/api/seo-reports/${report.id}/export?format=md`}>
                <DownloadIcon /> Export Markdown
              </a>
            </div>
          </div>

          <div className="hero-score">
            <ScoreGauge score={report.score} />
            <span className="tier-pill" style={{ background: tier.color }}>
              {tier.label}
            </span>
          </div>
        </header>

        <section className="category-grid">
          {(report.categoryScores || []).map((cs) => (
            <div key={cs.category} className="category-card">
              <div className="category-card-top">
                <span className="category-name">{CATEGORY_LABEL[cs.category] ?? cs.category}</span>
                <span className="category-score" style={{ color: scoreTier(cs.score).color }}>
                  {cs.score}
                </span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${cs.score}%`, background: scoreTier(cs.score).color }}
                />
              </div>
              <div className="category-counts">
                {cs.passCount > 0 && <span className="count-pass">{cs.passCount} pass</span>}
                {cs.failCount > 0 && <span className="count-fail">{cs.failCount} fail</span>}
                {cs.warnCount > 0 && <span className="count-warn">{cs.warnCount} warn</span>}
              </div>
            </div>
          ))}
        </section>

        <section className="checklist">
          {categoryOrder.map((category) => {
            const catRows = byCategory[category] || []
            return (
              <div key={category} className="check-section">
                <h2>{CATEGORY_LABEL[category] ?? category}</h2>
                <div className="check-table">
                  {catRows.map((row) => {
                    const status = report.manualChecks?.[row.id] ?? row.status
                    const meta = STATUS_META[status] ?? STATUS_META.na
                    return (
                      <div key={row.id} className="check-row">
                        <div className="check-status">
                          {row.mode === 'manual' ? (
                            <SeoManualCheckSelect reportId={report.id} checkId={row.id} initialStatus={status} />
                          ) : (
                            <span className="pill" style={{ background: meta.bg, color: meta.fg }}>
                              {meta.label}
                            </span>
                          )}
                        </div>
                        <div className="check-label">
                          {row.label}
                          {row.mode === 'manual' ? <span className="manual-tag">manual</span> : null}
                        </div>
                        <div className="check-message">{row.message}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </section>

        <section className="gsc-card">
          <h2>Search Console</h2>
          {report.gscConnected && report.gscSnapshot ? (
            <div className="gsc-grid">
              <div className="gsc-stat">
                <span className="gsc-value">{report.gscSnapshot.clicks}</span>
                <span className="gsc-key">Clicks</span>
              </div>
              <div className="gsc-stat">
                <span className="gsc-value">{report.gscSnapshot.impressions}</span>
                <span className="gsc-key">Impressions</span>
              </div>
              <div className="gsc-stat">
                <span className="gsc-value">{(report.gscSnapshot.ctr * 100).toFixed(1)}%</span>
                <span className="gsc-key">CTR</span>
              </div>
              <div className="gsc-stat">
                <span className="gsc-value">{report.gscSnapshot.avgPosition.toFixed(1)}</span>
                <span className="gsc-key">Avg. position</span>
              </div>
              <div className="gsc-stat">
                <span className="gsc-value">{report.gscSnapshot.coreWebVitals.lcpMs ?? '—'}ms</span>
                <span className="gsc-key">LCP</span>
              </div>
              <div className="gsc-stat">
                <span className="gsc-value">{report.gscSnapshot.coreWebVitals.inpMs ?? '—'}ms</span>
                <span className="gsc-key">INP</span>
              </div>
              <div className="gsc-stat">
                <span className="gsc-value">{report.gscSnapshot.coreWebVitals.cls ?? '—'}</span>
                <span className="gsc-key">CLS</span>
              </div>
              <div className="gsc-stat">
                <span className="gsc-value">{report.gscSnapshot.crawlErrors}</span>
                <span className="gsc-key">Crawl errors</span>
              </div>
            </div>
          ) : (
            <div className="gsc-empty">
              <p>Google Search Console isn&rsquo;t connected for this project.</p>
              <p className="gsc-empty-sub">
                Connect it in SEO Reports settings to include live Core Web Vitals and search performance data in
                future reports.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1.5v8.5m0 0L4.5 6.5M8 10l3.5-3.5M2.5 12.5h11v2h-11z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const CSS = `
  .wrap { background: #f5f6f8; min-height: 100vh; padding: 48px 24px 80px; }
  .page { max-width: 1040px; margin: 0 auto; }
  .back { font-size: 13px; color: #56606c; text-decoration: none; }
  .back:hover { text-decoration: underline; }

  .hero {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 32px;
    background: #ffffff;
    border: 1px solid #e6e8eb;
    border-radius: 16px;
    padding: 32px 36px;
    margin: 20px 0 28px;
    box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.06);
  }
  .eyebrow { margin: 0 0 6px; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #7a5af5; }
  .hero h1 { margin: 0 0 8px; font-size: 30px; font-weight: 700; letter-spacing: -0.02em; color: #101828; }
  .meta-line { margin: 0 0 4px; font-size: 13.5px; color: #667085; }
  .meta-line code { background: #f2f3f5; padding: 1px 6px; border-radius: 4px; font-size: 12.5px; }
  .gated-banner { margin: 10px 0 0; font-size: 13px; color: #9a6700; background: #fdf3d8; border-radius: 8px; padding: 8px 12px; display: inline-block; }

  .export-row { display: flex; gap: 10px; margin-top: 20px; flex-wrap: wrap; }
  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 13.5px; font-weight: 600; text-decoration: none;
    padding: 9px 16px; border-radius: 8px; transition: transform .04s ease, box-shadow .15s ease;
  }
  .btn-primary { background: #101828; color: #fff; box-shadow: 0 1px 2px rgba(16,24,40,.08); }
  .btn-primary:hover { background: #1d2939; }
  .btn-secondary { background: #fff; color: #101828; border: 1px solid #d0d5dd; }
  .btn-secondary:hover { background: #f9fafb; }

  .hero-score { display: flex; flex-direction: column; align-items: center; gap: 10px; flex-shrink: 0; }
  .gauge { position: relative; width: 132px; height: 132px; }
  .gauge-label { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .gauge-score { font-size: 30px; font-weight: 800; color: #101828; letter-spacing: -0.02em; }
  .gauge-max { font-size: 12px; color: #98a2b3; margin-top: -2px; }
  .tier-pill { font-size: 11.5px; font-weight: 700; color: #fff; padding: 3px 12px; border-radius: 999px; text-transform: uppercase; letter-spacing: .04em; }

  .category-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 12px; margin-bottom: 32px;
  }
  .category-card { background: #fff; border: 1px solid #e6e8eb; border-radius: 12px; padding: 16px 18px; }
  .category-card-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
  .category-name { font-size: 12.5px; font-weight: 600; color: #344054; }
  .category-score { font-size: 18px; font-weight: 800; }
  .bar-track { height: 6px; border-radius: 999px; background: #eef0f2; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 999px; }
  .category-counts { display: flex; gap: 8px; margin-top: 8px; font-size: 11px; font-weight: 600; }
  .count-pass { color: #1a7f37; } .count-fail { color: #cf222e; } .count-warn { color: #9a6700; }

  .checklist { display: flex; flex-direction: column; gap: 22px; margin-bottom: 32px; }
  .check-section { background: #fff; border: 1px solid #e6e8eb; border-radius: 14px; overflow: hidden; }
  .check-section h2 {
    margin: 0; font-size: 14px; font-weight: 700; color: #101828;
    padding: 14px 20px; border-bottom: 1px solid #eef0f2; background: #fafbfc;
  }
  .check-table { display: flex; flex-direction: column; }
  .check-row {
    display: grid; grid-template-columns: 110px 260px 1fr;
    gap: 16px; padding: 12px 20px; align-items: center;
    border-bottom: 1px solid #f2f3f5; font-size: 13.5px;
  }
  .check-row:last-child { border-bottom: none; }
  .pill { display: inline-block; font-size: 11.5px; font-weight: 700; padding: 3px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: .03em; }
  .check-label { font-weight: 600; color: #1d2939; }
  .manual-tag { display: inline-block; margin-left: 6px; font-size: 10.5px; font-weight: 600; color: #7a5af5; background: #f2effe; padding: 1px 6px; border-radius: 4px; text-transform: uppercase; }
  .check-message { color: #667085; }
  .check-status select { font-size: 12px; padding: 4px 8px; border-radius: 6px; border: 1px solid #d0d5dd; }

  .gsc-card { background: #fff; border: 1px solid #e6e8eb; border-radius: 14px; padding: 20px 24px; }
  .gsc-card h2 { margin: 0 0 14px; font-size: 14px; font-weight: 700; color: #101828; }
  .gsc-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 16px; }
  .gsc-stat { display: flex; flex-direction: column; }
  .gsc-value { font-size: 20px; font-weight: 800; color: #101828; }
  .gsc-key { font-size: 11.5px; color: #98a2b3; margin-top: 2px; }
  .gsc-empty p { margin: 0 0 4px; font-size: 13.5px; color: #344054; }
  .gsc-empty-sub { color: #98a2b3 !important; font-size: 12.5px !important; }

  @media (max-width: 640px) {
    .hero { flex-direction: column; }
    .check-row { grid-template-columns: 1fr; gap: 4px; }
  }
`
