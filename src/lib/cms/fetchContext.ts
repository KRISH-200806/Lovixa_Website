/** Skip section-source-map afterRead when applySectionSourceMap runs on the frontend. */
export const FRONTEND_MAPPED_FETCH_CONTEXT = {
  skipSectionSourceMapRead: true,
} as const

export function buildFrontendMappedFetchOptions() {
  return { context: FRONTEND_MAPPED_FETCH_CONTEXT }
}
