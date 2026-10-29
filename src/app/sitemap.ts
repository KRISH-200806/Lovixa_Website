import type { MetadataRoute } from 'next'
import {
  getStorefrontProducts,
  getStorefrontCategories,
  getStorefrontSEOSettings,
} from '@/lib/cms/products'
import { getPayloadCached } from '@/lib/cms/get-payload-cached'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [seo, products, categories] = await Promise.all([
    getStorefrontSEOSettings(),
    getStorefrontProducts({ limit: 100 }),
    getStorefrontCategories(),
  ])

  const rawUrl = seo.canonicalBaseUrl || process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.lovixacosmetic.com'
  const baseUrl = (rawUrl.includes('localhost') || rawUrl.includes('127.0.0.1'))
    ? 'https://www.lovixacosmetic.com'
    : rawUrl

  // Core static storefront routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/shipping-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/return-refund-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-conditions`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  // Category routes
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/collections/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Product routes
  const productRoutes: MetadataRoute.Sitemap = products.map((prod) => ({
    url: `${baseUrl}/products/${prod.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }))

  // Dynamic Blog Post routes from Payload
  let blogRoutes: MetadataRoute.Sitemap = []
  let dynamicCmsRoutes: MetadataRoute.Sitemap = []

  try {
    const payload = await getPayloadCached()

    // 1. Fetch published blogs
    const blogsResult = await payload.find({
      collection: 'blog-posts',
      where: {
        or: [
          { status: { equals: 'published' } },
          { isPublished: { equals: true } },
        ],
      },
      depth: 0,
      limit: 100,
    })

    if (blogsResult.docs) {
      blogRoutes = blogsResult.docs.map((doc: any) => ({
        url: `${baseUrl}/blog/${doc.slug}`,
        lastModified: doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }))
    }

    // 2. Fetch custom CMS pages (exclude routes already in staticRoutes)
    const existingStaticSlugs = new Set([
      'about',
      'contact',
      'faq',
      'shipping-policy',
      'return-refund-policy',
      'privacy-policy',
      'terms-conditions',
      'terms',
      'refund-policy',
      'our-story',
    ])

    const pagesResult = await payload.find({
      collection: 'pages',
      where: {
        isPublished: { not_equals: false },
      },
      depth: 0,
      limit: 100,
    })

    if (pagesResult.docs) {
      dynamicCmsRoutes = pagesResult.docs
        .filter((doc: any) => doc.slug && !existingStaticSlugs.has(doc.slug))
        .map((doc: any) => ({
          url: `${baseUrl}/${doc.slug}`,
          lastModified: doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.5,
        }))
    }
  } catch (err) {
    console.warn('[sitemap] Failed to fetch dynamic blogs or pages:', err)
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes, ...dynamicCmsRoutes]
}
