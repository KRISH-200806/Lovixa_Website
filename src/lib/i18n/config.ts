export interface LocaleDef {
  code: string
  label: string
  flag: string
  dir: 'ltr' | 'rtl'
}

export const SUPPORTED_LOCALES: Record<string, LocaleDef> = {
  en: { code: 'en', label: 'English', flag: '🇺🇸', dir: 'ltr' },
  es: { code: 'es', label: 'Español', flag: '🇪🇸', dir: 'ltr' },
  de: { code: 'de', label: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  fr: { code: 'fr', label: 'Français', flag: '🇫🇷', dir: 'ltr' },
  ar: { code: 'ar', label: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  it: { code: 'it', label: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
  pt: { code: 'pt', label: 'Português', flag: '🇧🇷', dir: 'ltr' },
  nl: { code: 'nl', label: 'Nederlands', flag: '🇳🇱', dir: 'ltr' },
  hi: { code: 'hi', label: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  zh: { code: 'zh', label: '中文', flag: '🇨🇳', dir: 'ltr' },
  ja: { code: 'ja', label: '日本語', flag: '🇯🇵', dir: 'ltr' },
}

export const DEFAULT_LOCALE = 'en'

export const DEFAULT_ACTIVE_LOCALES = [
  { code: 'en', label: 'English', flag: '🇺🇸', enabled: true, isRtl: false },
  { code: 'es', label: 'Español', flag: '🇪🇸', enabled: true, isRtl: false },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪', enabled: false, isRtl: false },
  { code: 'fr', label: 'Français', flag: '🇫🇷', enabled: false, isRtl: false },
  { code: 'ar', label: 'العربية', flag: '🇸🇦', enabled: false, isRtl: true },
]

export function getLocaleDirection(locale: string): 'ltr' | 'rtl' {
  return SUPPORTED_LOCALES[locale]?.dir || 'ltr'
}

export function formatLocalizedPath(pathname: string, targetLocale: string, defaultLocale = DEFAULT_LOCALE): string {
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]

  // If first segment is an existing locale, remove it
  if (firstSegment && Object.keys(SUPPORTED_LOCALES).includes(firstSegment)) {
    segments.shift()
  }

  const cleanPath = `/${segments.join('/')}`

  if (targetLocale === defaultLocale) {
    return cleanPath || '/'
  }

  return `/${targetLocale}${cleanPath === '/' ? '' : cleanPath}`
}
