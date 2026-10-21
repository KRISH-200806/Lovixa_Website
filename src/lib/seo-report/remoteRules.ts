/**
 * Remote SEO & AI Search Engine Rules Synchronizer
 *
 * Evaluates SEO, GEO, and Schema guidelines. Incorporates technical reference
 * patterns from Google Search Central, Schema.org, and claude-seo (MIT License,
 * Copyright (c) 2026 agricidaniel — see THIRD_PARTY_NOTICES.md).
 */

export type RemoteSeoConfig = {
  lastChecked: number
  deprecatedSchemaTypes: string[]
  citabilityMinWords: number
  citabilityMaxWords: number
  sourceCommit?: string
}

let cachedRemoteConfig: RemoteSeoConfig | null = null
const CACHE_TTL_MS = 1000 * 60 * 60 // 1 hour cache

export const DEFAULT_DEPRECATED_SCHEMA_TYPES = [
  'HowTo',
  'SpecialAnnouncement',
  'ClaimReview',
  'EstimatedSalary',
  'LearningVideo',
  'VehicleListing',
  'CourseInfo',
]

/**
 * Dynamically pulls the freshest schema deprecations and AI search guidelines
 * from the live AgriciDaniel/claude-seo repository on GitHub.
 *
 * Fast 2-second timeout with in-memory caching ensures zero delay and safe
 * offline fallback.
 */
export async function getLiveSeoRulesConfig(): Promise<RemoteSeoConfig> {
  const now = Date.now()
  if (cachedRemoteConfig && now - cachedRemoteConfig.lastChecked < CACHE_TTL_MS) {
    return cachedRemoteConfig
  }

  const fallback: RemoteSeoConfig = {
    lastChecked: now,
    deprecatedSchemaTypes: DEFAULT_DEPRECATED_SCHEMA_TYPES,
    citabilityMinWords: 100,
    citabilityMaxWords: 180,
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000)

    const res = await fetch(
      'https://raw.githubusercontent.com/AgriciDaniel/claude-seo/main/skills/seo-schema/references/deprecated-types-2024-2026.md',
      { signal: controller.signal, next: { revalidate: 3600 } },
    )
    clearTimeout(timeoutId)

    if (res.ok) {
      const text = await res.text()
      const typesFound = new Set<string>(DEFAULT_DEPRECATED_SCHEMA_TYPES)
      const matches = text.matchAll(/`([A-Z][a-zA-Z0-9]+)`/g)
      for (const match of matches) {
        if (match[1] && match[1].length > 3) {
          typesFound.add(match[1])
        }
      }

      cachedRemoteConfig = {
        lastChecked: now,
        deprecatedSchemaTypes: Array.from(typesFound),
        citabilityMinWords: 100,
        citabilityMaxWords: 180,
        sourceCommit: 'github-live',
      }
      return cachedRemoteConfig
    }
  } catch {
    // Offline or network error: gracefully fallback to built-in defaults
  }

  cachedRemoteConfig = fallback
  return fallback
}
