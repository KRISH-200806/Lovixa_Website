'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { ProductCard } from '@/components/products/ProductCard'
import type { StorefrontProduct } from '@/lib/cms/products'

export function CuratedProductTabs({
  products,
}: {
  products: StorefrontProduct[]
}) {
  const [activeTab, setActiveTab] = useState<'all' | 'best-seller' | 'new-arrival' | 'award-winner'>('all')

  const matchingProducts = products.filter((p) => {
    if (activeTab === 'all') return true
    if (activeTab === 'best-seller') {
      return (
        p.badge?.toUpperCase().includes('BEST') ||
        p.slug === 'lovixa-hair-oil' ||
        p.slug === 'lovixa-hair-care-duo'
      )
    }
    if (activeTab === 'new-arrival') {
      return (
        p.badge?.toUpperCase().includes('NEW') ||
        p.badge?.toUpperCase().includes('SPECIAL') ||
        p.slug === 'lovixa-hair-care-duo'
      )
    }
    if (activeTab === 'award-winner') {
      return (
        p.badge?.toUpperCase().includes('AWARD') ||
        p.badge?.toUpperCase().includes('ESSENTIAL') ||
        (p.rating && p.rating >= 4.9)
      )
    }
    return true
  })

  // Prevent empty display if products don't match specific tag
  const displayProducts = matchingProducts.length > 0 ? matchingProducts : products

  return (
    <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#E8C4D4]/50">
      {/* Header with Title and Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E8C4D4] text-xs font-bold text-[#6B2D5C] mb-2.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Beauty Drops</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2B1822] tracking-tight">
            Best Sellers &amp; Signature Formulations
          </h2>
          <p className="text-xs sm:text-sm text-[#2B1822]/75 mt-1 font-sans">
            Clinically verified botanical care crafted to nurture scalp vitality and hair shine.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer font-sans ${
              activeTab === 'all'
                ? 'bg-[#6B2D5C] text-white shadow-md shadow-[#6B2D5C]/20'
                : 'bg-white text-[#2B1822]/70 hover:text-[#6B2D5C] hover:bg-[#FAF3F6] border border-[#E8C4D4]'
            }`}
          >
            All Formulations
          </button>
          <button
            onClick={() => setActiveTab('best-seller')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer font-sans ${
              activeTab === 'best-seller'
                ? 'bg-[#6B2D5C] text-white shadow-md shadow-[#6B2D5C]/20'
                : 'bg-white text-[#2B1822]/70 hover:text-[#6B2D5C] hover:bg-[#FAF3F6] border border-[#E8C4D4]'
            }`}
          >
            Best Sellers
          </button>
          <button
            onClick={() => setActiveTab('new-arrival')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer font-sans ${
              activeTab === 'new-arrival'
                ? 'bg-[#6B2D5C] text-white shadow-md shadow-[#6B2D5C]/20'
                : 'bg-white text-[#2B1822]/70 hover:text-[#6B2D5C] hover:bg-[#FAF3F6] border border-[#E8C4D4]'
            }`}
          >
            Ritual Kits
          </button>
          <button
            onClick={() => setActiveTab('award-winner')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer font-sans ${
              activeTab === 'award-winner'
                ? 'bg-[#6B2D5C] text-white shadow-md shadow-[#6B2D5C]/20'
                : 'bg-white text-[#2B1822]/70 hover:text-[#6B2D5C] hover:bg-[#FAF3F6] border border-[#E8C4D4]'
            }`}
          >
            Award Winners
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {displayProducts.map((prod) => (
          <ProductCard key={prod.id} {...prod} />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 text-center">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-white border border-[#E8C4D4] hover:border-[#6B2D5C] text-[#2B1822] hover:text-[#6B2D5C] font-bold text-xs sm:text-sm rounded-full shadow-xs hover:shadow-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer font-sans"
        >
          <span>Explore Entire Beauty Catalog</span>
          <ArrowRight className="w-4 h-4 text-[#6B2D5C]" />
        </Link>
      </div>
    </section>
  )
}
