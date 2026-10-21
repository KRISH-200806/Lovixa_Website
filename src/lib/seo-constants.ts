const DEFAULT_SITE_URL = 'http://localhost:3001'

const normalizeSiteUrl = (value: string) => String(value || DEFAULT_SITE_URL).trim().replace(/\/+$/, '')

export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL)
export const SITE_NAME = 'LOVIXA COSMETIC'
export const SITE_DESCRIPTION = 'Discover thoughtfully presented haircare, skincare and everyday beauty essentials from LOVIXA COSMETIC.'
export const SITE_KEYWORDS = ['lovixa', 'lovixa cosmetic', 'hair care', 'skin care', 'botanical beauty', 'rosemary shampoo', 'hair oil', 'herbal soaps']
export const THEME_COLOR = '#2B1822'
export const BRAND_COLOR = '#6B2D5C'
