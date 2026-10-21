/**
 * Parse the pasted keyword-plan.md (project root, freeform) into structured
 * src/lib/keyword-plan/keyword-plan.json used by:
 *   - SEO plugin fallback title/description (payload.config.ts)
 *   - KeywordLinks seed script (scripts/seed-keyword-links.ts)
 *   - AI content-authoring workflow (16-keyword-plan-workflow.md)
 *
 * Run: pnpm run keywords:analyze
 *
 * Supported source shapes (mix freely in the same file):
 *   1. Markdown table   | keyword | volume | intent | target |
 *   2. Bullet/numbered list, plain: "- commercial roofing contractor"
 *   3. Bullet with inline annotations:
 *      "- commercial roofing contractor — target: /services/commercial-roofing, volume: 320, intent: transactional"
 *   4. Heading groups the keywords below it until the next heading:
 *      "## Services page (target: /services)"
 *      "- roof repair near me"
 *
 * Anything the parser can't confidently map to a target page is written
 * with needsReview: true / left in `unassigned` — review + fix the JSON
 * (or the source md + re-run) before trusting it downstream.
 */
import fs from 'fs'
import path from 'path'
import type { KeywordPlan, KeywordPlanEntry } from '../src/lib/keyword-plan/types'

const SOURCE_PATH = path.resolve(process.cwd(), 'keyword-plan.md')
const OUT_DIR = path.resolve(process.cwd(), 'src/lib/keyword-plan')
const OUT_PATH = path.join(OUT_DIR, 'keyword-plan.json')

function normalizePath(value: string): string {
  let v = value.trim()
  if (!v) return v
  v = v.replace(/^https?:\/\/[^/]+/i, '') // strip domain if a full URL was pasted
  if (!v.startsWith('/')) v = `/${v}`
  v = v.replace(/\/+$/, '') || '/'
  return v.toLowerCase()
}

function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function isTableRow(line: string): boolean {
  return /^\s*\|.*\|\s*$/.test(line)
}

function isTableSeparator(line: string): boolean {
  return /^\s*\|?[\s:|-]+\|?\s*$/.test(line) && /-/.test(line)
}

function splitTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim())
}

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
  target: 'targetPage',
  'target page': 'targetPage',
  'target url': 'targetPage',
  page: 'targetPage',
  'page (slug)': 'targetPage',
  slug: 'targetPage',
  url: 'targetPage',
  'landing page': 'targetPage',
  notes: 'notes',
  note: 'notes',
  comment: 'notes',
}

function mapTableRow(header: string[], cells: string[]): Record<string, string> {
  const row: Record<string, string> = {}
  header.forEach((h, idx) => {
    const field = HEADER_ALIASES[h.trim().toLowerCase()]
    if (field && cells[idx] !== undefined) row[field] = cells[idx].trim()
  })
  return row
}

function parseAnnotations(str: string): Record<string, string> {
  const out: Record<string, string> = {}
  if (!str) return out
  for (const part of str.split(',')) {
    const m = part.match(/^\s*([a-zA-Z ]+)\s*[:=]\s*(.+?)\s*$/)
    if (m) {
      const field = HEADER_ALIASES[m[1].trim().toLowerCase()]
      if (field) out[field] = m[2].trim()
    } else if (part.trim().startsWith('/')) {
      out.targetPage = part.trim()
    }
  }
  return out
}

function findAnnotationSplit(text: string): number {
  const emdash = text.indexOf(' — ')
  if (emdash !== -1) return emdash
  const dashdash = text.indexOf(' -- ')
  if (dashdash !== -1) return dashdash
  const paren = text.indexOf(' (')
  if (paren !== -1 && text.trim().endsWith(')')) return paren
  return -1
}

function parseListItem(
  text: string,
  headingTargetPage: string | undefined,
  headingIsGuess: boolean,
  priority: number,
): KeywordPlanEntry {
  let keyword = text.trim()
  let annoStr = ''
  const splitAt = findAnnotationSplit(text)
  if (splitAt !== -1) {
    keyword = text.slice(0, splitAt).trim()
    annoStr = text
      .slice(splitAt)
      .replace(/^\s*(—|--)\s*/, '')
      .replace(/^\s*\(/, '')
      .replace(/\)\s*$/, '')
      .trim()
  }
  const anno = parseAnnotations(annoStr)
  const targetPage = anno.targetPage ? normalizePath(anno.targetPage) : headingTargetPage
  const guessedOnly = !anno.targetPage && Boolean(headingTargetPage) && headingIsGuess

  return {
    keyword,
    priority: anno.priority ? Number(anno.priority) || priority : priority,
    volume: anno.volume ? Number(anno.volume.replace(/[^\d.]/g, '')) || undefined : undefined,
    intent: anno.intent,
    targetPage,
    notes: anno.notes,
    needsReview: !targetPage || guessedOnly,
  }
}

