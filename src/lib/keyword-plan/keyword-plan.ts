/**
 * Runtime accessor for the generated keyword-plan.json (see scripts/analyze-keyword-plan.ts).
 * Never hand-edit keyword-plan.json structurally — regenerate via `pnpm run keywords:analyze`,
 * or hand-fix `targetPage`/`needsReview` values it flagged.
 *
 * Safe to import even before the file exists (fresh clone, script not run yet) — falls
 * back to an empty plan so build/dev doesn't break.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { EMPTY_KEYWORD_PLAN, type KeywordPlan, type KeywordPlanEntry } from './types'

let cached: KeywordPlan | null = null

function loadPlan(): KeywordPlan {
  if (cached) return cached
  try {
    const dirname = path.dirname(fileURLToPath(import.meta.url))
    const raw = fs.readFileSync(path.join(dirname, 'keyword-plan.json'), 'utf8')
    cached = JSON.parse(raw) as KeywordPlan
  } catch {
    cached = EMPTY_KEYWORD_PLAN
  }
  return cached
}

export function getKeywordPlan(): KeywordPlan {
  return loadPlan()
}

/** Keywords targeting an exact page path, sorted by priority (best first). */
export function getKeywordsForPage(targetPage: string): KeywordPlanEntry[] {
  const plan = loadPlan()
  const path = normalize(targetPage)
  return plan.entries
    .filter((e) => e.targetPage && normalize(e.targetPage) === path)
    .sort((a, b) => a.priority - b.priority)
}

/** Highest-priority keyword for a page, or undefined if none planned. */
export function getPrimaryKeyword(targetPage: string): string | undefined {
  return getKeywordsForPage(targetPage)[0]?.keyword
}

/** Priority rank (1 = highest) of a keyword across the whole plan, or undefined if absent. */
export function getKeywordRank(keyword: string): number | undefined {
  const plan = loadPlan()
  const needle = keyword.trim().toLowerCase()
  return plan.entries.find((e) => e.keyword.trim().toLowerCase() === needle)?.priority
}

function normalize(p: string): string {
  const v = p.trim().toLowerCase()
  return v.startsWith('/') ? v.replace(/\/+$/, '') || '/' : `/${v}`
}
