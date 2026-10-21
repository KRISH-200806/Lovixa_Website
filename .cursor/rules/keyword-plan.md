---
description: Prioritize project keyword-plan.json when writing or editing page copy, hero text, SEO fields, or section content
alwaysApply: false
globs: src/app/(frontend)/**/*.{js,jsx,ts,tsx}, src/collections/**/*.ts, src/globals/**/*.ts, src/lib/keyword-plan/**
---

# Keyword Plan Priority

This project has a per-project SEO keyword plan at `src/lib/keyword-plan/keyword-plan.json`, generated from `keyword-plan.md` via `pnpm run keywords:analyze`. Full workflow: `starter-kit/16-keyword-plan-workflow.md`.

## Rule

Before writing or editing any of the following, check the keyword plan for the page's target path and work the top-priority keyword(s) in naturally — no stuffing:

- Hero heading / eyebrow / subheading copy
- Section headings and body copy
- SEO title/description overrides in admin field defaults
- Alt text defaults for images on a given page
- JSON-LD structured data (`keywords`, `description` fields)

Read the plan like this:

```typescript
import { getKeywordsForPage, getPrimaryKeyword } from '@/lib/keyword-plan/keyword-plan'

const primary = getPrimaryKeyword('/services/commercial-roofing')
const all = getKeywordsForPage('/services/commercial-roofing') // sorted, best first
```

## Do not

- Do not invent a target page path that isn't in `keyword-plan.json` — check `byTargetPage` keys first.
- Do not use entries where `needsReview: true` or that sit in `unassigned` — those haven't been confirmed for a target page yet. Flag to the user instead of guessing.
- Do not reorder CMS `sections` based on keyword priority — section order is editorial (section-source-map), not keyword-driven.
- Do not hardcode keyword strings copy-pasted from the plan into components — read from `keyword-plan.ts`/`keyword-links` so a `keywords:analyze` re-run stays the single source of truth.
- Do not import `src/lib/keyword-plan/keyword-plan.ts` into a client component — it's server-only (`fs` read).

## If `keyword-plan.json` is missing or empty

The loader returns an empty plan (no crash) — `getPrimaryKeyword()` returns `undefined`. Fall back to normal editorial judgment, but tell the user `keyword-plan.md` hasn't been pasted/analyzed yet if they ask for keyword-prioritized copy.

---
*Standard Rules Prepared By: Flexion Infotech Private Limited*
