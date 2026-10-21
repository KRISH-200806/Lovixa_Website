import type { MetadataRoute } from 'next'
import {
  getStorefrontProducts,
  getStorefrontCategories,
  getStorefrontSEOSettings,
} from '@/lib/cms/products'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [seo, products, categories] = await Promise.all([
    getStorefrontSEOSettings(),
    getStorefrontProducts({ limit: 100 }),
    getStorefrontCategories(),
  ])

  const rawUrl = seo.canonicalBaseUrl || process.env.NEXT_PUBLIC_SERVER_URL || 'https://lovixacosmetic.com'
  const baseUrl = (rawUrl.includes('localhost') || rawUrl.includes('127.0.0.1'))
    ? 'https://lovixacosmetic.com'
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

  return [...staticRoutes, ...categoryRoutes, ...productRoutes]
}
