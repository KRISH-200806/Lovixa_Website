'use client'

import React, { useState, useMemo } from 'react'
import ProductCard from '@/components/shop/ProductCard'
import { COSMETIC_PRODUCTS } from '@/data/mockCosmetics'

type FilterTab = 'all' | 'bestsellers' | 'new' | 'haircare' | 'lips' | 'skincare'

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  const filteredProducts = useMemo(() => {
    if (activeTab === 'bestsellers') {
      return COSMETIC_PRODUCTS.filter((p) => p.isBestSeller)
    }
    if (activeTab === 'new') {
      return COSMETIC_PRODUCTS.filter((p) => p.isNewArrival)
    }
    if (activeTab === 'haircare') {
      return COSMETIC_PRODUCTS.filter((p) => p.category.slug === 'haircare')
    }
    if (activeTab === 'lips') {
      return COSMETIC_PRODUCTS.filter((p) => p.category.slug === 'lips')
    }
    if (activeTab === 'skincare') {
      return COSMETIC_PRODUCTS.filter((p) => p.category.slug === 'skincare' || p.category.slug === 'sunscreen')
    }
    return COSMETIC_PRODUCTS
  }, [activeTab])

  return (
    <section id="shop-products" className="py-20 bg-background border-b border-brand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-1">
            <span className="font-accent italic text-brand-600 text-body-lg font-normal block">
              Most Loved Formulations
            </span>
            <h2 className="font-heading text-h2 uppercase tracking-wide text-foreground">
              Trending &amp; Best Sellers
            </h2>
            <p className="text-neutral-500 text-body-md font-sans">
              Formulated with skin-loving active ingredients for effortless, lasting beauty.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'bestsellers', label: '🔥 Best Sellers' },
              { id: 'haircare', label: '🌿 Hair & Scalp' },
              { id: 'new', label: '✨ New Arrivals' },
              { id: 'lips', label: 'Lip Colors' },
              { id: 'skincare', label: 'Skincare' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as FilterTab)}
                className={`px-4 py-2 rounded-radius-pill text-body-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-brand-500 text-neutral-0 shadow-elev-1'
                    : 'bg-brand-50 text-foreground border border-brand-200 hover:bg-brand-100 hover:border-brand-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
