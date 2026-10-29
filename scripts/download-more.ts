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

async function downloadMore() {
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
    { key: '2.png', dest: 'public/images/real-how-to-use-oil.png' },
    { key: '3.png', dest: 'public/images/real-oil-detail.png' },
    { key: '48f8d918-cfef-4d9d-9226-4e4ec2d01727.png', dest: 'public/images/real-how-to-use-shampoo.png' },
    { key: 'dc3305a3-e454-4332-821f-ae9b0cfbb433.png', dest: 'public/images/real-shampoo-detail.png' },
    { key: 'f026dca5-de48-43a4-9e05-71f932ebec9e.png', dest: 'public/images/real-banner-1.png' },
    { key: '7c3e204e-beb8-4821-9918-f890585c3675.png', dest: 'public/images/real-banner-2.png' },
  ]

  for (const item of filesToFetch) {
    try {
      const res = await client.send(new GetObjectCommand({ Bucket: bucket, Key: item.key }))
      const buf = await streamToBuffer(res.Body as Readable)
      fs.writeFileSync(path.resolve(process.cwd(), item.dest), buf)
      console.log(`Saved ${item.dest} (${buf.length} bytes)`)
    } catch (e: any) {
      console.error(`Failed ${item.key}:`, e.message)
    }
  }
}

downloadMore()
