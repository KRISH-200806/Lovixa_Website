import type { Metadata } from 'next'
import { getBlogPosts } from '@/lib/cms/blog'
import { BlogListClient } from '@/components/blog/BlogListClient'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Hair Wellness Journal & Botanical Care Guides — LOVIXA COSMETIC',
  description:
    'Explore Ayurvedic hair care rituals, Rosemary Oil benefits, scalp health secrets, and gentle botanical science from the LOVIXA research team.',
  alternates: {
    canonical: 'https://www.lovixacosmetic.com/blog',
  },
  openGraph: {
    title: 'Hair Wellness Journal & Botanical Care Guides — LOVIXA COSMETIC',
    description:
      'Explore Ayurvedic hair care rituals, Rosemary Oil benefits, scalp health secrets, and gentle botanical science from the LOVIXA research team.',
    url: 'https://www.lovixacosmetic.com/blog',
    images: [
      {
        url: 'https://www.lovixacosmetic.com/images/lovixa-og.jpg',
        width: 1200,
        height: 630,
        alt: 'LOVIXA Hair Wellness Journal',
      },
    ],
  },
}

export default async function BlogIndexPage() {
  const result = await getBlogPosts({ limit: 50 })

  return <BlogListClient initialPosts={result.docs} />
}
