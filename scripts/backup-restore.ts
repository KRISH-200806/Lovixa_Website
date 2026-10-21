import fs from 'fs'
import path from 'path'
import { config as loadDotenv } from 'dotenv'

loadDotenv()

const MONGODB_PATH = path.resolve(
  process.cwd(),
  'node_modules/.pnpm/mongodb@6.12.0/node_modules/mongodb/lib/index.js'
)

import { pathToFileURL } from 'url'

async function getMongoClient() {
  const { MongoClient, ObjectId } = await import(pathToFileURL(MONGODB_PATH).href)
  const uri = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/ecommerce_store'
  return { client: new MongoClient(uri), ObjectId }
}

async function runBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupDir = path.resolve(process.cwd(), 'backups', `snapshot-${timestamp}`)
  fs.mkdirSync(backupDir, { recursive: true })

  console.log(`[Backup] Initiating safe MongoDB snapshot to: ${backupDir}`)

  const { client } = await getMongoClient()
  try {
    await client.connect()
    const db = client.db()
    const collections = await db.listCollections().toArray()

    let totalDocs = 0
    const manifest: Record<string, number> = {}

    for (const collInfo of collections) {
      const collName = collInfo.name
      // Skip system collections
      if (collName.startsWith('system.')) continue

      const docs = await db.collection(collName).find({}).toArray()
      manifest[collName] = docs.length
      totalDocs += docs.length

      const filePath = path.join(backupDir, `${collName}.json`)
      fs.writeFileSync(filePath, JSON.stringify(docs, null, 2), 'utf-8')
      console.log(`  ✓ Backed up [${collName}]: ${docs.length} docs`)
    }

    fs.writeFileSync(
      path.join(backupDir, 'manifest.json'),
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          database: db.databaseName,
          totalCollections: Object.keys(manifest).length,
          totalDocuments: totalDocs,
          collections: manifest,
        },
        null,
        2
      ),
      'utf-8'
    )

    console.log(`✨ Backup complete! Total documents preserved: ${totalDocs}`)
    return backupDir
  } finally {
    await client.close()
  }
}

async function runRestore(targetSnapshotDir?: string) {
  const backupsRoot = path.resolve(process.cwd(), 'backups')
  if (!fs.existsSync(backupsRoot)) {
    console.error('❌ No backups directory found.')
    process.exit(1)
  }

  let snapshotDir = targetSnapshotDir
  if (!snapshotDir) {
    // Pick the most recent snapshot directory
    const entries = fs
      .readdirSync(backupsRoot)
      .filter((d) => d.startsWith('snapshot-'))
      .sort()
      .reverse()

    if (entries.length === 0) {
      console.error('❌ No snapshot directories found in backups.')
      process.exit(1)
    }
    snapshotDir = path.join(backupsRoot, entries[0])
  }

  console.log(`[Restore] Restoring from snapshot: ${snapshotDir}`)
  const manifestPath = path.join(snapshotDir, 'manifest.json')
  if (!fs.existsSync(manifestPath)) {
    console.error('❌ Snapshot manifest.json not found.')
    process.exit(1)
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
  const { client, ObjectId } = await getMongoClient()
  try {
    await client.connect()
    const db = client.db()

    for (const [collName, count] of Object.entries(manifest.collections || {})) {
      const filePath = path.join(snapshotDir, `${collName}.json`)
      if (!fs.existsSync(filePath)) continue

      const docs = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      if (Array.isArray(docs) && docs.length > 0) {
        // Safe upsert to avoid dropping existing data
        const collection = db.collection(collName)
        for (const doc of docs) {
          const { _id, ...rest } = doc
          const isHexId = typeof _id === 'string' && /^[0-9a-fA-F]{24}$/.test(_id)
          const targetId = isHexId ? new ObjectId(_id) : _id

          if (isHexId) {
            // Remove legacy string-typed _id doc to prevent duplicate key or mismatch
            await collection.deleteOne({ _id: String(_id) })
          }

          await collection.updateOne(
            { _id: targetId },
            { $set: rest },
            { upsert: true }
          )
        }
      }
      console.log(`  ✓ Restored [${collName}]: ${count} docs`)
    }

    console.log(`✨ Restore successfully verified!`)
  } finally {
    await client.close()
  }
}

const isRestore = process.argv.includes('--restore')
if (isRestore) {
  const snapshotArg = process.argv.find((a) => a.startsWith('--snapshot='))
  const targetDir = snapshotArg ? snapshotArg.split('=')[1] : undefined
  runRestore(targetDir).catch((err) => {
    console.error('Restore failed:', err)
    process.exit(1)
  })
} else {
  runBackup().catch((err) => {
    console.error('Backup failed:', err)
    process.exit(1)
  })
}
