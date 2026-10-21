import { config } from 'dotenv'

config()

console.log('========================================================')
console.log('  🩺 Flexion E-Commerce Pre-Flight Health Check (Doctor) ')
console.log('========================================================')
console.log('')

let passed = true

function checkEnv(key: string, isSecret = false, required = true) {
  const value = process.env[key]
  if (!value) {
    if (required) {
      console.log(`❌ Missing Required Env: ${key}`)
      passed = false
    } else {
      console.log(`⚠️  Optional Env Unset:   ${key}`)
    }
  } else {
    const display = isSecret ? '●●●●●●●● (Set)' : value
    console.log(`✓  ${key.padEnd(28)}: ${display}`)
  }
}

console.log('--- 1. Core Secrets & Security ---')
checkEnv('PAYLOAD_SECRET', true)
checkEnv('REVALIDATE_SECRET', true)
checkEnv('SETUP_SECRET', true)

console.log('')
console.log('--- 2. Database Connectivity ---')
const isMongo = Boolean(
  process.env.MONGODB_URI || 
  process.env.DATABASE_URL?.startsWith('mongodb')
)

if (isMongo) {
  checkEnv('MONGODB_URI', false)
} else {
  checkEnv('DATABASE_URL', true)
}

console.log('')
console.log('--- 3. Payment Gateway Configuration ---')
checkEnv('STRIPE_SECRET_KEY', true, false)
checkEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', false, false)
checkEnv('STRIPE_WEBHOOK_SECRET', true, false)

console.log('')
console.log('--- 4. Transactional Email ---')
checkEnv('RESEND_API_KEY', true, false)

console.log('')
console.log('--- 5. Cloudflare R2 Media Storage ---')
import('../src/lib/storage/r2-config.js')
  .catch(() => import('../src/lib/storage/r2-config.ts' as any))
  .then(({ getR2DiagnosticInfo }) => {
    const diag = getR2DiagnosticInfo()
    if (diag.isConfigured) {
      console.log(`✓  R2 Status                   : ACTIVE (Production Cloud Storage)`)
      console.log(`✓  R2 Bucket                   : ${diag.bucket}`)
      console.log(`✓  R2 Public URL Base          : ${diag.publicUrl}`)
      console.log(`✓  R2 Endpoint                 : ${diag.endpoint}`)
      console.log(`✓  R2 Access Key               : ${diag.accessKeyPreview}`)
    } else {
      console.log(`ℹ️  R2 Status                   : LOCAL FALLBACK (Credentials contain placeholders)`)
      console.log(`   Bucket                      : ${diag.bucket}`)
      console.log(`   Note                        : Media uploads will use local filesystem (/media) until real R2 keys are provided in .env`)
    }
  })
  .finally(() => {
    console.log('')
    if (passed) {
      console.log('✨ All required environment variables and secrets are configured!')
    } else {
      console.log('❌ Doctor found missing critical configurations. Review your .env file.')
    }
    console.log('========================================================')
  })

