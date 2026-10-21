import { ImageResponse } from 'next/og'
import { SITE_NAME } from '@/lib/seo-constants'
import { getHeaderFooterForLayout } from '@/lib/cms/queries'
import { DARK_THEME_DEFAULTS } from '@/lib/theme/tokens'

/**
 * Fallback OG image — used only when a page/global doesn't set its own
 * `meta.image` in the SEO plugin tab. `next/og`'s Satori renderer can't read
 * CSS custom properties (it's not a browser), so colors are pulled from the
 * theme-settings global directly in JS instead — never a literal hex. See
 * starter-kit/22-theme-management.md.
 */
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const { themeSettings } = await getHeaderFooterForLayout()
  const mode = themeSettings?.mode === 'light' ? 'light' : 'dark'
  const colors = themeSettings?.[mode] || DARK_THEME_DEFAULTS

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.neutral900,
          color: colors.foreground,
          fontSize: 64,
          fontWeight: 700,
        }}
      >
        <div style={{ display: 'flex', width: 120, height: 8, backgroundColor: colors.brand500, marginBottom: 40 }} />
        <div style={{ display: 'flex' }}>{SITE_NAME}</div>
      </div>
    ),
    { ...size },
  )
}
