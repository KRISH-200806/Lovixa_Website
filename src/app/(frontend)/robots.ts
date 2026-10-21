import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo-constants'

/**
 * GEO/AEO note: AI answer-engine crawlers are separate user-agents from
 * classic search bots. Allowed by default here — set NEXT_PUBLIC_ALLOW_AI_CRAWLERS=false
 * to block them (e.g. if the client explicitly opts out of AI training/answer surfacing).
 * See starter-kit/17-seo-geo-aeo.md.
 */
const AI_CRAWLER_USER_AGENTS = [
  'GPTBot', // OpenAI
  'ChatGPT-User', // OpenAI (user-invoked browsing)
  'OAI-SearchBot', // OpenAI search
  'ClaudeBot', // Anthropic
  'anthropic-ai', // Anthropic
  'Google-Extended', // Google AI (Gemini/AI Overviews training)
  'PerplexityBot', // Perplexity
  'CCBot', // Common Crawl (feeds many AI training sets)
  'Applebot-Extended', // Apple AI
]

const allowAiCrawlers = process.env.NEXT_PUBLIC_ALLOW_AI_CRAWLERS !== 'false'

export default function robots(): MetadataRoute.Robots {
  const disallow = ['/admin', '/api', '/setup']

  const rules: MetadataRoute.Robots['rules'] = [{ userAgent: '*', allow: '/', disallow }]

  for (const agent of AI_CRAWLER_USER_AGENTS) {
    rules.push(
      allowAiCrawlers
        ? { userAgent: agent, allow: '/', disallow }
        : { userAgent: agent, disallow: '/' },
    )
  }

  return {
    rules,
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
