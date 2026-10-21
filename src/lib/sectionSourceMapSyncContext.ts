/** Context flags for bulk section-source-map sync writes. */
export const SECTION_MAP_SYNC_CONTEXT = {
  skipSectionMapRevalidate: true,
} as const

export function buildSectionMapSyncOptions(req?: { context?: Record<string, unknown> }) {
  const context = {
    ...(req?.context || {}),
    ...SECTION_MAP_SYNC_CONTEXT,
  }
  return { context: SECTION_MAP_SYNC_CONTEXT, ...(req ? { req: { ...req, context } } : {}) }
}
