import { cache } from 'react'
import { getPayloadCached } from './get-payload-cached'
import { getMediaUrl } from '@/utils/getMediaUrl'

// Instant Live Sync: Always fetch fresh data from Payload/MongoDB so admin changes reflect across all pages immediately
const memoryCache = new Map<string, { data: any; expiry: number }>()

export function clearStorefrontCache() {
  memoryCache.clear()
}

async function withCmsCache<T>(_key: string, fetcher: () => Promise<T>): Promise<T> {
  return await fetcher()
}

export interface StorefrontProduct {
  id: string
  title: string
  slug: string
  price: number
  compareAtPrice?: number
  image?: string
  brand?: string
  rating: number
  reviewCount: number
  badge?: string
  category?: string
  categories?: string[]
  shortDescription?: string
  stock?: number
  isPublished?: boolean
  size?: string
}

export interface StorefrontVariant {
  id: string
  sku: string
  title: string
  price: number
  compareAtPrice?: number
  inventory: number
  options?: Array<{ name: string; value: string }>
}

export interface StorefrontProductDetail extends StorefrontProduct {
  description?: any
  images: Array<{ url: string; alt?: string }>
  variants: StorefrontVariant[]
  ingredients?: string
  actives?: Array<{ name: string; desc: string }>
  ritualSteps?: Array<{ stepNumber?: number; title?: string; instruction: string }>
  benefits?: Array<{ claim: string; highlight?: boolean }>
  caution?: string
  categoryAttributes?: Array<{ attributeKey: string; attributeName?: string; value: string }>
  relatedProducts?: StorefrontProduct[]
  seo?: {
    metaTitle?: string
    metaDescription?: string
    focusKeywords?: string
    canonicalUrl?: string
    noIndex?: boolean
  }
}

export interface StorefrontCategory {
  id: string
  name: string
  slug: string
  description?: string
  badge?: string
  image?: string
  itemCount?: string
  attributes?: Array<{
    name: string
    slug: string
    options: Array<{ label: string; value: string }>
  }>
  seo?: {
    metaTitle?: string
    metaDescription?: string
    canonicalUrl?: string
  }
}

export interface StorefrontHeroSlide {
  badge?: string
  heading: string
  highlightHeading?: string
  subheading?: string
  ctaText?: string
  ctaLink?: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
  image?: string
  imageUrl?: string
}

export interface StorefrontWhyChoosePillar {
  iconType?: 'clean' | 'conscious' | 'effective'
  title: string
  desc: string
}

export interface StorefrontWhyChooseData {
  heading?: string
  subtitle?: string
  pillars: StorefrontWhyChoosePillar[]
}

export interface StorefrontConcern {
  id: string
  title: string
  subtitle?: string
  image?: string
  routineTitle?: string
  routineDesc?: string
  steps?: string[]
  productTitle?: string
  productImage?: string
  price?: number
  compareAtPrice?: number
  slug?: string
  productId?: string
}

export interface StorefrontConcernsSectionData {
  eyebrow?: string
  heading?: string
  subtitle?: string
  concerns: StorefrontConcern[]
}

export interface StorefrontPromoBannerData {
  sectionTitle?: string
  sectionSubtitle?: string
  badge?: string
  ritualTitle?: string
  productTitle?: string
  description?: string
  features?: string[]
  offerPrice?: number
  comparePrice?: number
  discountTag?: string
  ctaText?: string
  ctaLink?: string
  image?: string
  freeShippingText?: string
  trustText?: string
}

export interface StorefrontExperienceReel {
  id: string
  title: string
  customerName: string
  views: string
  videoThumbnail: string
  productTitle: string
  productImage: string
  productSlug: string
  price: number
  compareAtPrice: number
  discount: string
}

export interface StorefrontRealExperienceData {
  heading?: string
  subtitle?: string
  reels: StorefrontExperienceReel[]
}

export interface StorefrontCategoryPedestalCard {
  tag?: string
  title: string
  subtitle: string
  image: string
  href: string
}

export interface StorefrontCategoryPedestalsData {
  heading?: string
  subtitle?: string
  cards: StorefrontCategoryPedestalCard[]
}

export interface StorefrontBrandStorySeal {
  iconType?: 'leaf' | 'award' | 'shield' | 'heart'
  title: string
  subtitle: string
  desc: string
}

export interface StorefrontBrandStoryData {
  heading?: string
  storyText?: string
  seals: StorefrontBrandStorySeal[]
}

export interface StorefrontFAQItem {
  question: string
  answer: string
}

export interface StorefrontFAQsData {
  heading?: string
  subtitle?: string
  items: StorefrontFAQItem[]
}

export interface StorefrontCommunityLookbookImage {
  image: string
  caption?: string
}

export interface StorefrontCommunityData {
  heading?: string
  subtitle?: string
  vipBadge?: string
  vipTitle?: string
  vipSubtitle?: string
  vipCode?: string
  galleryImages: StorefrontCommunityLookbookImage[]
}

export interface StorefrontHomepageData {
  heroSlides: StorefrontHeroSlide[]
  featuredProducts?: StorefrontProduct[]
  whyChooseUs: StorefrontWhyChooseData
  concernsSection: StorefrontConcernsSectionData
  promoBanner: StorefrontPromoBannerData
  realExperience: StorefrontRealExperienceData
  categoryPedestals: StorefrontCategoryPedestalsData
  brandStory: StorefrontBrandStoryData
  faqs: StorefrontFAQsData
  community: StorefrontCommunityData
}

export interface StorefrontAnnouncementBarData {
  enabled: boolean
  messages: Array<{ text: string; highlight?: string | null; link?: string | null }>
  backgroundColor?: string
  textColor?: string
}

export interface StorefrontSEOSettingsData {
  siteTitle: string
  titleSeparator: string
  defaultMetaDescription: string
  keywords: string
  canonicalBaseUrl: string
  googleVerification?: string | null
  bingVerification?: string | null
  googleAnalyticsId?: string | null
  googleTagManagerId?: string | null
  metaPixelId?: string | null
  organization?: {
    name?: string | null
    legalName?: string | null
    contactEmail?: string | null
    contactPhone?: string | null
    addressCountry?: string | null
    instagramUrl?: string | null
  } | null
}

