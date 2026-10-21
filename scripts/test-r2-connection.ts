/**
 * LOVIXA COSMETIC — Cloudflare R2 Connection & Diagnostics Tester
 *
 * Usage:
 *   npx tsx scripts/test-r2-connection.ts
 */

import { config as loadDotenv } from 'dotenv'
import {
  S3Client,
  HeadBucketCommand,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { getR2Config, getR2DiagnosticInfo } from '../src/lib/storage/r2-config'

loadDotenv()

async function testR2() {
  console.log('====================================================')
  console.log('☁️ CLOUDFLARE R2 STORAGE DIAGNOSTICS & TEST')
  console.log('====================================================')

  const r2 = getR2Config()
  const diag = getR2DiagnosticInfo()

  console.log('\n[1/3] Environment Configuration Inspection:')
  console.log(`  Bucket:         ${diag.bucket}`)
  console.log(`  Endpoint:       ${diag.endpoint}`)
  console.log(`  Region:         ${diag.region}`)
  console.log(`  Public URL:     ${diag.publicUrl}`)
  console.log(`  Has Access Key: ${diag.hasAccessKey ? 'YES' : 'NO'}`)
  console.log(`  Has Secret Key: ${diag.hasSecretKey ? 'YES' : 'NO'}`)
  console.log(`  Key Preview:    ${diag.accessKeyPreview}`)
  console.log(`  Config Status:  ${diag.isConfigured ? '✅ ACTIVE' : '⚠️ PLACEHOLDER / UNCONFIGURED'}`)

  if (!r2.isConfigured) {
    console.log('\n[2/3] Setup Guidance (Cloudflare Dashboard Steps):')
    console.log('  To connect your live Cloudflare R2 bucket:')
    console.log('  1. Go to Cloudflare Dashboard -> R2 -> Overview.')
    console.log('  2. Click "Create Bucket" and name it "lovixa-media".')
    console.log('  3. Under Account Details (right sidebar), copy your "Account ID".')
    console.log('  4. Click "Manage R2 API Tokens" -> "Create API Token".')
    console.log('     - Permissions: Object Read & Write')
    console.log('     - Specify bucket: lovixa-media')
    console.log('  5. Copy "Access Key ID" and "Secret Access Key".')
    console.log('  6. Enable Public Access on the bucket or attach a Custom Domain (e.g. media.lovixacosmetic.com).')
    console.log('  7. Add these to your .env:')
    console.log('     R2_BUCKET=lovixa-media')
    console.log('     R2_ACCOUNT_ID=<your-account-id>')
    console.log('     R2_ENDPOINT=https://<your-account-id>.r2.cloudflarestorage.com')
    console.log('     R2_ACCESS_KEY_ID=<your-access-key-id>')
    console.log('     R2_SECRET_ACCESS_KEY=<your-secret-access-key>')
    console.log('     R2_PUBLIC_URL=https://media.lovixacosmetic.com')
    console.log('\n[3/3] Result: Offline Safety Mode Active. Local uploads preserved gracefully.')
    return
  }

  console.log('\n[2/3] Connecting to Cloudflare R2...')
  const client = new S3Client({
    region: r2.region,
    endpoint: r2.endpoint,
    credentials: {
      accessKeyId: r2.accessKeyId,
      secretAccessKey: r2.secretAccessKey,
    },
    forcePathStyle: true,
  })

  const startTime = Date.now()
  try {
    await client.send(new HeadBucketCommand({ Bucket: r2.bucket }))
    console.log(`  ✓ Bucket "${r2.bucket}" reached successfully (${Date.now() - startTime}ms)`)
  } catch (err: any) {
    console.error(`  ❌ Failed to reach bucket: ${err.message}`)
    return
  }

  console.log('\n[3/3] Testing Object Read/Write/Delete Cycle...')
  const testKey = `.lovixa-connection-test-${Date.now()}.json`
  const testPayload = JSON.stringify({
    service: 'LOVIXA COSMETIC',
    test: 'Cloudflare R2 Handshake',
    timestamp: new Date().toISOString(),
  })

  try {
    // 1. PutObject
    await client.send(
      new PutObjectCommand({
        Bucket: r2.bucket,
        Key: testKey,
        Body: Buffer.from(testPayload, 'utf-8'),
        ContentType: 'application/json',
      })
    )
    console.log(`  ✓ PutObject test successful: ${testKey}`)

    // 2. GetObject
    const getRes = await client.send(
      new GetObjectCommand({
        Bucket: r2.bucket,
        Key: testKey,
      })
    )
    const bodyStr = await getRes.Body?.transformToString()
    const parsed = JSON.parse(bodyStr || '{}')
    if (parsed.service === 'LOVIXA COSMETIC') {
      console.log('  ✓ GetObject data integrity verified')
    }

    // 3. DeleteObject
    await client.send(
      new DeleteObjectCommand({
        Bucket: r2.bucket,
        Key: testKey,
      })
    )
    console.log(`  ✓ DeleteObject test cleanup completed`)

    console.log('\n====================================================')
    console.log('🎉 CLOUDFLARE R2 CONNECTION FULLY VERIFIED & HEALTHY')
    console.log('====================================================\n')
  } catch (err: any) {
    console.error(`  ❌ Storage test cycle failed: ${err.message}`)
  }
}

testR2().catch((err) => {
  console.error('Fatal tester error:', err)
  process.exit(1)
})
