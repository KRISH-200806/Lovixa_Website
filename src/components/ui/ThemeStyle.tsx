import {
  DARK_THEME_DEFAULTS,
  HEX_PATTERN,
  LEGACY_HEX_OVERRIDES,
  LIGHT_THEME_DEFAULTS,
  THEME_TOKEN_DEFS,
} from '@/lib/theme/tokens'

type ThemeModeColors = Record<string, unknown> | null | undefined

/** Re-validates every value at render time — uses Lovixa brand defaults if unconfigured or holding legacy template hexes. */
function buildDeclarations(modeColors: ThemeModeColors, fallback: Record<string, string>): string {
  return THEME_TOKEN_DEFS.map((token) => {
    const raw = modeColors?.[token.name]
    const isCleanHex = typeof raw === 'string' && HEX_PATTERN.test(raw.trim())
    const isLegacyHex = typeof raw === 'string' && LEGACY_HEX_OVERRIDES.has(raw.trim().toUpperCase())

    const value = isCleanHex && !isLegacyHex ? (raw as string).trim() : fallback[token.name]
    return `${token.cssVar}: ${value};`
  }).join('\n      ')
}

/**
 * Emits CSS custom properties for BOTH modes (scoped by [data-theme]) so a
 * future client-side toggle can flip `data-theme` on <html> without a new
 * fetch. RootLayout sets `data-theme` from `themeSettings.mode` (defaults to 'light').
 */
export default function ThemeStyle({
  themeSettings,
}: {
  themeSettings?: { dark?: ThemeModeColors; light?: ThemeModeColors } | null
}) {
  const lightDecls = buildDeclarations(themeSettings?.light, LIGHT_THEME_DEFAULTS)

  return (
    <style>{`
      :root,
      :root[data-theme="light"],
      :root[data-theme="dark"],
      html,
      body {
      ${lightDecls}
        color-scheme: light;
      }
    `}</style>
  )
}
