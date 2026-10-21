import { unstable_cache } from 'next/cache'
import { getPayloadCached } from '@/lib/cms/get-payload-cached'
import { CMS_CACHE_REVALIDATE_SECONDS } from '@/lib/cms/cache-tags'

export interface PageSection {
  id?: string
  heading: string
  content: string
}

export interface BrandPillar {
  id?: string
  iconType?: 'leaf' | 'shield' | 'sparkles' | 'heart'
  title: string
  desc: string
}

export interface CommitmentCard {
  id?: string
  title: string
  desc: string
}

export interface ContactSocialLink {
  id?: string
  platform: 'facebook' | 'instagram' | 'youtube' | 'linkedin'
  url: string
}

export interface PageDocument {
  id: string
  title: string
  slug: string
  isPublished?: boolean
  badge?: string
  highlightTitle?: string
  subtitle?: string
  headerImage?: any
  headerImageUrl?: string
  lastUpdated?: string
  content?: any
  sections?: PageSection[]
  aboutStory?: {
    editorialPurposeBadge?: string
    editorialHeading?: string
    editorialText?: string
    storyBadge?: string
    storyHeading?: string
    storyParagraph1?: string
    storyParagraph2?: string
    storyImage?: any
    storyImageUrl?: string
    brandPillars?: BrandPillar[]
    commitments?: CommitmentCard[]
  }
  contactInfo?: {
    phone?: string
    supportHours?: string
    email?: string
    emailNote?: string
    address?: string
    whatsappNumber?: string
    introSubtitle?: string
    socialLinks?: ContactSocialLink[]
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
    focusKeywords?: string
    canonicalUrl?: string
    ogImage?: any
    noIndex?: boolean
  }
  updatedAt?: string
  createdAt?: string
}

/**
 * Fetch a published Page from Payload CMS by its slug.
 * Cached with tags: ['pages', `page-${slug}`]
 */
export async function getPageBySlug(slug: string): Promise<PageDocument | null> {
  return unstable_cache(
    async () => {
      try {
        const payload = await getPayloadCached()
        const result = await payload.find({
          collection: 'pages',
          where: {
            and: [
              { slug: { equals: slug } },
              { isPublished: { not_equals: false } },
            ],
          },
          depth: 1,
          limit: 1,
        })

        if (!result.docs || result.docs.length === 0) {
          return null
        }

        return result.docs[0] as unknown as PageDocument
      } catch (error) {
        console.error(`[CMS] Error fetching page "${slug}":`, error)
        return null
      }
    },
    [`cms-page-${slug}`],
    {
      tags: ['pages', `page-${slug}`],
      revalidate: CMS_CACHE_REVALIDATE_SECONDS,
    },
  )()
}