function buildEntryFromTable(
  row: Record<string, string>,
  priority: number,
  headingTargetPage: string | undefined,
  headingIsGuess: boolean,
): KeywordPlanEntry {
  const targetPage = row.targetPage ? normalizePath(row.targetPage) : headingTargetPage
  const guessedOnly = !row.targetPage && Boolean(headingTargetPage) && headingIsGuess
  return {
    keyword: row.keyword,
    priority: row.priority ? Number(row.priority) || priority : priority,
    volume: row.volume ? Number(row.volume.replace(/[^\d.]/g, '')) || undefined : undefined,
    intent: row.intent,
    targetPage,
    notes: row.notes,
    needsReview: !targetPage || guessedOnly,
  }
}

function main() {
  if (!fs.existsSync(SOURCE_PATH)) {
    console.error(`✗ keyword-plan.md not found at project root: ${SOURCE_PATH}`)
    console.error('  Paste the keyword plan there, then re-run: pnpm run keywords:analyze')
    process.exit(1)
  }

  const raw = fs.readFileSync(SOURCE_PATH, 'utf8')
  const lines = raw.split(/\r?\n/)

  const entries: KeywordPlanEntry[] = []
  let headingTargetPage: string | undefined
  let headingIsGuess = false
  let counter = 0

  let i = 0
  while (i < lines.length) {
    const line = lines[i]

    if (/^#{1,6}\s+/.test(line)) {
      const explicit = line.match(/(\/[a-z0-9\-/]+)/i)
      if (explicit) {
        headingTargetPage = normalizePath(explicit[1])
        headingIsGuess = false
      } else {
        const label = line.replace(/^#{1,6}\s+/, '').trim()
        headingTargetPage = label ? `/${slugify(label)}` : headingTargetPage
        headingIsGuess = true
      }
      i++
      continue
    }

    if (isTableRow(line) && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const header = splitTableRow(line)
      i += 2
      while (i < lines.length && isTableRow(lines[i])) {
        const row = mapTableRow(header, splitTableRow(lines[i]))
        if (row.keyword) {
          counter++
          entries.push(buildEntryFromTable(row, counter, headingTargetPage, headingIsGuess))
        }
        i++
      }
      continue
    }

    const listMatch = line.match(/^\s*[-*]\s+(.+)$/) || line.match(/^\s*\d+[.)]\s+(.+)$/)
    if (listMatch) {
      counter++
      entries.push(parseListItem(listMatch[1], headingTargetPage, headingIsGuess, counter))
      i++
      continue
    }

    i++
  }

  // Dedupe on keyword+targetPage, keep highest priority (lowest number)
  const seen = new Map<string, KeywordPlanEntry>()
  for (const e of entries) {
    const key = `${e.keyword.toLowerCase()}|${e.targetPage || ''}`
    const existing = seen.get(key)
    if (!existing || e.priority < existing.priority) seen.set(key, e)
  }
  const deduped = [...seen.values()].sort((a, b) => a.priority - b.priority)

  const byTargetPage: Record<string, string[]> = {}
  const unassigned: string[] = []
  for (const e of deduped) {
    if (e.targetPage) {
      byTargetPage[e.targetPage] = byTargetPage[e.targetPage] || []
      byTargetPage[e.targetPage].push(e.keyword)
    } else {
      unassigned.push(e.keyword)
    }
  }

  const plan: KeywordPlan = {
    generatedAt: new Date().toISOString(),
    sourceFile: 'keyword-plan.md',
    totalKeywords: deduped.length,
    entries: deduped,
    byTargetPage,
    unassigned,
  }

  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(OUT_PATH, JSON.stringify(plan, null, 2) + '\n')

  const needsReview = deduped.filter((e) => e.needsReview).length
  console.log(`✓ Parsed ${deduped.length} keywords → ${path.relative(process.cwd(), OUT_PATH)}`)
  console.log(`  ${Object.keys(byTargetPage).length} target pages, ${unassigned.length} unassigned, ${needsReview} flagged needsReview`)
  console.log('')
  console.log('Top 10 by priority:')
  for (const e of deduped.slice(0, 10)) {
    console.log(`  ${e.priority}. ${e.keyword}${e.targetPage ? ` → ${e.targetPage}` : ' (no target page — review)'}`)
  }
  if (needsReview > 0) {
    console.log('')
    console.log(`⚠ Review flagged entries in ${path.relative(process.cwd(), OUT_PATH)} before running keywords:seed-links.`)
  }
}

main()
