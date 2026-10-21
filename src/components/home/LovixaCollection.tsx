'use client'

import { ProductCard } from '@/components/products/ProductCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { StorefrontProduct } from '@/lib/cms/products'

const DEFAULT_TOP_PICKS: StorefrontProduct[] = [
  {
    id: 'prod_shampoo',
    slug: 'lovixa-shampoo',
    title: 'LOVIXA Botanical Refreshing Shampoo - 500ml Gentle Scalp Clarifying',
    badge: 'Removes Scalp Flakes In 5 Mins',
    image: '/images/lovixa-shampoo.jpg',
    rating: 5,
    reviewCount: 1420,
    price: 299,
    compareAtPrice: 399,
    size: '500ml Botanical Bottle',
  },
  {
    id: 'prod_oil',
    slug: 'lovixa-hair-oil',
    title: 'LOVIXA Nourishing Hair Oil - 50ml Cold-Pressed Root Strengthening Elixir',
    badge: 'Hair Fall Control & Root Grip',
    image: '/images/lovixa-hairoil.jpg',
    rating: 5,
    reviewCount: 1890,
    price: 299,
    compareAtPrice: 399,
    size: '50ml Cold-Pressed Dropper',
  },
  {
    id: 'prod_duo',
    slug: 'lovixa-hair-care-duo',
    title: 'LOVIXA Complete Hair Care Duo - Shampoo (500ml) + Hair Oil (50ml) Ritual',
    badge: 'Most Loved Duo • Save 21%',
    image: '/images/lovixa-duo.jpg',
    rating: 5,
    reviewCount: 2450,
    price: 549,
    compareAtPrice: 699,
    size: '500ml + 50ml Full Set',
  },
]

export function LovixaCollection({ products }: { products?: StorefrontProduct[] }) {
  const displayProducts = products && products.length > 0 ? products : DEFAULT_TOP_PICKS

  return (
    <section id="collection" className="py-12 sm:py-16 bg-[#FBF6F8] relative border-b border-[#E8C4D4]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="CURATED BOTANICAL COLLECTION"
          title="Signature Botanical Formulations"
          subtitle="Handcrafted Ayurvedic hair care rituals formulated for everyday scalp health and radiant hair"
        />

        {/* Reusable Product Cards Grid (Centered when items don't fill 4 columns) */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mx-auto ${
            displayProducts.length === 1
              ? 'max-w-xs justify-center'
              : displayProducts.length === 2
              ? 'max-w-2xl lg:grid-cols-2 justify-center'
              : displayProducts.length === 3
              ? 'max-w-5xl lg:grid-cols-3 justify-center'
              : 'lg:grid-cols-4'
          }`}
        >
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              slug={product.slug}
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              image={product.image}
              rating={product.rating}
              reviewCount={product.reviewCount}
              badge={product.badge}
              brand={product.brand}
              shortDescription={product.shortDescription}
              size={product.size}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
