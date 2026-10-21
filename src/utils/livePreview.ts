import type { GeneratePreviewURL } from 'payload'

export const LIVE_PREVIEW_BREAKPOINTS = [
  { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
  { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
  { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
]

/**
 * Generates dynamic preview URL for Payload Live Preview.
 * Checks PreviewSettings global (or NEXT_PUBLIC_ENABLE_LIVE_PREVIEW env)
 * to respect the admin toggle (disabled by default).
 */
export const createLivePreviewUrl = (
  getPath: (data: Record<string, unknown>) => string,
): any => {
  return async ({ data, req }: { data?: any; req?: any } = {}) => {
    try {
      if (process.env.NEXT_PUBLIC_ENABLE_LIVE_PREVIEW === 'false') {
        return null
      }

      let isEnabled = process.env.NEXT_PUBLIC_ENABLE_LIVE_PREVIEW === 'true'
      let baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001'

      const payload = (req as any)?.payload
      if (payload) {
        try {
          const settings = await payload.findGlobal({
            slug: 'preview-settings' as never,
            depth: 0,
          })
          if (settings) {
            isEnabled = Boolean(settings.enabled)
            if (typeof settings.previewUrl === 'string' && settings.previewUrl.trim()) {
              baseUrl = settings.previewUrl.trim().replace(/\/+$/, '')
            }
          }
        } catch {
          // If global not yet seeded/migrated, fall back to isEnabled
        }
      }

      if (!isEnabled) {
        return null
      }

      const relativePath = getPath((data || {}) as Record<string, unknown>)
      const cleanPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`
      const separator = cleanPath.includes('?') ? '&' : '?'
      return `${baseUrl}${cleanPath}${separator}preview=true`
    } catch {
      return null
    }
  }
}
