import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { config as loadDotenv } from 'dotenv'
import fs from 'fs'
import path from 'path'
import { Readable } from 'stream'

loadDotenv()

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: any[] = []
  for await (const chunk of stream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

async function downloadOriginals() {
  const client = new S3Client({
    region: process.env.R2_REGION || 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
    forcePathStyle: true,
  })

  const bucket = process.env.R2_BUCKET || 'lovixa'
  const filesToFetch = [
    { key: '1128b135-77ca-484d-9595-24b9fa8daed9.png', dest: 'public/images/lovixa-duo.png' },
    { key: '13d51311-de22-4bfe-97f7-c72924aa0cb4.png', dest: 'public/images/lovixa-shampoo.png' },
    { key: '45692b26-5652-4f68-9d3c-ffd9884bc9b9.png', dest: 'public/images/lovixa-hairoil.png' },
  ]

  for (const item of filesToFetch) {
    console.log(`Downloading ${item.key} -> ${item.dest}...`)
    const res = await client.send(new GetObjectCommand({ Bucket: bucket, Key: item.key }))
    const buf = await streamToBuffer(res.Body as Readable)
    fs.writeFileSync(path.resolve(process.cwd(), item.dest), buf)
    console.log(`Saved ${item.dest} (${buf.length} bytes)`)
  }
}

downloadOriginals().catch(e => {
  console.error(e)
  process.exit(1)
})
