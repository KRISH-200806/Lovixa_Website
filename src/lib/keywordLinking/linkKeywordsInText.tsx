import React from 'react'
import Link from 'next/link'
import type { ActiveKeywordLink } from './getActiveKeywordLinks'

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Wraps the first match of each keyword (longest first, so multi-word phrases
 * win over their substrings) in a Link to its target page. Never links a
 * keyword to the page the reader is already on.
 */
type TextNode = string | React.ReactElement

export function linkKeywordsInText(
  text: string,
  links: ActiveKeywordLink[],
  currentPath?: string,
): TextNode[] {
  const applicable = links.filter((l) => l.targetURL !== currentPath)
  if (applicable.length === 0 || !text) return [text]

  let nodes: TextNode[] = [text]
  const linkedKeywords = new Set<string>()

  for (const link of applicable) {
    const key = link.keyword.toLowerCase()
    if (linkedKeywords.has(key)) continue

    const pattern = link.matchType === 'exact' ? `\\b${escapeRegExp(link.keyword)}\\b` : escapeRegExp(link.keyword)
    const re = new RegExp(pattern, 'i')

    let matched = false
    nodes = nodes.flatMap((node, idx): TextNode[] => {
      if (matched || typeof node !== 'string') return [node]
      const m = node.match(re)
      if (!m || m.index === undefined) return [node]

      matched = true
      const before = node.slice(0, m.index)
      const matchText = node.slice(m.index, m.index + m[0].length)
      const after = node.slice(m.index + m[0].length)

      const result: TextNode[] = [
        before,
        <Link key={`${key}-${idx}`} href={link.targetURL} className="underline decoration-dotted">
          {matchText}
        </Link>,
        after,
      ]
      return result.filter((n) => n !== '')
    })

    if (matched) linkedKeywords.add(key)
  }

  return nodes
}
