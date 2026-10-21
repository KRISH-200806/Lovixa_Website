/**
 * Backfill section-source-map rows for all mapped sources.
 * Extend SOURCE_TABLES as you add new section-based globals/collections.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const SOURCE_TABLES = ['home'] as const

async function main() {
  const payload = await getPayload({ config: await Promise.resolve(config) })

  for (const sourceTable of SOURCE_TABLES) {
    console.log(`Backfill not implemented for ${sourceTable} — wire per-source logic when adding content.`)
  }

  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
