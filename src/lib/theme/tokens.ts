/**
 * Single source of truth for theme color tokens — field names, CSS var
 * names, and per-mode defaults. Consumed by src/globals/ThemeSettings.ts
 * (admin fields) and src/components/ui/ThemeStyle.tsx (runtime CSS vars).
 * Add a new color here first, then reference `var(--color-...)` in
 * tailwind.config.js. See starter-kit/22-theme-management.md.
 */
export interface ThemeTokenDef {
  name: string
  label: string
  cssVar: string
}

export const THEME_TOKEN_DEFS: ThemeTokenDef[] = [
  { name: 'background', label: 'Page background (Pure Crisp White)', cssVar: '--color-background' },
  { name: 'foreground', label: 'Default text color (Deep Espresso)', cssVar: '--color-foreground' },
  { name: 'brand50', label: 'Brand 50 (lightest tint)', cssVar: '--color-brand-50' },
  { name: 'brand100', label: 'Brand 100 (soft blush wash)', cssVar: '--color-brand-100' },
  { name: 'brand200', label: 'Brand 200 (Blush Pink)', cssVar: '--color-brand-200' },
  { name: 'brand300', label: 'Brand 300 (rose blush)', cssVar: '--color-brand-300' },
  { name: 'brand400', label: 'Brand 400 (vibrant plum rose)', cssVar: '--color-brand-400' },
  { name: 'brand500', label: 'Brand 500 (Rich Plum - Primary CTA)', cssVar: '--color-brand-500' },
  { name: 'brand600', label: 'Brand 600 (plum hover)', cssVar: '--color-brand-600' },
  { name: 'brand700', label: 'Brand 700 (deep plum)', cssVar: '--color-brand-700' },
  { name: 'brand800', label: 'Brand 800 (very deep plum)', cssVar: '--color-brand-800' },
  { name: 'brand900', label: 'Brand 900 (Deep Espresso)', cssVar: '--color-brand-900' },
  { name: 'neutral0', label: 'Neutral 0 (Pure White)', cssVar: '--color-neutral-0' },
  { name: 'neutral400', label: 'Neutral 400 (muted text)', cssVar: '--color-neutral-400' },
  { name: 'neutral500', label: 'Neutral 500 (secondary text)', cssVar: '--color-neutral-500' },
  { name: 'neutral800', label: 'Neutral 800 (border / card border)', cssVar: '--color-neutral-800' },
  { name: 'neutral900', label: 'Neutral 900 (card / section surface)', cssVar: '--color-neutral-900' },
  { name: 'neutral1000', label: 'Neutral 1000 (deep dark surface)', cssVar: '--color-neutral-1000' },
  { name: 'semanticSuccess', label: 'Semantic — success', cssVar: '--color-semantic-success' },
  { name: 'semanticError', label: 'Semantic — error', cssVar: '--color-semantic-error' },
  { name: 'semanticWarning', label: 'Semantic — warning', cssVar: '--color-semantic-warning' },
  { name: 'semanticInfo', label: 'Semantic — info', cssVar: '--color-semantic-info' },
  { name: 'accentRed', label: 'Accent — red (decorative)', cssVar: '--color-accent-red' },
  { name: 'accentBlue', label: 'Accent — blue (decorative)', cssVar: '--color-accent-blue' },
  { name: 'accentOlive', label: 'Accent — olive (decorative)', cssVar: '--color-accent-olive' },
  { name: 'accentPeach', label: 'Accent — peach (decorative)', cssVar: '--color-accent-peach' },
]

/** Official LOVIXA Brand Defaults (Pure White #FFFFFF, Deep Espresso #2B1822, Rich Plum #6B2D5C, Blush Pink #E8C4D4) */
export const LIGHT_THEME_DEFAULTS: Record<string, string> = {
  background: '#FFFFFF', // Pure Crisp White Page Background
  foreground: '#2B1822', // Deep Espresso Headings & Text
  brand50: '#FAF0F5',
  brand100: '#F4E0EC',
  brand200: '#E8C4D4', // 30% Blush Pink
  brand300: '#D29CB7',
  brand400: '#9C4B84',
  brand500: '#6B2D5C', // 10% Rich Plum (Primary CTA & Accents)
  brand600: '#5A234D', // Plum Hover
  brand700: '#481B3D',
  brand800: '#38142F',
  brand900: '#2B1822', // Deep Espresso
  neutral0: '#FFFFFF',
  neutral400: '#7D6372', // Muted Deep Espresso text
  neutral500: '#5E4855', // Secondary text
  neutral800: '#E8C4D4', // Blush Pink border & input surface
  neutral900: '#F5E9F0', // Soft Blush card/section surface
  neutral1000: '#2B1822', // Deep Espresso dark contrast
  semanticSuccess: '#2A7E4F',
  semanticError: '#C12948',
  semanticWarning: '#D97706',
  semanticInfo: '#6B2D5C',
  accentRed: '#C12948',
  accentBlue: '#6B2D5C',
  accentOlive: '#4A3B32',
  accentPeach: '#E8C4D4',
}

export const DARK_THEME_DEFAULTS: Record<string, string> = {
  ...LIGHT_THEME_DEFAULTS,
}

export const LEGACY_HEX_OVERRIDES = new Set([
  '#000000',
  '#0D0D0D',
  '#0A0A0A',
  '#0E0E0E',
  '#07080C',
  '#0F1118',
  '#050608',
  '#111111',
  '#121212',
  '#1A1A1A',
  '#18181B',
  '#1B0E16',
  '#1F1018',
  '#262626',
  '#737373',
  '#A3A3A3',
  '#E5E5E5',
  '#EDEDED',
  '#FB5600',
  '#FF6B1A',
  '#E24F00',
  '#CF4E17',
  '#812C00',
  '#581E00',
  '#FF752E',
  '#FF945C',
  '#FFB28A',
  '#FFD0B7',
  '#FFEEE5',
])

export const HEX_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
