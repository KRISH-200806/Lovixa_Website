/**
 * Upsert keyword-plan.json entries into the keyword-links collection.
 * Run after `pnpm run keywords:analyze` and reviewing flagged entries:
 *
 *   pnpm run keywords:seed-links
 *
 * Safe to re-run — matches existing rows by (keyword + targetURL) and updates
 * priority in place instead of duplicating. Rows added manually in admin
 * (fromKeywordPlan: false) are left untouched.
 */
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import type { KeywordPlan } from '../src/lib/keyword-plan/types'

async function main() {
  const planPath = path.resolve(process.cwd(), 'src/lib/keyword-plan/keyword-plan.json')
  if (!fs.existsSync(planPath)) {
    console.error(`✗ ${planPath} not found. Run: pnpm run keywords:analyze`)
    process.exit(1)
  }
  const plan = JSON.parse(fs.readFileSync(planPath, 'utf8')) as KeywordPlan

  const payload = await getPayload({ config: await Promise.resolve(config) })

  const usable = plan.entries.filter((e) => e.targetPage && !e.needsReview)
  const skipped = plan.entries.length - usable.length

  let created = 0
  let updated = 0

  for (const entry of usable) {
    const existing = await payload.find({
      collection: 'keyword-links',
      where: {
        and: [{ keyword: { equals: entry.keyword } }, { targetURL: { equals: entry.targetPage } }],
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'keyword-links',
        id: existing.docs[0].id,
        data: { priority: entry.priority, fromKeywordPlan: true },
      })
      updated++
    } else {
      await payload.create({
        collection: 'keyword-links',
        data: {
          keyword: entry.keyword,
          targetURL: entry.targetPage as string,
          priority: entry.priority,
          matchType: 'partial',
          active: true,
          fromKeywordPlan: true,
        },
      })
      created++
    }
  }

  console.log(`✓ keyword-links seeded: ${created} created, ${updated} updated, ${skipped} skipped (no target page / needsReview)`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
