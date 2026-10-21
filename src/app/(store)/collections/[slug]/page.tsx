import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getStorefrontCategoryBySlug,
  getStorefrontProducts,
  getStorefrontCategories,
} from '@/lib/cms/products'
import { PageHeaderBanner } from '@/components/common/PageHeaderBanner'
import { ProductsCatalog } from '@/app/(store)/products/ProductsCatalog'
import { generateBreadcrumbJsonLd } from '@/lib/seo/schema'

export async function generateStaticParams() {
  const categories = await getStorefrontCategories()
  return categories.map((cat) => ({
    slug: cat.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = await getStorefrontCategoryBySlug(slug)

  if (!category) {
    return {
      title: 'Collection Not Found — LOVIXA COSMETIC',
      description: 'The requested category could not be found.',
    }
  }

  const title = category.seo?.metaTitle || `${category.name} Collection — LOVIXA COSMETIC`
  const description =
    category.seo?.metaDescription ||
    category.description ||
    `Explore LOVIXA ${category.name}. Nature-inspired botanical hair wellness essentials crafted with pure extracts.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: category.image ? [{ url: category.image }] : undefined,
    },
    alternates: {
      canonical: category.seo?.canonicalUrl || `https://lovixacosmetic.com/collections/${slug}`,
    },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = await getStorefrontCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const products = await getStorefrontProducts({ category: slug, limit: 100 })

  const breadcrumbs = [
    { label: 'Collections', href: '/products' },
    { label: category.name },
  ]

  const breadcrumbsJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', item: 'https://lovixacosmetic.com' },
    { name: 'Collections', item: 'https://lovixacosmetic.com/products' },
    { name: category.name, item: `https://lovixacosmetic.com/collections/${slug}` },
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-white min-h-[70vh]">
      {/* Schema.org Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      {/* Dynamic Category Hero Banner */}
      <PageHeaderBanner
        breadcrumbs={breadcrumbs}
        badge={category.badge || 'LOVIXA BOTANICAL'}
        title={category.name}
        highlightTitle="Thoughtfully Formulated Rituals"
        subtitle={category.description || 'Gentle botanical formulations inspired by nature and backed by wellness science.'}
        imageSrc={category.image || '/images/lovixa-hero-banner-products.jpg'}
        imageAlt={`LOVIXA ${category.name}`}
        priority
      />

      {/* Dynamic Products Catalog */}
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs text-stone-500 font-sans">
            Loading {category.name} collection...
          </div>
        }
      >
        <ProductsCatalog initialProducts={products} />
      </Suspense>
    </div>
  )
}
