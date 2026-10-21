import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getStorefrontProductBySlug,
  getStorefrontProducts,
} from '@/lib/cms/products'
import { COSMETIC_PRODUCT_DETAILS } from '@/lib/constants/cosmetics-catalog'
import { ProductDetailClient } from './ProductDetailClient'
import {
  generateProductJsonLd,
  generateBreadcrumbJsonLd,
} from '@/lib/seo/schema'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const products = await getStorefrontProducts({ limit: 50 })
  return products.map((p) => ({
    slug: p.slug,
  }))
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  let product = await getStorefrontProductBySlug(slug)

  if (!product) {
    product = COSMETIC_PRODUCT_DETAILS[slug] || null
  }

  if (!product) {
    return {
      title: 'Product Not Found — LOVIXA COSMETIC',
      description: 'The requested product could not be found.',
    }
  }

  const title =
    product.seo?.metaTitle ||
    `${product.title} — LOVIXA COSMETIC`
  const description =
    product.seo?.metaDescription ||
    product.shortDescription ||
    `Shop ${product.title} at LOVIXA COSMETIC. Premium botanical formulation crafted with pure herbal oils.`

  const images =
    product.images && product.images.length > 0
      ? [{ url: product.images[0].url, alt: product.title }]
      : undefined

  return {
    title,
    description,
    keywords: product.seo?.focusKeywords,
    openGraph: {
      title,
      description,
      images,
      type: 'website',
      url: `https://lovixacosmetic.com/products/${slug}`,
    },
    alternates: {
      canonical:
        product.seo?.canonicalUrl ||
        `https://lovixacosmetic.com/products/${slug}`,
    },
    robots: {
      index: !product.seo?.noIndex,
      follow: true,
    },
  }
}

export default async function ProductDetailPage({ params }: Args) {
  const { slug } = await params
  let product = await getStorefrontProductBySlug(slug)

  if (!product) {
    product = COSMETIC_PRODUCT_DETAILS[slug] || null
  }

  if (!product) {
    notFound()
  }

  const productUrl = `https://lovixacosmetic.com/products/${slug}`
  const imageUrls = product.images?.map((img) => img.url) || []

  const productJsonLd = generateProductJsonLd({
    title: product.title,
    description: product.shortDescription || product.title,
    images: imageUrls,
    sku: product.variants?.[0]?.sku || product.slug,
    price: product.price,
    currency: 'INR',
    availability: (product.stock ?? 50) > 0 ? 'InStock' : 'OutOfStock',
    brandName: product.brand || 'LOVIXA COSMETIC',
    ratingValue: product.rating || 4.9,
    reviewCount: product.reviewCount || 38,
    url: productUrl,
  })

  const breadcrumbsJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', item: 'https://lovixacosmetic.com' },
    { name: 'Shop All', item: 'https://lovixacosmetic.com/products' },
    { name: product.title, item: productUrl },
  ])

  return (
    <>
      {/* Schema.org Product & Breadcrumbs Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      <ProductDetailClient product={product} />
    </>
  )
}
