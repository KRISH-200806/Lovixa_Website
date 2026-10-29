import { unstable_cache } from 'next/cache'
import { getPayloadCached } from '@/lib/cms/get-payload-cached'
import { CMS_CACHE_REVALIDATE_SECONDS } from '@/lib/cms/cache-tags'

export interface BlogPostFAQ {
  id?: string
  question: string
  answer: string
}

export interface BlogPostDocument {
  id: string
  title: string
  slug: string
  status?: 'published' | 'draft' | 'scheduled'
  isPublished?: boolean
  publishedAt?: string
  createdAt?: string
  updatedAt?: string
  category: string
  author?: string
  readTime?: string
  excerpt: string
  featuredImage?: any
  featuredImageUrl?: string
  featuredImageAlt?: string
  content: any
  tags?: Array<{ tag: string; id?: string }>
  faqSection?: BlogPostFAQ[]
  seo?: {
    metaTitle?: string
    metaDescription?: string
    focusKeywords?: string
    canonicalUrl?: string
    ogTitle?: string
    ogDescription?: string
    ogImage?: any
    twitterCard?: 'summary_large_image' | 'summary'
    noIndex?: boolean
  }
}

export interface BlogFilterOptions {
  category?: string
  tag?: string
  search?: string
  page?: number
  limit?: number
}

export interface PaginatedBlogResponse {
  docs: BlogPostDocument[]
  totalDocs: number
  totalPages: number
  page: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

/**
 * Fetch published blog posts with filtering, pagination, and caching.
 */
export async function getBlogPosts(options: BlogFilterOptions = {}): Promise<PaginatedBlogResponse> {
  const { category, tag, search, page = 1, limit = 9 } = options

  const cacheKey = `blog-posts-cat-${category || 'all'}-tag-${tag || 'all'}-q-${search || 'none'}-p-${page}-l-${limit}`

  return unstable_cache(
    async () => {
      try {
        const payload = await getPayloadCached()
        const whereConditions: any[] = [
          {
            or: [
              { status: { equals: 'published' } },
              { isPublished: { equals: true } },
            ],
          },
        ]

        if (category && category !== 'all') {
          whereConditions.push({ category: { equals: category } })
        }

        if (tag && tag !== 'all') {
          whereConditions.push({ 'tags.tag': { equals: tag } })
        }

        if (search && search.trim()) {
          const q = search.trim()
          whereConditions.push({
            or: [
              { title: { contains: q } },
              { excerpt: { contains: q } },
            ],
          })
        }

        const result = await payload.find({
          collection: 'blog-posts',
          where: { and: whereConditions },
          depth: 1,
          page,
          limit,
          sort: '-publishedAt',
        })

        return {
          docs: (result.docs || []) as unknown as BlogPostDocument[],
          totalDocs: result.totalDocs || 0,
          totalPages: result.totalPages || 1,
          page: result.page || 1,
          hasNextPage: Boolean(result.hasNextPage),
          hasPrevPage: Boolean(result.hasPrevPage),
        }
      } catch (err) {
        console.error('[CMS] Error fetching blog posts:', err)
        return {
          docs: [],
          totalDocs: 0,
          totalPages: 1,
          page: 1,
          hasNextPage: false,
          hasPrevPage: false,
        }
      }
    },
    [cacheKey],
    {
      tags: ['blog-posts'],
      revalidate: CMS_CACHE_REVALIDATE_SECONDS,
    },
  )()
}

/**
 * Fetch a single blog post by its slug.
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPostDocument | null> {
  return unstable_cache(
    async () => {
      try {
        const payload = await getPayloadCached()
        const result = await payload.find({
          collection: 'blog-posts',
          where: {
            and: [
              { slug: { equals: slug } },
              {
                or: [
                  { status: { equals: 'published' } },
                  { isPublished: { equals: true } },
                ],
              },
            ],
          },
          depth: 1,
          limit: 1,
        })

        if (!result.docs || result.docs.length === 0) return null
        return result.docs[0] as unknown as BlogPostDocument
      } catch (err) {
        console.error(`[CMS] Error fetching blog post "${slug}":`, err)
        return null
      }
    },
    [`blog-post-${slug}`],
    {
      tags: ['blog-posts', `blog-post-${slug}`],
      revalidate: CMS_CACHE_REVALIDATE_SECONDS,
    },
  )()
}

/**
 * Fetch related blog posts by category.
 */
export async function getRelatedBlogPosts(
  currentSlug: string,
  category?: string,
  limit = 3
): Promise<BlogPostDocument[]> {
  return unstable_cache(
    async () => {
      try {
        const payload = await getPayloadCached()
        const whereConditions: any[] = [
          { slug: { not_equals: currentSlug } },
          {
            or: [
              { status: { equals: 'published' } },
              { isPublished: { equals: true } },
            ],
          },
        ]

        if (category) {
          whereConditions.push({ category: { equals: category } })
        }

        const result = await payload.find({
          collection: 'blog-posts',
          where: { and: whereConditions },
          depth: 1,
          limit,
          sort: '-publishedAt',
        })

        return (result.docs || []) as unknown as BlogPostDocument[]
      } catch (err) {
        console.error('[CMS] Error fetching related blog posts:', err)
        return []
      }
    },
    [`related-blogs-${currentSlug}-${category || 'any'}`],
    {
      tags: ['blog-posts'],
      revalidate: CMS_CACHE_REVALIDATE_SECONDS,
    },
  )()
}
