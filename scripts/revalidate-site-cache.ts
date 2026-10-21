import 'dotenv/config'

const siteUrl = process.env.REVALIDATE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
const secret = process.env.REVALIDATE_SECRET

if (!secret) {
  console.error('REVALIDATE_SECRET is required')
  process.exit(1)
}

const url = `${siteUrl.replace(/\/+$/, '')}/api/revalidate?secret=${encodeURIComponent(secret)}&all=1`

const response = await fetch(url)
const body = await response.text()
console.log(response.status, body)
