import { revalidateTag } from 'next/cache'
import { globalTag, sectionSourceMapTag, sourceTableTag } from '@/lib/cms/cache-tags'

export function revalidateAllSiteCache() {
  const tags = [
    globalTag('home'),
    globalTag('header'),
    globalTag('footer'),
    sourceTableTag('home'),
    sectionSourceMapTag(),
  ]

  for (const tag of tags) {
    try {
      revalidateTag(tag)
    } catch {
      /* next/cache unavailable outside App Router */
    }
  }

  return { tags }
}
