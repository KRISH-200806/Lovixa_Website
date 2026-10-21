'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { ProductCard } from '@/components/products/ProductCard'
import {
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  X,
  Search,
  LayoutGrid,
  Grid2X2,
  Grid3X3,
  RotateCcw,
} from 'lucide-react'
import type { StorefrontProduct } from '@/lib/cms/products'

interface FilterState {
  searchQuery: string
  availability: string[]
  concerns: string[]
  hairTypes: string[]
  formats: string[]
  maxPrice: number
}

const CONCERN_OPTIONS = [
  'Hair Fall Control',
  'Dandruff & Flake Relief',
  'Dry & Frizzy Hair',
  'Daily Gentle Cleansing',
  'Root Nourishment',
]

const HAIR_TYPE_OPTIONS = [
  'All Hair Types',
  'Dry & Damaged Hair',
  'Thinning & Weak Roots',
  'Color & Chemically Treated',
]

const FORMAT_OPTIONS = [
  'Botanical Shampoo',
  'Nourishing Hair Oil',
  'Hair Care Combo Set',
]

export function ProductsCatalog({
  initialProducts,
}: {
  initialProducts: StorefrontProduct[]
}) {
  const searchParams = useSearchParams()
  const initialCategory = searchParams?.get('category')
  const initialConcern = searchParams?.get('concern')
  const initialQ = searchParams?.get('q')

  const initialFormats = useMemo(() => {
    if (!initialCategory) return []
    if (initialCategory === 'shampoo') return ['Botanical Shampoo']
    if (initialCategory === 'hair-oil') return ['Nourishing Hair Oil']
    if (initialCategory === 'bundles') return ['Hair Care Combo Set']
    return []
  }, [initialCategory])

  const initialConcerns = useMemo(() => {
    if (!initialConcern) return []
    if (initialConcern === 'hair-fall') return ['Hair Fall Control']
    if (initialConcern === 'dandruff') return ['Dandruff & Flake Relief']
    if (initialConcern === 'frizzy') return ['Dry & Frizzy Hair']
    if (initialConcern === 'split-ends') return ['Root Nourishment']
    return []
  }, [initialConcern])

  const [gridCols, setGridCols] = useState<2 | 3 | 4>(4)
  const [sortBy, setSortBy] = useState<string>('featured')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Accordion open/close states
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    availability: true,
    price: true,
    concern: true,
    hairType: true,
    format: true,
  })

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Active filters with INR realistic bounds (₹200 to ₹1,000)
  const [filters, setFilters] = useState<FilterState>(() => ({
    searchQuery: initialQ || '',
    availability: ['in-stock'],
    concerns: initialConcerns,
    hairTypes: [],
    formats: initialFormats,
    maxPrice: 1000,
  }))

  const toggleFilter = (type: 'concerns' | 'hairTypes' | 'formats' | 'availability', value: string) => {
    setFilters((prev) => {
      const currentList = prev[type]
      const exists = currentList.includes(value)
      return {
        ...prev,
        [type]: exists ? currentList.filter((item) => item !== value) : [...currentList, value],
      }
    })
  }

  const resetFilter = (type: keyof FilterState) => {
    setFilters((prev) => ({
      ...prev,
      [type]: type === 'maxPrice' ? 1000 : type === 'searchQuery' ? '' : [],
    }))
  }

  const resetAllFilters = () => {
    setFilters({
      searchQuery: '',
      availability: [],
      concerns: [],
      hairTypes: [],
      formats: [],
      maxPrice: 1000,
    })
  }

  // Filter & sort logic tailored to genuine Lovixa hair care catalog
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        // Search query filter
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase().trim()
          const matchesSearch =
            p.title.toLowerCase().includes(q) ||
            p.slug.toLowerCase().includes(q) ||
            (p.shortDescription && p.shortDescription.toLowerCase().includes(q))
          if (!matchesSearch) return false
        }

        // Price filter (INR)
        if (p.price > filters.maxPrice) return false

        // Concern filter
        if (filters.concerns.length > 0) {
          const matchesAnyConcern = filters.concerns.some((c) => {
            const lc = c.toLowerCase()
            const title = p.title.toLowerCase()
            const desc = (p.shortDescription || '').toLowerCase()
            const slug = p.slug.toLowerCase()

            if (lc.includes('fall')) {
              return title.includes('shampoo') || title.includes('oil') || slug.includes('duo') || desc.includes('fall')
            }
            if (lc.includes('dandruff') || lc.includes('flake')) {
              return title.includes('shampoo') || slug.includes('duo') || desc.includes('dandruff') || desc.includes('scalp')
            }
            if (lc.includes('frizz') || lc.includes('dry')) {
              return title.includes('oil') || slug.includes('duo') || desc.includes('frizz') || desc.includes('shine')
            }
            if (lc.includes('cleansing')) {
              return title.includes('shampoo') || slug.includes('duo') || desc.includes('clean')
            }
            if (lc.includes('nourishment') || lc.includes('root')) {
              return title.includes('oil') || slug.includes('duo') || desc.includes('root') || desc.includes('growth')
            }
            return title.includes(lc) || desc.includes(lc)
          })
          if (!matchesAnyConcern) return false
        }

        // Format filter
        if (filters.formats.length > 0) {
          const matchesAnyFormat = filters.formats.some((f) => {
            const title = p.title.toLowerCase()
            const slug = p.slug.toLowerCase()
            if (f === 'Botanical Shampoo') return title.includes('shampoo') || slug.includes('shampoo')
            if (f === 'Nourishing Hair Oil') return title.includes('oil') || slug.includes('oil')
            if (f === 'Hair Care Combo Set') return title.includes('duo') || slug.includes('duo') || title.includes('combo')
            return true
          })
          if (!matchesAnyFormat) return false
        }

        // Hair Type filter
        if (filters.hairTypes.length > 0) {
          // All LOVIXA formulations are universally suited for all hair types and specifically enriched for damaged/thinning hair
          const matchesHairType = filters.hairTypes.some((ht) => {
            if (ht === 'All Hair Types') return true
            if (ht === 'Dry & Damaged Hair') return true
            if (ht === 'Thinning & Weak Roots') return true
            if (ht === 'Color & Chemically Treated') return !p.title.toLowerCase().includes('chemical')
            return true
          })
          if (!matchesHairType) return false
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price
        if (sortBy === 'price-high') return b.price - a.price
        if (sortBy === 'best-selling') return (b.reviewCount || 0) - (a.reviewCount || 0)
        return 0
      })
  }, [initialProducts, filters, sortBy])

  const gridClass =
    gridCols === 2
      ? 'grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6'
      : gridCols === 3
      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6'
      : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6'

  return (
    <div>
      {/* Editorial Category Summary */}
      <div className="text-center max-w-2xl mx-auto mb-8 px-4">
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
          Pure botanical hair wellness formulated with time-tested Ayurvedic botanicals. Root care, frizz defense, and intensive nourishment for everyday brilliance.
        </p>
      </div>

      {/* Main Catalog Layout (Sidebar Filters + Products Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Filters Sidebar (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-5 pr-4 border-r border-[#E8C4D4]/60">
          
          {/* Search Box in Sidebar */}
          <div className="border-b border-[#E8C4D4]/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2B1822] block mb-2">
              Search Products
            </span>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search shampoo, oil..."
                value={filters.searchQuery}
                onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full pl-8 pr-7 py-1.5 text-xs border border-[#E8C4D4]/80 rounded focus:outline-none focus:border-[#6B2D5C] text-[#2B1822] placeholder:text-stone-400"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => resetFilter('searchQuery')}
                  className="absolute right-2 top-2 text-stone-400 hover:text-stone-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Availability Filter Accordion */}
          <div className="border-b border-[#E8C4D4]/60 pb-4">
            <button
              onClick={() => toggleAccordion('availability')}
              className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#2B1822] py-1 cursor-pointer"
            >
              <span>Availability</span>
              {openAccordions.availability ? (
                <ChevronUp className="w-4 h-4 text-stone-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-stone-500" />
              )}
            </button>

            {openAccordions.availability && (
              <div className="pt-3 space-y-2 text-xs text-stone-700">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => resetFilter('availability')}
                    className="text-[11px] text-[#6B2D5C] hover:underline"
                  >
                    Reset
                  </button>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.availability.includes('in-stock')}
                    onChange={() => toggleFilter('availability', 'in-stock')}
                    className="rounded accent-[#6B2D5C]"
                  />
                  <span>In stock ({filteredProducts.length})</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-stone-400">
                  <input
                    type="checkbox"
                    checked={filters.availability.includes('out-of-stock')}
                    onChange={() => toggleFilter('availability', 'out-of-stock')}
                    className="rounded accent-[#6B2D5C]"
                  />
                  <span>Out of stock (0)</span>
                </label>
              </div>
            )}
          </div>

          {/* Price Range Filter (INR) */}
          <div className="border-b border-[#E8C4D4]/60 pb-4">
            <button
              onClick={() => toggleAccordion('price')}
              className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#2B1822] py-1 cursor-pointer"
            >
              <span>Price Range</span>
              {openAccordions.price ? (
                <ChevronUp className="w-4 h-4 text-stone-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-stone-500" />
              )}
            </button>

            {openAccordions.price && (
              <div className="pt-3 space-y-2 text-xs text-stone-700">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-stone-600">
                    Max: ₹{filters.maxPrice.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => resetFilter('maxPrice')}
                    className="text-[11px] text-[#6B2D5C] hover:underline"
                  >
                    Reset
                  </button>
                </div>
                <input
                  type="range"
                  min="200"
                  max="1000"
                  step="50"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
                  }
                  className="w-full accent-[#6B2D5C] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-stone-500">
                  <span>₹200</span>
                  <span>₹1,000</span>
                </div>
              </div>
            )}
          </div>

          {/* Hair Concern Filter Accordion */}
          <div className="border-b border-[#E8C4D4]/60 pb-4">
            <button
              onClick={() => toggleAccordion('concern')}
              className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#2B1822] py-1 cursor-pointer"
            >
              <span>Hair Concern</span>
              {openAccordions.concern ? (
                <ChevronUp className="w-4 h-4 text-stone-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-stone-500" />
              )}
            </button>

            {openAccordions.concern && (
              <div className="pt-3 space-y-2 text-xs text-stone-700">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => resetFilter('concerns')}
                    className="text-[11px] text-[#6B2D5C] hover:underline"
                  >
                    Reset
                  </button>
                </div>
                {CONCERN_OPTIONS.map((c) => (
                  <label key={c} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.concerns.includes(c)}
                      onChange={() => toggleFilter('concerns', c)}
                      className="rounded accent-[#6B2D5C]"
                    />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Hair Type Filter Accordion */}
          <div className="border-b border-[#E8C4D4]/60 pb-4">
            <button
              onClick={() => toggleAccordion('hairType')}
              className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#2B1822] py-1 cursor-pointer"
            >
              <span>Hair Type</span>
              {openAccordions.hairType ? (
                <ChevronUp className="w-4 h-4 text-stone-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-stone-500" />
              )}
            </button>

            {openAccordions.hairType && (
              <div className="pt-3 space-y-2 text-xs text-stone-700">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => resetFilter('hairTypes')}
                    className="text-[11px] text-[#6B2D5C] hover:underline"
                  >
                    Reset
                  </button>
                </div>
                {HAIR_TYPE_OPTIONS.map((ht) => (
                  <label key={ht} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.hairTypes.includes(ht)}
                      onChange={() => toggleFilter('hairTypes', ht)}
                      className="rounded accent-[#6B2D5C]"
                    />
                    <span>{ht}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Product Format Filter Accordion */}
          <div className="border-b border-[#E8C4D4]/60 pb-4">
            <button
              onClick={() => toggleAccordion('format')}
              className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#2B1822] py-1 cursor-pointer"
            >
              <span>Product Type</span>
              {openAccordions.format ? (
                <ChevronUp className="w-4 h-4 text-stone-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-stone-500" />
              )}
            </button>

            {openAccordions.format && (
              <div className="pt-3 space-y-2 text-xs text-stone-700">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => resetFilter('formats')}
                    className="text-[11px] text-[#6B2D5C] hover:underline"
                  >
                    Reset
                  </button>
                </div>
                {FORMAT_OPTIONS.map((f) => (
                  <label key={f} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.formats.includes(f)}
                      onChange={() => toggleFilter('formats', f)}
                      className="rounded accent-[#6B2D5C]"
                    />
                    <span>{f}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

        </aside>

        {/* Right Products Section (9 cols on desktop) */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Top Bar: Sort Dropdown + Product Count + Grid Switchers */}
          <div className="flex items-center justify-between gap-4 pb-3 border-b border-[#E8C4D4]/60">
            
            {/* Sort By Dropdown */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 border border-[#E8C4D4]/80 rounded text-xs font-bold uppercase tracking-wider text-[#2B1822]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-stone-500 hidden sm:inline">
                  SORT BY:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-[#E8C4D4]/80 rounded px-2.5 py-1.5 text-xs font-medium text-[#2B1822] focus:outline-none focus:border-[#6B2D5C] cursor-pointer bg-white"
                >
                  <option value="featured">Featured</option>
                  <option value="best-selling">Best Selling</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              <span className="text-xs text-stone-500 font-medium">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </span>
            </div>

            {/* Grid Layout Switcher Icons (2, 3, 4 columns) */}
            <div className="hidden sm:flex items-center gap-1.5 text-stone-400">
              <button
                onClick={() => setGridCols(2)}
                className={`p-1.5 rounded transition cursor-pointer flex items-center gap-0.5 text-xs font-bold ${
                  gridCols === 2 ? 'text-[#6B2D5C] bg-[#E8C4D4]/30' : 'hover:text-[#2B1822]'
                }`}
                title="2 Columns"
              >
                <Grid2X2 className="w-4 h-4" />
                <span>2</span>
              </button>
              <button
                onClick={() => setGridCols(3)}
                className={`p-1.5 rounded transition cursor-pointer flex items-center gap-0.5 text-xs font-bold ${
                  gridCols === 3 ? 'text-[#6B2D5C] bg-[#E8C4D4]/30' : 'hover:text-[#2B1822]'
                }`}
                title="3 Columns"
              >
                <Grid3X3 className="w-4 h-4" />
                <span>3</span>
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-1.5 rounded transition cursor-pointer flex items-center gap-0.5 text-xs font-bold ${
                  gridCols === 4 ? 'text-[#6B2D5C] bg-[#E8C4D4]/30' : 'hover:text-[#2B1822]'
                }`}
                title="4 Columns"
              >
                <LayoutGrid className="w-4 h-4" />
                <span>4</span>
              </button>
            </div>

          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length > 0 ? (
            <div className={gridClass}>
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  title={p.title}
                  slug={p.slug}
                  price={p.price}
                  compareAtPrice={p.compareAtPrice}
                  image={p.image}
                  brand={p.brand || 'LOVIXA COSMETIC'}
                  rating={p.rating || 5.0}
                  reviewCount={p.reviewCount || 1240}
                  badge={p.badge || 'B1G1 + FREE GIFT'}
                  shortDescription={p.shortDescription}
                  size={p.size}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-stone-50 rounded-lg border border-[#E8C4D4]/60 p-8 space-y-3">
              <h3 className="font-sans text-base font-bold text-[#2B1822]">
                No hair care products match selected filters
              </h3>
              <p className="text-xs text-stone-500">
                Try resetting your filters to view all available products.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-5 py-2 bg-[#6B2D5C] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#562349] transition cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/50 backdrop-blur-xs">
          <div className="w-4/5 max-w-sm bg-white h-full p-5 overflow-y-auto space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8C4D4]/60">
                <span className="text-sm font-bold uppercase tracking-wider text-[#2B1822]">
                  Filter Products
                </span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-stone-500 hover:text-stone-900 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search */}
              <div>
                <span className="text-xs font-bold uppercase text-[#2B1822] block mb-1">
                  Search
                </span>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                  className="w-full px-3 py-1.5 text-xs border border-[#E8C4D4]/80 rounded focus:outline-none focus:border-[#6B2D5C]"
                />
              </div>

              {/* Mobile Price */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold uppercase text-[#2B1822]">Price Limit</span>
                  <span className="text-xs font-semibold text-[#6B2D5C]">₹{filters.maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="1000"
                  step="50"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
                  className="w-full accent-[#6B2D5C]"
                />
              </div>

              {/* Mobile Product Format */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase text-[#2B1822] block">
                  Product Type
                </span>
                {FORMAT_OPTIONS.map((f) => (
                  <label key={f} className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.formats.includes(f)}
                      onChange={() => toggleFilter('formats', f)}
                      className="rounded accent-[#6B2D5C]"
                    />
                    <span>{f}</span>
                  </label>
                ))}
              </div>

              {/* Mobile Concerns */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase text-[#2B1822] block">
                  Hair Concern
                </span>
                {CONCERN_OPTIONS.map((c) => (
                  <label key={c} className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.concerns.includes(c)}
                      onChange={() => toggleFilter('concerns', c)}
                      className="rounded accent-[#6B2D5C]"
                    />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8C4D4]/60 flex gap-2">
              <button
                onClick={resetAllFilters}
                className="w-1/2 py-2 border border-stone-300 text-xs font-bold uppercase text-stone-700 cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-1/2 py-2 bg-[#6B2D5C] hover:bg-[#562349] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
