import React from 'react'
import { getActiveKeywordLinks } from '@/lib/keywordLinking/getActiveKeywordLinks'
import { linkKeywordsInText } from '@/lib/keywordLinking/linkKeywordsInText'

/**
 * Auto-links keyword-plan terms found in plain body copy to their priority
 * target page. Use for section/body text on section-based pages — not
 * inside `hero`/`meta` fields, and never wrap SEO meta description output.
 *
 * <KeywordLinkedText text={block.body} currentPath={data.slug ? `/${data.slug}` : '/'} />
 */
export async function KeywordLinkedText({
  text,
  currentPath,
}: {
  text: string
  currentPath?: string
}) {
  const links = await getActiveKeywordLinks()
  const nodes = linkKeywordsInText(text, links, currentPath)
  return <>{nodes}</>
}
