'use client'

import React, { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, formatLocalizedPath } from '@/lib/i18n/config'

export interface LanguageOption {
  code: string
  label: string
  flag: string
  enabled?: boolean
  isRtl?: boolean
}

export interface LanguageSwitcherProps {
  currentLocale?: string
  availableLanguages?: LanguageOption[]
  className?: string
}

export function LanguageSwitcher({
  currentLocale = DEFAULT_LOCALE,
  availableLanguages,
  className = '',
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname() || '/'
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Use provided list or default supported list
  const languages = (
    availableLanguages && availableLanguages.length > 0
      ? availableLanguages.filter((l) => l.enabled !== false)
      : Object.values(SUPPORTED_LOCALES)
  )

  const activeLang = languages.find((l) => l.code === currentLocale) || languages[0] || {
    code: 'en',
    label: 'English',
    flag: '🇺🇸',
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectLanguage = (targetCode: string) => {
    setIsOpen(false)
    if (targetCode === currentLocale) return

    const targetUrl = formatLocalizedPath(pathname, targetCode, DEFAULT_LOCALE)
    router.push(targetUrl)
  }

  // Hide if only 1 language available
  if (languages.length <= 1) return null

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-theme-border bg-surface text-theme-text hover:bg-theme-bg transition-colors focus:outline-none focus:ring-2 focus:ring-brand cursor-pointer"
        aria-expanded={isOpen}
        aria-label="Select Language"
      >
        <span>{activeLang.flag}</span>
        <span className="hidden sm:inline">{activeLang.label}</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-40 rounded-lg shadow-lg border border-theme-border bg-surface text-theme-text py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          {languages.map((lang) => {
            const isSelected = lang.code === currentLocale
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelectLanguage(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-left hover:bg-theme-bg transition-colors cursor-pointer ${
                  isSelected ? 'text-brand font-bold bg-theme-bg/50' : 'text-theme-text'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </div>
                {isSelected && <span className="text-brand">✓</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
