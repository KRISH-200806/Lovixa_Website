import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { exportFullDatabase, restoreFullDatabase } from '../src/lib/backup/engine'

async function main() {
  const args = process.argv.slice(2)
  const command = args[0] || 'export'
  const filePath = args[1]

  const payload = await getPayload({ config })

  if (command === 'export' || command === 'backup') {
    console.log('\n📦 Creating full database snapshot...')
    const data = await exportFullDatabase(payload)

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const outFileName = filePath || `backup-${timestamp}.json`
    const outPath = path.resolve(process.cwd(), outFileName)

    fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8')
    console.log(`\n✔ Full backup saved to: ${outFileName}`)
    console.log(`  Total records: ${data._meta.totalRecords}`)
    console.log(`  Globals: ${data._meta.globalsCount}`)
    console.log(`  Collections: ${Object.keys(data._meta.collectionsCount).join(', ')}\n`)
    process.exit(0)
  }

  if (command === 'restore' || command === 'import') {
    if (!filePath) {
      console.error('\n❌ Error: Please provide a backup file path to restore.')
      console.log('Usage: pnpm run db:restore <path-to-backup.json>\n')
      process.exit(1)
    }

    const targetPath = path.resolve(process.cwd(), filePath)
    if (!fs.existsSync(targetPath)) {
      console.error(`\n❌ Error: Backup file not found at: ${targetPath}\n`)
      process.exit(1)
    }

    console.log(`\n📥 Restoring database from: ${filePath}...`)
    const raw = fs.readFileSync(targetPath, 'utf8')
    const backupData = JSON.parse(raw)

    const summary = await restoreFullDatabase(payload, backupData)
    console.log('\n✔ Database restored successfully!')
    console.log(`  Processed: ${summary.totalRecordsProcessed} records (${summary.globalsRestored} globals)`)
    if (summary.errors.length > 0) {
      console.warn(`  Warnings: ${summary.errors.length} items had warnings during restore.`)
    }
    console.log('')
    process.exit(0)
  }

  console.log(`Unknown command: ${command}. Use 'export' or 'restore'.`)
  process.exit(1)
}

main().catch((err) => {
  console.error('\n❌ Backup script failed:', err)
  process.exit(1)
})
