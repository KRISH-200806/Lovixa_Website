import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { config as loadDotenv } from 'dotenv'

loadDotenv()

async function listR2() {
  const client = new S3Client({
    region: process.env.R2_REGION || 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
    forcePathStyle: true,
  })

  const res = await client.send(
    new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET || 'lovixa',
    })
  )

  console.log(`Found ${res.KeyCount} objects in R2 bucket "${process.env.R2_BUCKET}":`)
  if (res.Contents) {
    for (const obj of res.Contents) {
      console.log(`- ${obj.Key} (${obj.Size} bytes)`)
    }
  }
}

listR2().catch(e => {
  console.error(e)
  process.exit(1)
})
