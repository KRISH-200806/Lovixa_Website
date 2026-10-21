/**
 * Convert a downloaded keyword-plan spreadsheet (.xlsx, multi-tab) into the
 * plain keyword-plan.md this starter's parser expects. Google Sheets isn't
 * reachable directly (no OAuth wired into setup) — export it first:
 *   Google Sheets → File → Download → Microsoft Excel (.xlsx)
 *   Save as keyword-plan.xlsx at project root.
 *
 * Each tab becomes a "## <tab name> (target: /path)" section if the tab
 * name looks like a path (e.g. "services" or "/services"), otherwise the
 * raw tab name is used as the heading and flagged needsReview downstream —
 * same heuristic as a pasted markdown heading.
 *
 * Header row per tab is matched against the same aliases as
 * analyze-keyword-plan.ts (keyword, volume, intent, target, priority, notes).
 * Any tab with no recognizable header row is skipped with a warning.
 *
 * Run: pnpm run keywords:import-xlsx
 * Then, as usual: pnpm run keywords:analyze
 */
import fs from 'fs'
import path from 'path'
import XLSX from 'xlsx'

const SOURCE_PATH = path.resolve(process.cwd(), 'keyword-plan.xlsx')
const OUT_PATH = path.resolve(process.cwd(), 'keyword-plan.md')

const HEADER_ALIASES: Record<string, string> = {
  keyword: 'keyword',
  keywords: 'keyword',
  kw: 'keyword',
  term: 'keyword',
  query: 'keyword',
  volume: 'volume',
  'search volume': 'volume',
  vol: 'volume',
  sv: 'volume',
  intent: 'intent',
  'search intent': 'intent',
  priority: 'priority',
  rank: 'priority',
  tier: 'priority',
  target: 'target',
  'target page': 'target',
  'target url': 'target',
  page: 'target',
  'page (slug)': 'target',
  slug: 'target',
  url: 'target',
  'landing page': 'target',
  notes: 'notes',
  note: 'notes',
  comment: 'notes',
}

function slugifyTabName(name: string): string {
  const trimmed = name.trim()
  if (trimmed.startsWith('/')) return trimmed
  return `/${trimmed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')}`
}

function main() {
  if (!fs.existsSync(SOURCE_PATH)) {
    console.error(`✗ keyword-plan.xlsx not found at project root: ${SOURCE_PATH}`)
    console.error('  Export the Google Sheet: File → Download → Microsoft Excel (.xlsx)')
    console.error('  Save it as keyword-plan.xlsx at project root, then re-run.')
    process.exit(1)
  }

  const workbook = XLSX.readFile(SOURCE_PATH)
  const sections: string[] = []
  let skipped = 0

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName]
    const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false })
    if (rows.length < 2) {
      console.warn(`⚠ Skipping tab "${sheetName}" — no data rows`)
      skipped++
      continue
    }

    const headerRow = (rows[0] as unknown[]).map((c) => String(c ?? '').trim().toLowerCase())
    const fields = headerRow.map((h) => HEADER_ALIASES[h])
    if (!fields.includes('keyword')) {
      console.warn(`⚠ Skipping tab "${sheetName}" — no recognizable "keyword" column`)
      skipped++
      continue
    }

    const target = slugifyTabName(sheetName)
    const lines: string[] = [`## ${sheetName} (target: ${target})`, '']
    lines.push(`| ${headerRow.join(' | ')} |`)
    lines.push(`| ${headerRow.map(() => '---').join(' | ')} |`)
    for (const row of rows.slice(1)) {
      const cells = headerRow.map((_, idx) => String((row as unknown[])[idx] ?? '').trim())
      if (!cells.some(Boolean)) continue
      lines.push(`| ${cells.join(' | ')} |`)
    }
    sections.push(lines.join('\n'))
  }

  if (sections.length === 0) {
    console.error('✗ No usable tabs found — nothing written.')
    process.exit(1)
  }

  fs.writeFileSync(OUT_PATH, sections.join('\n\n') + '\n')
  console.log(`✓ Wrote ${sections.length} tab(s) → ${path.relative(process.cwd(), OUT_PATH)} (${skipped} tab(s) skipped)`)
  console.log('  Next: pnpm run keywords:analyze')
}

main()
