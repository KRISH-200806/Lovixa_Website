import React from 'react'
import { getHeaderFooterForLayout, getHomePageData } from '@/lib/cms/queries'
import { LivePreviewWrapper } from '@/components/cms/LivePreviewWrapper'
import { SITE_NAME, SITE_URL } from '@/lib/seo-constants'
import { resolveSeoDescription, resolveSeoImage, resolveSeoTitle } from '@/lib/seo-meta'
import CosmeticHero from '@/components/sections/cosmetics/CosmeticHero'
import CategoryShowcase from '@/components/sections/cosmetics/CategoryShowcase'
import FeaturedProducts from '@/components/sections/cosmetics/FeaturedProducts'
import BeautyUSPs from '@/components/sections/cosmetics/BeautyUSPs'
import SkinConcernSection from '@/components/sections/cosmetics/SkinConcernSection'
import CustomerReviews from '@/components/sections/cosmetics/CustomerReviews'
import NewsletterSection from '@/components/sections/cosmetics/NewsletterSection'

import { LIGHT_THEME_DEFAULTS } from '@/lib/theme/tokens'

export const revalidate = 3600

export async function generateMetadata() {
  const homeData = await getHomePageData()
  const fallbackTitle = 'LOVIXA | Luxury Cosmetics & Clean Skincare'
  const fallbackDescription =
    'Discover high-performance 100% vegan lipsticks, radiance serums, and lightweight sunscreens crafted for your natural glow.'

  const title = resolveSeoTitle(homeData?.meta?.title, fallbackTitle)
  const description = resolveSeoDescription(homeData?.meta?.description, fallbackDescription)
  const image = resolveSeoImage(homeData?.meta?.image, '')

  return {
    title,
    description,
    alternates: { canonical: SITE_URL },
    openGraph: {
      title,
      description,
      url: SITE_URL,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  }
}

export default async function HomePage(props) {
  const searchParams = props?.searchParams ? await props.searchParams : {}
  const isPreview = searchParams?.preview === 'true'
  const homeData = await getHomePageData({ draft: isPreview })

  const activeHomeData = homeData || {
    hero: {
      title: 'LOVIXA Cosmetics',
      subtitle: 'Pure Elegance. High Performance. Crafted For Your Natural Glow.',
    },
    sections: [],
  }

  const { themeSettings } = await getHeaderFooterForLayout()
  const mode = themeSettings?.mode === 'dark' ? 'dark' : 'light'
  const fallbackAccent = themeSettings?.[mode]?.brand500 || LIGHT_THEME_DEFAULTS.brand500

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* 1. Luxury Cosmetic Hero */}
      <CosmeticHero />

      {/* 2. Shop by Category Showcase */}
      <CategoryShowcase />

      {/* 3. Trending & Best Seller Products with Interactive Cart */}
      <FeaturedProducts />

      {/* 4. Brand USPs & Clean Beauty Standards */}
      <BeautyUSPs />

      {/* 5. Shop by Skin Concern */}
      <SkinConcernSection />

      {/* 6. Customer Testimonials & Reviews */}
      <CustomerReviews />

      {/* 7. VIP Club & 15% OFF Newsletter */}
      <NewsletterSection />

      {/* 8. CMS Dynamic Sections (if configured in Payload Admin) */}
      {homeData && (
        <LivePreviewWrapper
          initialData={activeHomeData}
          fallbackAccentColor={fallbackAccent}
          breadcrumbTitle="Home"
          breadcrumbPath="/"
        />
      )}
    </main>
  )
}