export interface StorefrontPageData {
  id: string
  title: string
  slug: string
  badge?: string
  subtitle?: string
  headerImage?: string
  content?: any
  seo?: {
    metaTitle?: string
    metaDescription?: string
    focusKeywords?: string
    canonicalUrl?: string
    noIndex?: boolean
  }
}

export interface StorefrontBlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  author?: string
  readTime?: string
  publishedAt?: string
  featuredImage?: string
  content?: any
  tags?: string[]
}

function extractMediaUrl(media: any, preferredSize?: 'thumbnail' | 'card' | 'hero'): string | undefined {
  const url = getMediaUrl(media, preferredSize)
  return url || undefined
}


export const getStorefrontProducts = cache(async function getStorefrontProducts(options?: {
  category?: string
  featuredOnly?: boolean
  limit?: number
}): Promise<StorefrontProduct[]> {
  const cacheKey = `products_${options?.category || 'all'}_${options?.featuredOnly ? 'feat' : 'all'}_${options?.limit || 50}`
  return withCmsCache(cacheKey, async () => {
    try {
      const payload = await getPayloadCached()
      const where: any = {}

      if (options?.featuredOnly) {
        where.tags = {
          contains: 'featured',
        }
      }

      const result = await payload.find({
        collection: 'products',
        where,
        depth: 2,
        limit: options?.limit || 50,
        overrideAccess: true,
      })

      if (result.docs && result.docs.length > 0) {
        return result.docs.map((doc: any) => {
          const brandName =
            typeof doc.brand === 'object' && doc.brand !== null
              ? doc.brand.name || doc.brand.title
              : undefined

          const defaultImages: Record<string, string> = {
            'lovixa-shampoo': '/images/lovixa-shampoo.jpg',
            'lovixa-hair-oil': '/images/lovixa-hairoil.jpg',
            'lovixa-hair-care-duo': '/images/lovixa-duo.jpg',
          }

          const primaryImage =
            (doc.images && doc.images.length > 0
              ? extractMediaUrl(doc.images[0].image)
              : undefined) ||
            defaultImages[doc.slug] ||
            '/images/lovixa-hero-banner-products.jpg'

          const categoryNames = Array.isArray(doc.categories)
            ? doc.categories
                .map((c: any) => (typeof c === 'object' && c !== null ? c.slug || c.name : String(c)))
                .filter(Boolean)
            : []

          let badge: string | undefined
          if (doc.tags?.includes('best-seller')) badge = 'BEST SELLER'
          else if (doc.tags?.includes('featured')) badge = 'FEATURED'
          else if (doc.tags?.includes('new-arrival')) badge = 'NEW'
          else if (doc.tags?.includes('on-sale')) badge = 'SAVE 18%'

          return {
            id: String(doc.id),
            title: doc.title || 'Untitled Product',
            slug: doc.slug || String(doc.id),
            price: typeof doc.basePrice === 'number' ? doc.basePrice : 0,
            compareAtPrice: typeof doc.compareAtPrice === 'number' ? doc.compareAtPrice : undefined,
            image: primaryImage,
            brand: brandName || 'LOVIXA COSMETIC',
            rating: 4.9,
            reviewCount: 38,
            badge,
            category: categoryNames[0],
            categories: categoryNames,
            shortDescription: doc.shortDescription,
            stock: typeof doc.stock === 'number' ? doc.stock : 100,
            isPublished: doc.isPublished ?? true,
            size: doc.size,
          }
        })
      }
    } catch (error) {
      console.error('Error fetching storefront products from Payload database:', error)
    }

    // Fallback to rich cosmetics catalog if Payload database is unseeded
    const { COSMETIC_PRODUCTS } = await import('@/lib/constants/cosmetics-catalog')
    let filtered = COSMETIC_PRODUCTS
    if (options?.category && options.category !== 'all') {
      filtered = filtered.filter(
        (p) => p.category === options.category || (p.categories && p.categories.includes(options.category!))
      )
    }
    if (options?.limit) {
      filtered = filtered.slice(0, options.limit)
    }
    return filtered
  })
})

