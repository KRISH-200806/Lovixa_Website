import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const envUrl = process.env.NEXT_PUBLIC_SERVER_URL
  const baseUrl = (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1'))
    ? envUrl
    : 'https://www.lovixacosmetic.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin',
          '/api/',
          '/account',
          '/checkout',
          '/cart',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/account',
          '/checkout',
          '/cart',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
