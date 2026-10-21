import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getStorefrontProducts } from '@/lib/cms/products'
import { COSMETIC_PRODUCTS } from '@/lib/constants/cosmetics-catalog'
import { ProductsCatalog } from './ProductsCatalog'
import { PageHeaderBanner } from '@/components/common/PageHeaderBanner'

export const metadata: Metadata = {
  title: 'Hair Care Collection — LOVIXA COSMETIC',
  description:
    'Discover LOVIXA Ayurvedic Shampoo (500ml) and Nourishing Hair Oil (50ml). Thoughtfully crafted, nature-inspired hair care essentials.',
}

export default async function ProductsPage() {
  const cmsProducts = await getStorefrontProducts({ limit: 100 })
  const products = cmsProducts.length > 0 ? cmsProducts : COSMETIC_PRODUCTS

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-white">
      <PageHeaderBanner
        breadcrumbs={[
          { label: 'Collections', href: '/products' },
          { label: 'Hair Care' },
        ]}
        badge="BOTANICAL HAIR CARE"
        title="Mindfully Formulated Hair Care,"
        highlightTitle="Pure Ayurvedic Science for Radiant, Resilient Strands"
        subtitle="Thoughtfully crafted with time-tested botanical oils and clarifying plant extracts for soft, resilient, naturally buoyant hair."
        imageSrc="/images/lovixa-hero-banner-model.jpg"
        imageAlt="LOVIXA Hair Care Collection"
        priority
      />

      <Suspense fallback={<div className="py-20 text-center text-xs text-stone-500 font-sans">Loading catalog...</div>}>
        <ProductsCatalog initialProducts={products} />
      </Suspense>
    </div>
  )
}