export const getStorefrontProductBySlug = cache(async function getStorefrontProductBySlug(slug: string): Promise<StorefrontProductDetail | null> {
  const cacheKey = `product_detail_${slug}`
  return withCmsCache(cacheKey, async () => {
    try {
      const payload = await getPayloadCached()
      const result = await payload.find({
        collection: 'products',
        where: {
          slug: {
            equals: slug,
          },
        },
        depth: 2,
        limit: 1,
        overrideAccess: true,
      })

      const doc: any = result.docs?.[0]
      if (doc) {
      const brandName =
        typeof doc.brand === 'object' && doc.brand !== null
          ? doc.brand.name || doc.brand.title
          : undefined

      const rawImages: Array<{ url: string; alt?: string }> = Array.isArray(doc.images)
        ? doc.images
            .map((item: any) => {
              const url = extractMediaUrl(item.image)
              if (!url) return null
              return {
                url,
                alt: item.alt || item.image?.alt || doc.title,
              }
            })
            .filter(Boolean)
        : []

      const defaultGalleryMap: Record<string, Array<{ url: string; alt?: string }>> = {
        'lovixa-shampoo': [
          { url: '/images/lovixa-shampoo.jpg', alt: 'LOVIXA Refreshing Shampoo Bottle 200ml' },
          { url: '/images/lovixa-duo.jpg', alt: 'LOVIXA Shampoo and Hair Oil Pair' },
          { url: '/images/lovixa-insta-4.jpg', alt: 'LOVIXA Shampoo Gentle Foaming Lather' },
        ],
        'lovixa-hair-oil': [
          { url: '/images/lovixa-hairoil.jpg', alt: 'LOVIXA Nourishing Hair Oil Bottle 100ml' },
          { url: '/images/lovixa-duo.jpg', alt: 'LOVIXA Hair Oil with Shampoo' },
          { url: '/images/lovixa-insta-1.jpg', alt: 'LOVIXA Hair Oil Botanical Formulation' },
        ],
        'lovixa-hair-care-duo': [
          { url: '/images/lovixa-duo.jpg', alt: 'LOVIXA Complete Hair Care Duo' },
          { url: '/images/lovixa-shampoo.jpg', alt: 'LOVIXA Shampoo 200ml' },
          { url: '/images/lovixa-hairoil.jpg', alt: 'LOVIXA Hair Oil 100ml' },
        ],
      }

      const images = rawImages.length > 0
        ? rawImages
        : defaultGalleryMap[doc.slug] || [{ url: '/images/lovixa-hero-banner-products.jpg', alt: doc.title }]

      const variants: StorefrontVariant[] = Array.isArray(doc.variants)
        ? doc.variants
            .map((v: any) => {
              if (typeof v !== 'object' || v === null) return null
              const isSingleVariant = !doc.hasVariants || doc.variants.length <= 1
              const variantPrice = isSingleVariant
                ? (typeof doc.basePrice === 'number' ? doc.basePrice : (typeof v.price === 'number' ? v.price : 0))
                : (typeof v.price === 'number' ? v.price : doc.basePrice || 0)
              const variantCompareAt = isSingleVariant
                ? (typeof doc.compareAtPrice === 'number' ? doc.compareAtPrice : v.compareAtPrice)
                : (typeof v.compareAtPrice === 'number' ? v.compareAtPrice : doc.compareAtPrice)

              return {
                id: String(v.id),
                sku: v.sku || String(v.id),
                title: v.title || 'Standard',
                price: variantPrice,
                compareAtPrice: variantCompareAt,
                inventory: typeof v.inventory === 'number' ? v.inventory : 10,
                options: Array.isArray(v.options) ? v.options : [],
              }
            })
            .filter(Boolean)
        : []

      const relatedProducts: StorefrontProduct[] = Array.isArray(doc.relatedProducts)
        ? doc.relatedProducts
            .map((r: any) => {
              if (typeof r !== 'object' || r === null) return null
              return {
                id: String(r.id),
                title: r.title,
                slug: r.slug,
                price: typeof r.basePrice === 'number' ? r.basePrice : 0,
                compareAtPrice: r.compareAtPrice,
                image: extractMediaUrl(r.images?.[0]?.image),
                rating: 5.0,
                reviewCount: 38,
              }
            })
            .filter(Boolean)
        : []

      return {
        id: String(doc.id),
        title: doc.title || 'Untitled Product',
        slug: doc.slug,
        price: typeof doc.basePrice === 'number' ? doc.basePrice : 0,
        compareAtPrice: typeof doc.compareAtPrice === 'number' ? doc.compareAtPrice : undefined,
        brand: brandName,
        rating: 4.9,
        reviewCount: 38,
        shortDescription: doc.shortDescription,
        description: doc.description,
        stock: typeof doc.stock === 'number' ? doc.stock : 100,
        isPublished: doc.isPublished ?? true,
        size: doc.size,
        images,
        variants,
        actives: doc.actives,
        ritualSteps: doc.ritualSteps,
        benefits: doc.benefits,
        ingredients: doc.ingredients,
        caution: doc.caution,
        categoryAttributes: doc.categoryAttributes,
        relatedProducts,
        seo: doc.seo,
      }
    }
  } catch (error) {
    console.error(`Error fetching product by slug (${slug}) from Payload:`, error)
  }

    // Fallback to rich cosmetics catalog detail
    const { COSMETIC_PRODUCT_DETAILS } = await import('@/lib/constants/cosmetics-catalog')
    return COSMETIC_PRODUCT_DETAILS[slug] || null
  })
})

export const getStorefrontCategories = cache(async function getStorefrontCategories(): Promise<StorefrontCategory[]> {
  return withCmsCache('categories_all', async () => {
    try {
      const payload = await getPayloadCached()
      const result = await payload.find({
        collection: 'categories',
        depth: 2,
        limit: 100,
        overrideAccess: true,
      })

      if (result.docs && result.docs.length > 0) {
        return result.docs.map((doc: any) => ({
          id: String(doc.id),
          name: doc.name,
          slug: doc.slug,
          description: doc.description,
          badge: doc.badge,
          image: extractMediaUrl(doc.image),
          attributes: doc.attributes,
          seo: doc.seo,
        }))
      }
    } catch (error) {
      console.error('Error fetching categories from Payload:', error)
    }

    // Fallback to rich cosmetics categories
    const { COSMETIC_CATEGORIES } = await import('@/lib/constants/cosmetics-catalog')
    return COSMETIC_CATEGORIES.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      badge: c.tag,
      itemCount: c.itemCount,
      image: c.image,
    }))
  })
})

export const getStorefrontCategoryBySlug = cache(async function getStorefrontCategoryBySlug(slug: string): Promise<StorefrontCategory | null> {
  const categories = await getStorefrontCategories()
  return categories.find((c) => c.slug === slug) || null
})

