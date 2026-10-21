import type { CollectionBeforeOperationHook } from 'payload'

/**
 * Compresses an upload's file buffer before Payload validates/persists it —
 * this runs inside the same request as the CMS media upload, before the
 * bytes are written to disk/S3, so it satisfies "compress before CMS
 * upload" without needing a separate client-side intercept. Runs for every
 * upload path (admin UI, REST, Local API) since it's a collection hook, not
 * a UI-only interceptor.
 *
 * Never blocks the upload: any failure (network, timeout, non-2xx, bad
 * response shape) is logged and the original file proceeds unchanged.
 * See starter-kit/23-image-compression.md.
 */

interface UploadFile {
  data: Buffer
  mimetype: string
  name: string
  size: number
}

const TIMEOUT_MS = 15_000

function guessExtension(mimetype: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/avif': 'avif',
  }
  return map[mimetype] || 'jpg'
}

function withNewExtension(name: string, extension: string): string {
  const base = name.replace(/\.[^./\\]+$/, '')
  return `${base}.${extension}`
}

async function compress(file: UploadFile): Promise<UploadFile | null> {
  const endpoint = process.env.IMAGE_COMPRESSION_API_URL
  if (!endpoint) return null // not configured — treat as disabled, not a failure

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const form = new FormData()
    form.append('image', new Blob([new Uint8Array(file.data)], { type: file.mimetype }), file.name)

    const res = await fetch(endpoint, {
      method: 'POST',
      body: form,
      signal: controller.signal,
    })

    if (!res.ok) {
      console.error(`[compressImageUpload] compression API returned ${res.status} ${res.statusText}`)
      return null
    }

    const contentType = res.headers.get('content-type') || ''

    if (contentType.startsWith('image/')) {
      const arrayBuffer = await res.arrayBuffer()
      const data = Buffer.from(arrayBuffer)
      if (data.length === 0) {
        console.error('[compressImageUpload] compression API returned an empty image body')
        return null
      }
      const mimetype = contentType.split(';')[0].trim()
      return {
        data,
        mimetype,
        name: withNewExtension(file.name, guessExtension(mimetype)),
        size: data.length,
      }
    }

    if (contentType.includes('application/json')) {
      const json = (await res.json()) as Record<string, unknown>
      // Common shapes: { image: 'data:image/...;base64,...' } or { url: 'https://...' }
      const base64Field = typeof json.image === 'string' ? json.image : typeof json.data === 'string' ? json.data : null
      if (base64Field?.startsWith('data:')) {
        const match = base64Field.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/)
        if (match) {
          const [, mimetype, base64] = match
          const data = Buffer.from(base64, 'base64')
          return { data, mimetype, name: withNewExtension(file.name, guessExtension(mimetype)), size: data.length }
        }
      }
      const url = typeof json.url === 'string' ? json.url : null
      if (url) {
        const fileRes = await fetch(url, { signal: controller.signal })
        if (!fileRes.ok) {
          console.error(`[compressImageUpload] failed fetching compressed image URL: ${fileRes.status}`)
          return null
        }
        const data = Buffer.from(await fileRes.arrayBuffer())
        const mimetype = fileRes.headers.get('content-type') || file.mimetype
        return { data, mimetype, name: withNewExtension(file.name, guessExtension(mimetype)), size: data.length }
      }
      console.error('[compressImageUpload] unrecognized JSON response shape from compression API')
      return null
    }

    console.error(`[compressImageUpload] unrecognized content-type from compression API: ${contentType || '(none)'}`)
    return null
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err)
    console.error(`[compressImageUpload] compression request failed, using original file: ${reason}`)
    return null
  } finally {
    clearTimeout(timeout)
  }
}

export const compressImageBeforeOperationHook: CollectionBeforeOperationHook = async ({
  args,
  operation,
  req,
}) => {
  if (operation !== 'create' && operation !== 'update') return args

  const file = (req as unknown as { file?: UploadFile }).file
  // Raster only — vector (SVG) has nothing to gain from a raster compressor
  // and shouldn't be re-encoded.
  if (!file || !file.mimetype?.startsWith('image/') || file.mimetype === 'image/svg+xml') return args

  const compressed = await compress(file)
  if (compressed) {
    ;(req as unknown as { file?: UploadFile }).file = compressed
  }
  // compressed === null → original `file` on req is left untouched, upload proceeds normally.

  return args
}
