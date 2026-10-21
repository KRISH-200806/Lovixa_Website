export interface KeywordPlanEntry {
  keyword: string
  priority: number
  volume?: number
  intent?: string
  targetPage?: string
  sourceTable?: string
  notes?: string
  needsReview: boolean
}

export interface KeywordPlan {
  generatedAt: string
  sourceFile: string
  totalKeywords: number
  entries: KeywordPlanEntry[]
  byTargetPage: Record<string, string[]>
  unassigned: string[]
}

export const EMPTY_KEYWORD_PLAN: KeywordPlan = {
  generatedAt: '',
  sourceFile: '',
  totalKeywords: 0,
  entries: [],
  byTargetPage: {},
  unassigned: [],
}