export const getStorefrontHomepage = cache(async function getStorefrontHomepage(): Promise<StorefrontHomepageData> {
  return withCmsCache('homepage_global', async () => {
    let globalDoc: any = null
    try {
      const payload = await getPayloadCached()
      globalDoc = await payload.findGlobal({
        slug: 'homepage',
        depth: 2,
        overrideAccess: true,
      })
    } catch (error) {
      console.error('Error fetching homepage global from Payload:', error)
    }

  // 1. Hero Slides
  const heroSlides: StorefrontHeroSlide[] =
    globalDoc && Array.isArray(globalDoc.heroSlides) && globalDoc.heroSlides.length > 0
      ? globalDoc.heroSlides.map((s: any) => ({
          badge: s.badge || 'AYURVEDIC BOTANICAL SCIENCE',
          heading: s.heading || 'Embrace Your Natural Beauty',
          highlightHeading: s.highlightHeading || 'Everyday Hair Care Essentials',
          subheading: s.subheading || 'Thoughtfully crafted with time-tested botanical oils and clarifying plant extracts for soft, resilient, naturally radiant hair.',
          ctaText: s.ctaText || 'EXPLORE OUR RITUALS',
          ctaLink: s.ctaLink || '/products',
          secondaryCtaText: s.secondaryCtaText || 'OUR BOTANICAL PHILOSOPHY',
          secondaryCtaLink: s.secondaryCtaLink || '/about',
          image: extractMediaUrl(s.image) || s.imageUrl || '/images/lovixa-hero-banner-products.jpg',
          imageUrl: s.imageUrl || '/images/lovixa-hero-banner-products.jpg',
        }))
      : [
          {
            badge: 'AYURVEDIC BOTANICAL SCIENCE',
            heading: 'Embrace Your Natural Beauty',
            highlightHeading: 'Everyday Hair Care Essentials',
            subheading: 'Thoughtfully crafted with time-tested botanical oils and clarifying plant extracts for soft, resilient, naturally radiant hair.',
            ctaText: 'EXPLORE OUR RITUALS',
            ctaLink: '/products',
            secondaryCtaText: 'OUR BOTANICAL PHILOSOPHY',
            secondaryCtaLink: '/about',
            imageUrl: '/images/lovixa-hero-banner-products.jpg',
          },
          {
            badge: 'COLD-PRESSED ELIXIRS',
            heading: 'Nourishing Hair Oil & Shampoo',
            highlightHeading: 'Root-to-Tip Rejuvenation',
            subheading: 'Experience the pure goodness of cold-pressed botanicals formulated to nourish hair strands and calm the scalp.',
            ctaText: 'SHOP THE COLLECTION',
            ctaLink: '/products',
            secondaryCtaText: 'VIEW RITUAL DUO',
            secondaryCtaLink: '/products/lovixa-hair-care-duo',
            imageUrl: '/images/lovixa-hero-banner-model.jpg',
          },
        ]

  // Helper to upgrade legacy Wellness Shop copy to elevated LOVIXA brand copy
  const cleanTitle = (val: string | undefined, legacy: string[], brandDefault: string) => {
    if (!val || legacy.includes(val.trim())) return brandDefault
    return val
  }

  // 2. Why Choose Us -> The LOVIXA Purity Standard
  const whyChooseUs: StorefrontWhyChooseData = {
    heading: cleanTitle(globalDoc?.whyChooseUs?.heading, ['Why LOVIXA?', 'Why LOVIXA'], 'The LOVIXA Purity Standard'),
    subtitle: cleanTitle(
      globalDoc?.whyChooseUs?.subtitle,
      ['Thoughtfully crafted Ayurvedic hair essentials made with botanical integrity'],
      'Time-honored Ayurvedic wisdom married with modern clean cosmetic science — uncompromised botanical integrity'
    ),
    pillars:
      globalDoc?.whyChooseUs?.pillars && Array.isArray(globalDoc.whyChooseUs.pillars) && globalDoc.whyChooseUs.pillars.length > 0
        ? globalDoc.whyChooseUs.pillars.map((p: any) => ({
            iconType: p.iconType || 'clean',
            title: p.title,
            desc: p.desc,
          }))
        : [
            {
              iconType: 'clean',
              title: 'CLEAN',
              desc: 'Formulated without harsh sulfates, parabens, or silicones. Gentle, safe & scalp-friendly botanical ingredients.',
            },
            {
              iconType: 'conscious',
              title: 'CONSCIOUS',
              desc: 'Inspired by clean, safe, cruelty-free, and environmentally mindful Ayurvedic practices.',
            },
            {
              iconType: 'effective',
              title: 'EFFECTIVE',
              desc: 'Combines pure Ayurvedic botanicals & modern cosmetic science to deliver visible root-to-tip results.',
            },
          ],
  }

  // 3. Solve Your Concern -> Targeted Rituals for Every Hair Need
  const concernsSection: StorefrontConcernsSectionData = {
    eyebrow: cleanTitle(globalDoc?.concernsSection?.eyebrow, ['SHOP BY CONCERN'], 'TARGETED BOTANICAL CARE'),
    heading: cleanTitle(globalDoc?.concernsSection?.heading, ['Solve Your Concern'], 'Targeted Rituals for Every Hair Need'),
    subtitle: cleanTitle(
      globalDoc?.concernsSection?.subtitle,
      ['Tap one to explore the targeted 2-step Ayurvedic routine'],
      'Select your primary hair goal to explore the dedicated two-step restorative Ayurvedic regimen'
    ),
    concerns:
      globalDoc?.concernsSection?.concerns && Array.isArray(globalDoc.concernsSection.concerns) && globalDoc.concernsSection.concerns.length > 0
        ? globalDoc.concernsSection.concerns.map((c: any) => ({
            id: c.concernId || c.id || 'concern',
            title: c.title,
            subtitle: c.subtitle || '2 products • Full Duo Routine',
            image: extractMediaUrl(c.image) || c.imageUrl || '/images/concern-hairfall.jpg',
            routineTitle: c.routineTitle || `${c.title} Routine`,
            routineDesc: c.routineDesc || 'Customized botanical routine for optimal scalp and strand wellness.',
            steps: Array.isArray(c.steps) ? c.steps.map((st: any) => (typeof st === 'string' ? st : st.stepText)) : [],
            productTitle: c.productTitle || 'LOVIXA Hair Care Duo (Shampoo + Oil)',
            productImage: extractMediaUrl(c.productImage) || c.productImageUrl || '/images/lovixa-duo.jpg',
            price: typeof c.price === 'number' && c.price >= 100 ? c.price : 549,
            compareAtPrice: typeof c.compareAtPrice === 'number' && c.compareAtPrice >= 100 ? c.compareAtPrice : 699,
            slug: c.slug || 'lovixa-hair-care-duo',
            productId: c.productId || 'prod_duo',
          }))
        : [
            {
              id: 'hair-fall',
              title: 'Hair Fall & Breakage',
              subtitle: '2 products • Full Duo Routine',
              image: '/images/concern-hairfall.jpg',
              routineTitle: 'Root Strengthening & Anti-Breakage Routine',
              routineDesc: 'Formulated with Bhringraj, Rosemary & Botanical extracts to reinforce weak follicles, reduce shower fall, and strengthen strand tensile grip.',
              steps: [
                'Step 1: Warm 4-5 drops of Hair Oil and gently massage into scalp roots for 10 minutes.',
                'Step 2: Wash with LOVIXA Refreshing Shampoo to cleanse without stripping natural oils.',
                'Step 3: Repeat 3x weekly for visible density and reduced breakage within 21 days.',
              ],
              productTitle: 'LOVIXA Hair Care Duo (Shampoo + Oil)',
              productImage: '/images/lovixa-duo.jpg',
              price: 549,
              compareAtPrice: 699,
              slug: 'lovixa-hair-care-duo',
              productId: 'prod_duo',
            },
            {
              id: 'dandruff-scalp',
              title: 'Dandruff & Flakes',
              subtitle: '2 products • Full Duo Routine',
              image: '/images/concern-dandruff.jpg',
              routineTitle: 'Scalp Balancing & Flake Relief Routine',
              routineDesc: 'Deeply clears micro-buildup and soothes itchy, dry flakes while balancing the scalp microbiome with gentle botanical surfactants.',
              steps: [
                'Step 1: Pre-wash scalp soothing with lightweight Botanical Hair Oil 20 mins prior.',
                'Step 2: Lather LOVIXA Shampoo into scalp focusing on crown and temples.',
                'Step 3: Rinse with lukewarm water to reveal a clean, refreshed, breathable scalp.',
              ],
              productTitle: 'LOVIXA Hair Care Duo (Shampoo + Oil)',
              productImage: '/images/lovixa-duo.jpg',
              price: 549,
              compareAtPrice: 699,
              slug: 'lovixa-hair-care-duo',
              productId: 'prod_duo',
            },
            {
              id: 'dry-frizzy',
              title: 'Dry & Frizzy Hair',
              subtitle: '2 products • Full Duo Routine',
              image: '/images/concern-frizzy.jpg',
              routineTitle: 'Hydration Locking & Frizz Control Routine',
              routineDesc: 'Seals moisture directly into coarse, open cuticles to tame humidity flyaways and restore touchable, bouncy softness.',
              steps: [
                'Step 1: Cleanse with LOVIXA Botanical Shampoo for gentle hydration.',
                'Step 2: On damp ends, apply 2 drops of Hair Oil as a lightweight leave-in serum.',
                'Step 3: Air dry or blow dry on cool setting for smooth, mirror-like gloss.',
              ],
              productTitle: 'LOVIXA Hair Care Duo (Shampoo + Oil)',
              productImage: '/images/lovixa-duo.jpg',
              price: 549,
              compareAtPrice: 699,
              slug: 'lovixa-hair-care-duo',
              productId: 'prod_duo',
            },
            {
              id: 'damaged-splitends',
              title: 'Damaged & Split Ends',
              subtitle: '2 products • Full Duo Routine',
              image: '/images/concern-splitends.jpg',
              routineTitle: 'Intense Cuticle Repair Routine',
              routineDesc: 'Deep lipid restoration for heat-treated and chemically stressed strands, binding frayed split ends and preventing future friction damage.',
              steps: [
                'Step 1: Overnight deep saturation of mid-lengths to ends with Cold-Pressed Hair Oil.',
                'Step 2: Morning rinse with sulfate-free LOVIXA Shampoo to preserve natural keratin.',
                'Step 3: Enjoy noticeably softer, tangle-free ends with zero brittleness.',
              ],
              productTitle: 'LOVIXA Hair Care Duo (Shampoo + Oil)',
              productImage: '/images/lovixa-duo.jpg',
              price: 549,
              compareAtPrice: 699,
              slug: 'lovixa-hair-care-duo',
              productId: 'prod_duo',
            },
          ],
  }

  // 4. Promo Banner (Signature Ceremony Duo)
  const promoBanner: StorefrontPromoBannerData = {
    sectionTitle: cleanTitle(globalDoc?.promoBanner?.sectionTitle, ['The Complete Hair Care Duo'], 'The Essential Scalp & Strand Ritual Duo'),
    sectionSubtitle: cleanTitle(
      globalDoc?.promoBanner?.sectionSubtitle,
      ['Pair our Botanical Shampoo & Nourishing Hair Oil for clarifying scalp freshness and all-day frizz control'],
      'Combine our Botanical Cleanser and Cold-Pressed Scalp Elixir for lasting flake defense, root strength, and mirror gloss'
    ),
    badge: cleanTitle(globalDoc?.promoBanner?.badge, ['SAVE 15% COMBO DEAL', 'SAVE 15%'], 'SIGNATURE CEREMONY SET'),
    ritualTitle: cleanTitle(globalDoc?.promoBanner?.ritualTitle, ['2-STEP DAILY RITUAL'], 'TWO-STEP RESTORATIVE CEREMONY'),
    productTitle: globalDoc?.promoBanner?.productTitle || 'Botanical Shampoo (200ml) + Hair Oil (100ml)',
    description: globalDoc?.promoBanner?.description || 'The ultimate Ayurvedic hair ritual. Deeply purifies scalp pores with gentle plant surfactants while locking in root nutrients for lasting softness and hair fall resistance.',
    features:
      globalDoc?.promoBanner?.features && Array.isArray(globalDoc.promoBanner.features) && globalDoc.promoBanner.features.length > 0
        ? globalDoc.promoBanner.features.map((f: any) => (typeof f === 'string' ? f : f.text))
        : [
            'Gentle daily cleanse maintains natural scalp moisture barrier',
            'Cold-pressed Bhringraj & Rosemary strengthen follicle grip',
            '100% Ayurvedic • Zero Sulfates • Dermatologically Approved',
          ],
    offerPrice: typeof globalDoc?.promoBanner?.offerPrice === 'number' ? globalDoc.promoBanner.offerPrice : 549,
    comparePrice: typeof globalDoc?.promoBanner?.comparePrice === 'number' ? globalDoc.promoBanner.comparePrice : 699,
    discountTag: globalDoc?.promoBanner?.discountTag || 'Save 21%',
    ctaText: globalDoc?.promoBanner?.ctaText || 'ADD COMPLETE DUO TO BAG',
    ctaLink: globalDoc?.promoBanner?.ctaLink || '/products/lovixa-hair-care-duo',
    image: extractMediaUrl(globalDoc?.promoBanner?.image) || globalDoc?.promoBanner?.imageUrl || '/images/lovixa-duo.jpg',
    freeShippingText: '',
    trustText: globalDoc?.promoBanner?.trustText || '100% Authentic Ayurvedic',
  }

  // 5. Real Experience Reels -> Real Rituals, Visible Transformations
  const realExperience: StorefrontRealExperienceData = {
    heading: cleanTitle(globalDoc?.realExperience?.heading, ['Real Experience'], 'Real Rituals, Visible Transformations'),
    subtitle: cleanTitle(
      globalDoc?.realExperience?.subtitle,
      ['Real customers sharing their unfiltered Ayurvedic hair transformations'],
      'Authentic hair journeys, daily rituals, and unfiltered results shared by our loyal community'
    ),
    reels:
      globalDoc?.realExperience?.reels && Array.isArray(globalDoc.realExperience.reels) && globalDoc.realExperience.reels.length > 0
        ? globalDoc.realExperience.reels.map((r: any, idx: number) => ({
            id: r.id || `reel_${idx + 1}`,
            title: r.title,
            customerName: r.customerName,
            views: r.views || '2.5k',
            videoThumbnail: extractMediaUrl(r.thumbnail) || r.thumbnailUrl || '/images/reel-1.jpg',
            productTitle: r.productTitle,
            productImage: extractMediaUrl(r.productImage) || r.productImageUrl || '/images/lovixa-shampoo.jpg',
            productSlug: r.productSlug || 'lovixa-shampoo',
            price: typeof r.price === 'number' ? r.price : 299,
            compareAtPrice: typeof r.compareAtPrice === 'number' ? r.compareAtPrice : 399,
            discount: r.discount || '25% OFF',
          }))
        : [
            {
              id: 'reel_1',
              title: 'My 14-Day Shampoo Transformation',
              customerName: 'Priya S., Mumbai',
              views: '2.5k',
              videoThumbnail: '/images/reel-1.jpg',
              productTitle: 'LOVIXA Botanical Refreshing Shampoo',
              productImage: '/images/lovixa-shampoo.jpg',
              productSlug: 'lovixa-shampoo',
              price: 299,
              compareAtPrice: 399,
              discount: '25% OFF',
            },
            {
              id: 'reel_2',
              title: 'How I Apply Hair Oil for Root Growth',
              customerName: 'Ananya M., Delhi',
              views: '3.8k',
              videoThumbnail: '/images/reel-2.jpg',
              productTitle: 'LOVIXA 14 Herbs Rosemary Hair Oil (100ml)',
              productImage: '/images/lovixa-hairoil.jpg',
              productSlug: 'lovixa-hair-oil',
              price: 299,
              compareAtPrice: 399,
              discount: '25% OFF',
            },
            {
              id: 'reel_3',
              title: 'Say Goodbye to Frizz & Scalp Flakes',
              customerName: 'Kavita R., Ahmedabad',
              views: '1.9k',
              videoThumbnail: '/images/lovixa-insta-1.jpg',
              productTitle: 'LOVIXA Complete Hair Care Duo Set',
              productImage: '/images/lovixa-duo.jpg',
              productSlug: 'lovixa-hair-care-duo',
              price: 549,
              compareAtPrice: 699,
              discount: '21% OFF',
            },
            {
              id: 'reel_4',
              title: 'The Best Ayurvedic Scalp Massage Ritual',
              customerName: 'Sneha P., Bengaluru',
              views: '4.2k',
              videoThumbnail: '/images/lovixa-insta-2.jpg',
              productTitle: 'LOVIXA 14 Herbs Rosemary Hair Oil (100ml)',
              productImage: '/images/lovixa-hairoil.jpg',
              productSlug: 'lovixa-hair-oil',
              price: 299,
              compareAtPrice: 399,
              discount: '25% OFF',
            },
            {
              id: 'reel_5',
              title: 'Unboxing My Daily Essentials Kit',
              customerName: 'Rhea D., Pune',
              views: '2.1k',
              videoThumbnail: '/images/lovixa-insta-3.jpg',
              productTitle: 'LOVIXA Hair Care Duo (200ml Shampoo + 100ml Oil)',
              productImage: '/images/lovixa-duo.jpg',
              productSlug: 'lovixa-hair-care-duo',
              price: 549,
              compareAtPrice: 699,
              discount: '21% OFF',
            },
          ],
  }

  // 6. Category Pedestals -> Thoughtfully Formulated For Every Strand
  const categoryPedestals: StorefrontCategoryPedestalsData = {
    heading: cleanTitle(globalDoc?.categoryPedestals?.heading, ['Beyond One Kind Of Care'], 'Thoughtfully Formulated For Every Strand'),
    subtitle: cleanTitle(
      globalDoc?.categoryPedestals?.subtitle,
      ['Handpicked solutions for every hair type and daily care ritual'],
      'From clarifying washes to cold-pressed scalp oils, discover the purposeful rituals crafted for your hair'
    ),
    cards:
      globalDoc?.categoryPedestals?.cards && Array.isArray(globalDoc.categoryPedestals.cards) && globalDoc.categoryPedestals.cards.length > 0
        ? globalDoc.categoryPedestals.cards.map((c: any) => ({
            tag: cleanTitle(c.tag, ['BEYOND ONE OPTION!'], 'LOVIXA ESSENTIAL'),
            title: c.title,
            subtitle: c.subtitle,
            image: extractMediaUrl(c.image) || c.imageUrl || '/images/lovixa-hero-banner-products.jpg',
            href: c.href || '/products',
          }))
        : [
            {
              tag: 'LOVIXA ESSENTIAL',
              title: 'HAIR CARE',
              subtitle: '10+ CONCERN BASED HAIR-CARE PRODUCTS',
              image: '/images/lovixa-hero-banner-products.jpg',
              href: '/products',
            },
            {
              tag: 'LOVIXA ESSENTIAL',
              title: 'HAIR OILS',
              subtitle: 'COLD-PRESSED NUTRIENT RICH SCALP ELIXIRS',
              image: '/images/lovixa-hairoil.jpg',
              href: '/products/lovixa-hair-oil',
            },
            {
              tag: 'LOVIXA ESSENTIAL',
              title: 'SHAMPOOS',
              subtitle: 'GENTLE BOTANICAL PURIFYING CLEANSERS',
              image: '/images/lovixa-shampoo.jpg',
              href: '/products/lovixa-shampoo',
            },
            {
              tag: 'LOVIXA ESSENTIAL',
              title: 'COMBOS',
              subtitle: 'COMPLETE 2-STEP VALUE RITUAL KITS',
              image: '/images/lovixa-duo.jpg',
              href: '/products/lovixa-hair-care-duo',
            },
          ],
  }

  // 7. Brand Story (Heritage & Seals)
  const brandStory: StorefrontBrandStoryData = {
    heading: cleanTitle(globalDoc?.brandStory?.heading, ['The LOVIXA Philosophy'], 'The LOVIXA Botanical Heritage'),
    storyText:
      globalDoc?.brandStory?.storyText ||
      'At LOVIXA, we believe your hair care goes beyond what you see in the mirror — and deserves mindful self-care that goes deeper to the roots. We bring you thoughtful, time-honored Ayurvedic botanical solutions that nurture your scalp with trust, cold-pressed purity, and dermatologically tested clinical efficacy.',
    seals:
      globalDoc?.brandStory?.seals && Array.isArray(globalDoc.brandStory.seals) && globalDoc.brandStory.seals.length > 0
        ? globalDoc.brandStory.seals.map((s: any) => ({
            iconType: s.iconType || 'leaf',
            title: s.title,
            subtitle: s.subtitle,
            desc: s.desc,
          }))
        : [
            {
              iconType: 'leaf',
              title: '100% Ayurvedic',
              subtitle: 'Cold-Pressed Herbs',
              desc: 'Pure extracts of Bhringraj, Amla & Rosemary brewed naturally.',
            },
            {
              iconType: 'award',
              title: 'AYUSH Certified',
              subtitle: 'Lab-Tested Purity',
              desc: 'Adheres to stringent quality and botanical standardization protocols.',
            },
            {
              iconType: 'shield',
              title: 'Dermatologist Safe',
              subtitle: 'Zero Harsh Sulfates',
              desc: 'Free of SLS/SLES, parabens & synthetic silicones for sensitive scalps.',
            },
            {
              iconType: 'heart',
              title: '100% Cruelty-Free',
              subtitle: 'Vegan & Ethical',
              desc: 'Crafted with respect for nature. Never tested on animals.',
            },
          ],
  }

  // 8. FAQs -> Hair Ritual & Care Guidance
  const faqs: StorefrontFAQsData = {
    heading: cleanTitle(globalDoc?.faqs?.heading, ['Frequently Asked Questions'], 'Hair Ritual & Care Guidance'),
    subtitle: cleanTitle(
      globalDoc?.faqs?.subtitle,
      ['Everything you need to know about our ingredients, rituals & shipping'],
      'Everything you need to know about our botanical sourcing, usage rituals, and mindful delivery'
    ),
    items:
      globalDoc?.faqs?.items && Array.isArray(globalDoc.faqs.items) && globalDoc.faqs.items.length > 0
        ? globalDoc.faqs.items.map((f: any) => ({
            question: f.question,
            answer: f.answer,
          }))
        : [
            {
              question: 'Is LOVIXA Shampoo suitable for all hair types?',
              answer: 'LOVIXA Botanical Shampoo is crafted with pure botanical extracts for natural hair care and root wellness. Important Note: It is NOT suitable for chemically treated hair such as Keratin, Cysteine, or Chemical Smoothening/Straightening treatments. For all natural and untreated hair types, it gently cleanses without stripping natural oils.',
            },
            {
              question: 'How should I use the Hair Oil and Shampoo in my weekly routine?',
              answer: 'There is no strict 30-minute limit. You can apply LOVIXA Hair Oil whenever you like—even applying it at night and sleeping with it on for deep overnight nourishment. Whenever applying oil, gently massage into your scalp and hair roots. Wash your hair on alternate days (every other day / એક મૂકીને એક દિવસે) with LOVIXA Botanical Refreshing Shampoo.',
            },
            {
              question: 'What are the shipping charges and delivery timelines across India?',
              answer: 'We provide reliable Pan-India delivery with live tracking. Orders are packed within 24 to 48 business hours from our certified botanical facility and usually reach your doorstep in 3 to 5 business days with full tracking.',
            },
            {
              question: 'Are LOVIXA products 100% cruelty-free and vegan?',
              answer: 'Absolutely. We do not conduct animal testing at any stage of product research, formulation, or manufacturing. Every product is 100% vegan, cruelty-free, and adheres to ethical Ayurvedic standards.',
            },
          ],
  }

  // 9. Community -> Moments of Botanical Self-Care
  const community: StorefrontCommunityData = {
    heading: cleanTitle(globalDoc?.community?.heading, ['Follow @lovixa_cosmetic'], 'Moments of Botanical Self-Care'),
    subtitle: cleanTitle(
      globalDoc?.community?.subtitle,
      ['Tag us in your daily hair rituals for a chance to be featured on our official feed'],
      'Share your daily hair ceremonies and tag @lovixa_cosmetic to be featured in our botanical gallery'
    ),
    vipBadge: cleanTitle(globalDoc?.community?.vipBadge, ['LOVIXA VIP RITUAL CLUB'], 'THE LOVIXA PRIVILEGE CIRCLE'),
    vipTitle: cleanTitle(globalDoc?.community?.vipTitle, ['Get 15% Off Your First Order'], 'Join Our Community for Exclusive Offers'),
    vipSubtitle: globalDoc?.community?.vipSubtitle || 'Connect with our official WhatsApp community to receive your personal welcome discount voucher directly on your phone.',
    vipCode: globalDoc?.community?.vipCode || '',
    galleryImages:
      globalDoc?.community?.galleryImages && Array.isArray(globalDoc.community.galleryImages) && globalDoc.community.galleryImages.length > 0
        ? globalDoc.community.galleryImages.map((g: any) => ({
            image: extractMediaUrl(g.image) || g.imageUrl || '/images/lovixa-insta-1.jpg',
            caption: g.caption || '@lovixa_cosmetic ritual',
          }))
        : [
            { image: '/images/lovixa-insta-1.jpg', caption: 'Ayurvedic Sunday scalp oiling ritual 🌿' },
            { image: '/images/lovixa-insta-2.jpg', caption: 'Clean, glossy bounce without heavy residue ✨' },
            { image: '/images/lovixa-insta-3.jpg', caption: 'Bathroom shelf essentials for healthy roots 🧴' },
            { image: '/images/lovixa-insta-4.jpg', caption: 'Gentle plant lather that respects scalp pH 🫧' },
          ],
  }

    return {
      heroSlides,
      whyChooseUs,
      concernsSection,
      promoBanner,
      realExperience,
      categoryPedestals,
      brandStory,
      faqs,
      community,
    }
  })
})

