import { NextRequest, NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getR2Config } from '@/lib/storage/r2-config'
import fs from 'fs'
import path from 'path'

// Cache S3 client instance for performance
let cachedClient: S3Client | null = null

function getClient() {
  if (cachedClient) return cachedClient
  const r2 = getR2Config()
  if (!r2.isConfigured) return null

  cachedClient = new S3Client({
    region: r2.region,
    endpoint: r2.endpoint,
    credentials: {
      accessKeyId: r2.accessKeyId,
      secretAccessKey: r2.secretAccessKey,
    },
    forcePathStyle: true,
  })
  return cachedClient
}

const MIME_MAP: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  avif: 'image/avif',
  svg: 'image/svg+xml',
  gif: 'image/gif',
  pdf: 'application/pdf',
}

function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  return MIME_MAP[ext] || 'application/octet-stream'
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await context.params
  if (!pathSegments || pathSegments.length === 0) {
    return new NextResponse('Media file not found', { status: 404 })
  }

  const rawKey = pathSegments.join('/')
  const key = decodeURIComponent(rawKey)
  const client = getClient()
  const r2 = getR2Config()

  // 1. Try fetching from Cloudflare R2
  if (client && r2.isConfigured) {
    try {
      const command = new GetObjectCommand({
        Bucket: r2.bucket,
        Key: key,
      })
      const s3Response = await client.send(command)

      if (s3Response.Body) {
        // Convert S3 Body stream to Web ReadableStream
        const stream = s3Response.Body.transformToWebStream()
        const contentType = s3Response.ContentType || getMimeType(key)
        const contentLength = s3Response.ContentLength
          ? String(s3Response.ContentLength)
          : undefined

        const headers = new Headers({
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        })
        if (contentLength) {
          headers.set('Content-Length', contentLength)
        }
        if (s3Response.ETag) {
          headers.set('ETag', s3Response.ETag)
        }

        return new Response(stream, {
          status: 200,
          headers,
        })
      }
    } catch (r2Err: any) {
      // If object not found in R2 or error, fall through to local storage check
      if (r2Err.name !== 'NoSuchKey' && r2Err.$metadata?.httpStatusCode !== 404) {
        console.warn(`[media route] R2 fetch error for key "${key}":`, r2Err.message)
      }
    }
  }

  // 2. Fallback: check local media directory
  try {
    const localPath = path.resolve(process.cwd(), 'media', key)
    // Prevent directory traversal
    if (localPath.startsWith(path.resolve(process.cwd(), 'media')) && fs.existsSync(localPath)) {
      const stats = fs.statSync(localPath)
      if (stats.isFile()) {
        const fileBuffer = fs.readFileSync(localPath)
        return new Response(fileBuffer, {
          status: 200,
          headers: {
            'Content-Type': getMimeType(key),
            'Content-Length': String(stats.size),
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        })
      }
    }
  } catch (localErr) {
    // Ignore local check error
  }

  return new NextResponse('Media file not found', { status: 404 })
}
