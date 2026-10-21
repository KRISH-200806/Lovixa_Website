import { getR2Config, buildR2PublicUrl } from '@/lib/storage/r2-config'

export const getMediaUrl = (
  media:
    | string
    | number
    | {
        url?: string | null
        filename?: string | null
        prefix?: string | null
        sizes?: Record<string, { url?: string | null; filename?: string | null }>
      }
    | null
    | undefined,
  preferredSize?: 'thumbnail' | 'card' | 'hero',
): string => {
  if (!media) return ''

  if (typeof media === 'number') return ''

  if (typeof media === 'string') {
    const trimmed = media.trim()
    if (!trimmed) return ''
    if (trimmed.startsWith('http') || trimmed.startsWith('/')) return trimmed
    const r2 = getR2Config()
    if (r2.isConfigured) {
      return buildR2PublicUrl({ filename: trimmed })
    }
    return `/media/${trimmed}`
  }

  if (typeof media === 'object') {
    // If a specific size is preferred and available
    if (preferredSize && media.sizes && media.sizes[preferredSize]) {
      const sizeObj = media.sizes[preferredSize]
      if (typeof sizeObj?.url === 'string' && sizeObj.url.trim()) {
        const sizeUrl = sizeObj.url.trim()
        if (sizeUrl.startsWith('http') || sizeUrl.startsWith('/')) return sizeUrl
        return `/${sizeUrl}`
      }
      if (typeof sizeObj?.filename === 'string' && sizeObj.filename.trim()) {
        const r2 = getR2Config()
        if (r2.isConfigured) {
          return buildR2PublicUrl({ filename: sizeObj.filename.trim(), prefix: media.prefix || '' })
        }
        return `/media/${sizeObj.filename.trim()}`
      }
    }

    // Direct url field on media document
    if (typeof media.url === 'string' && media.url.trim()) {
      const url = media.url.trim()
      if (url.startsWith('http') || url.startsWith('/')) return url
      return `/${url}`
    }

    // Fallback to filename with R2 or local static resolution
    if (typeof media.filename === 'string' && media.filename.trim()) {
      const r2 = getR2Config()
      if (r2.isConfigured) {
        return buildR2PublicUrl({ filename: media.filename.trim(), prefix: media.prefix || '' })
      }
      return `/media/${media.filename.trim()}`
    }
  }

  return ''
}