export const getStorefrontAnnouncementBar = cache(async function getStorefrontAnnouncementBar(): Promise<StorefrontAnnouncementBarData> {
  return withCmsCache('announcement_bar_global', async () => {
    try {
      const payload = await getPayloadCached()
      const globalDoc = await payload.findGlobal({
        slug: 'announcement-bar',
        overrideAccess: true,
      })

      if (globalDoc) {
        return {
          enabled: globalDoc.enabled ?? true,
          messages: Array.isArray(globalDoc.messages) ? globalDoc.messages : [],
          backgroundColor: globalDoc.backgroundColor || '#1F141A',
          textColor: globalDoc.textColor || '#FFFFFF',
        }
      }
    } catch (error) {
      console.error('Error fetching announcement-bar global from Payload:', error)
    }

    return {
      enabled: true,
      messages: [
        { text: 'EXPRESS PAN-INDIA DELIVERY WITH REAL-TIME TRACKING', highlight: 'PAN-INDIA DELIVERY', link: '/products' },
        { text: 'CONNECT WITH US ON WHATSAPP FOR EXCLUSIVE VIP OFFERS & PERSONAL VOUCHERS', highlight: 'VIP OFFERS', link: 'https://wa.me/919712460509?text=Hello%20Lovixa%2C%20I%20would%20like%20to%20receive%20an%20exclusive%20VIP%20discount%20code' },
        { text: '100% PURE BOTANICAL EXTRACTS • CRUELTY-FREE • AYURVEDIC FORMULATION', highlight: '100% BOTANICAL' },
      ],
      backgroundColor: '#1F141A',
      textColor: '#FFFFFF',
    }
  })
})

