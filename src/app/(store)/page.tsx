import type { Metadata } from 'next'
import { LovixaHero } from '@/components/home/LovixaHero'
import { LovixaCollection } from '@/components/home/LovixaCollection'
import { LovixaWhyChoose } from '@/components/home/LovixaWhyChoose'
import { LovixaConcerns } from '@/components/home/LovixaConcerns'
import { LovixaPromoBanner } from '@/components/home/LovixaPromoBanner'
import { LovixaRealExperience } from '@/components/home/LovixaRealExperience'
import { LovixaCategories } from '@/components/home/LovixaCategories'
import { LovixaBrandStory } from '@/components/home/LovixaBrandStory'
import { LovixaFAQ } from '@/components/home/LovixaFAQ'
import { LovixaCommunity } from '@/components/home/LovixaCommunity'
import {
  getStorefrontHomepage,
  getStorefrontProducts,
  getStorefrontSEOSettings,
} from '@/lib/cms/products'
import {
  generateOrganizationJsonLd,
  generateWebSiteJsonLd,
  generateFaqJsonLd,
} from '@/lib/seo/schema'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getStorefrontSEOSettings()
  const siteTitle = seo.siteTitle && !seo.siteTitle.includes('Coming Soon')
    ? seo.siteTitle
    : 'LOVIXA COSMETIC | Embrace Your Natural Beauty • Botanical Hair Care'
  const siteDescription =
    seo.defaultMetaDescription && !seo.defaultMetaDescription.includes('launching soon')
      ? seo.defaultMetaDescription
      : 'Discover LOVIXA Botanical Hair Care Essentials — Refreshing Botanical Shampoo (500ml) & Nourishing Hair Oil (50ml). Thoughtfully formulated with Rosemary, Eucalyptus & Cold-Pressed oils for healthier, radiant hair. Free Pan-India Delivery.'
  const canonicalUrl = seo.canonicalBaseUrl || 'https://www.lovixacosmetic.com'
  const ogImageUrl = `${canonicalUrl.replace(/\/$/, '')}/images/lovixa-og.jpg`

  return {
    title: siteTitle,
    description: siteDescription,
    keywords:
      seo.keywords ||
      'LOVIXA, LOVIXA cosmetic, botanical shampoo, nourishing hair oil, rosemary hair care, ayurvedic hair oil, sulfate free clarifying shampoo, anti-frizz hair ritual',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: siteTitle,
      description: siteDescription,
      url: canonicalUrl,
      siteName: 'LOVIXA COSMETIC',
      type: 'website',
      locale: 'en_IN',
      images: [
        {
          url: ogImageUrl,
          secureUrl: ogImageUrl,
          width: 1200,
          height: 630,
          alt: 'LOVIXA COSMETIC Botanical Hair Care Essentials',
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDescription,
      images: [ogImageUrl],
    },
    verification: {
      google: seo.googleVerification,
      other: seo.bingVerification ? { 'msvalidate.01': [seo.bingVerification] } : undefined,
    },
  }
}

export default async function HomePage() {
  const [homepageData, products] = await Promise.all([
    getStorefrontHomepage(),
    getStorefrontProducts({ limit: 4 }),
  ])

  const organizationJsonLd = generateOrganizationJsonLd()
  const websiteJsonLd = generateWebSiteJsonLd()
  const faqJsonLd =
    homepageData.faqs?.items && homepageData.faqs.items.length > 0
      ? generateFaqJsonLd(homepageData.faqs.items)
      : null

  return (
    <div className="bg-[#FBF6F8] min-h-screen">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* 01. HERO BANNER — Dynamic CMS hero carousel */}
      <LovixaHero slides={homepageData.heroSlides} />

      {/* 02. TOP HAIRCARE PICKS — Dynamic top picks from CMS */}
      <LovixaCollection products={products} />

      {/* 03. WHY LOVIXA? — Botanical Science & Conscious Formulation */}
      <LovixaWhyChoose data={homepageData.whyChooseUs} />

      {/* 04. SOLVE YOUR CONCERN — Target Hair Care & Scalp Concerns */}
      <LovixaConcerns data={homepageData.concernsSection} />

      {/* 05. COMBO BUNDLE DEAL — Signature 1 + 1 Hair Care Routine Kit */}
      <LovixaPromoBanner data={homepageData.promoBanner} />

      {/* 06. REAL EXPERIENCE — Real Verified Customer Reels & Community */}
      <LovixaRealExperience data={homepageData.realExperience} />

      {/* 07. BEYOND ONE KIND OF CARE — Category Pedestals */}
      <LovixaCategories data={homepageData.categoryPedestals} />

      {/* 08. THE LOVIXA PHILOSOPHY — Brand Story & Trust Badges */}
      <LovixaBrandStory data={homepageData.brandStory} />

      {/* 09. FAQ SECTION — Customer Care & Hair Routine Guidance */}
      <LovixaFAQ data={homepageData.faqs} />

      {/* 10. COMMUNITY & VIP CLUB — Instagram Lookbook + 15% VIP Club */}
      <LovixaCommunity data={homepageData.community} />
    </div>
  )
}
