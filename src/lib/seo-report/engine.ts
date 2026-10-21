import { checkMeta } from './rules/meta'
import { checkHeadings } from './rules/headings'
import { checkKeywords } from './rules/keywords'
import { checkImages } from './rules/images'
import { checkSchema } from './rules/schema'
import { checkContent } from './rules/content'
import { checkAeo } from './rules/aeo'
import { checkGeo } from './rules/geo'
import { checkCompliance } from './rules/compliance'
import { computeScore } from './scoring'
import { getLiveSeoRulesConfig } from './remoteRules'
import type { GscSnapshot, SeoReportInput, SeoReportResult } from './types'

/** Single entry point for the SEO Report rules engine. Dynamically applies live rules from GitHub when online. */
export async function runSeoReport(input: SeoReportInput, gsc: GscSnapshot | null = null): Promise<SeoReportResult> {
  const liveConfig = await getLiveSeoRulesConfig().catch(() => null)

  const checks = [
    ...checkMeta(input),
    ...checkHeadings(input),
    ...checkKeywords(input),
    ...checkImages(input),
    ...checkSchema(input, {
      deprecatedTypes: liveConfig?.deprecatedSchemaTypes,
      sourceCommit: liveConfig?.sourceCommit,
    }),
    ...checkContent(input),
    ...checkAeo(input),
    ...checkGeo(input),
    ...checkCompliance(input),
  ]

  const { overall, categoryScores, complianceGated } = computeScore(checks)

  return {
    checks,
    score: overall,
    categoryScores,
    complianceGated,
    gsc,
  }
}