export const getStorefrontSEOSettings = cache(async function getStorefrontSEOSettings(): Promise<StorefrontSEOSettingsData> {
  return withCmsCache('seo_settings_global', async () => {
    try {
      const payload = await getPayloadCached()
      const globalDoc = await payload.findGlobal({
        slug: 'seo-settings',
        depth: 1,
        overrideAccess: true,
      })

      if (globalDoc) {
        const cleanTitle = (globalDoc.siteTitle && !globalDoc.siteTitle.includes('Coming Soon'))
          ? globalDoc.siteTitle
          : 'LOVIXA COSMETIC | Embrace Your Natural Beauty • Botanical Hair Care'
        const cleanDesc = (globalDoc.defaultMetaDescription && !globalDoc.defaultMetaDescription.includes('launching soon'))
          ? globalDoc.defaultMetaDescription
          : 'Discover LOVIXA Botanical Hair Care Essentials — Refreshing Botanical Shampoo (200ml) & Nourishing Hair Oil (100ml). Thoughtfully formulated with Rosemary, Eucalyptus & Cold-Pressed oils for healthier, radiant hair.'

        return {
          siteTitle: cleanTitle,
          titleSeparator: globalDoc.titleSeparator || '—',
          defaultMetaDescription: cleanDesc,
          keywords: globalDoc.keywords || 'botanical shampoo, nourishing hair oil, sulfate free clarifying shampoo, LOVIXA cosmetic',
          canonicalBaseUrl: globalDoc.canonicalBaseUrl || 'https://www.lovixacosmetic.com',
          googleVerification: globalDoc.googleVerification,
          bingVerification: globalDoc.bingVerification,
          googleAnalyticsId: (globalDoc as any).googleAnalyticsId,
          googleTagManagerId: (globalDoc as any).googleTagManagerId,
          metaPixelId: (globalDoc as any).metaPixelId,
          organization: globalDoc.organization,
        }
      }
    } catch (error) {
      console.error('Error fetching seo-settings global from Payload:', error)
    }

    return {
      siteTitle: 'LOVIXA COSMETIC | Embrace Your Natural Beauty • Botanical Hair Care',
      titleSeparator: '—',
      defaultMetaDescription: 'Discover LOVIXA Botanical Hair Care Essentials — Refreshing Botanical Shampoo (200ml) & Nourishing Hair Oil (100ml). Thoughtfully formulated with Rosemary, Eucalyptus & Cold-Pressed oils for healthier, radiant hair.',
      keywords: 'botanical shampoo, ayurvedic hair oil, sulfate free clarifying shampoo, hair fall control oil, anti-frizz hair ritual, rosemary scalp care, herbal hair cosmetics, LOVIXA cosmetic',
      canonicalBaseUrl: 'https://www.lovixacosmetic.com',
      organization: {
        name: 'LOVIXA COSMETIC',
        legalName: 'LOVIXA COSMETIC',
        contactEmail: 'lovixacosmetic@gmail.com',
        contactPhone: '+91 97124 60509',
        addressCountry: 'IN',
        instagramUrl: 'https://www.instagram.com/lovixa_cosmetic',
        facebookUrl: 'https://www.facebook.com/p/Lovixa-Harbel-Care-61574511437687/',
      },
    }
  })
})

export const getStorefrontPage = cache(async function getStorefrontPage(slug: string): Promise<StorefrontPageData | null> {
  return withCmsCache(`page_${slug}`, async () => {
    try {
      const payload = await getPayloadCached()
      const result = await payload.find({
        collection: 'pages',
        where: {
          slug: { equals: slug },
          isPublished: { equals: true },
        },
        depth: 1,
        limit: 1,
        overrideAccess: true,
      })

      const doc: any = result.docs?.[0]
      if (doc) {
        return {
          id: String(doc.id),
          title: doc.title,
          slug: doc.slug,
          badge: doc.badge,
          subtitle: doc.subtitle,
          headerImage: extractMediaUrl(doc.headerImage),
          content: doc.content,
          seo: doc.seo,
        }
      }
    } catch (error) {
      console.error(`Error fetching page (${slug}) from Payload:`, error)
    }
    return null
  })
})
