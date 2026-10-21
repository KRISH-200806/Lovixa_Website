'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { BrushStroke } from '@/components/ui/BrushStroke'
import type { StorefrontCategoryPedestalsData } from '@/lib/cms/products'

const CATEGORY_CARDS = [
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
]

interface Props {
  data?: StorefrontCategoryPedestalsData
}

export function LovixaCategories({ data }: Props) {
  const heading = data?.heading || 'Thoughtfully Formulated For Every Strand'
  const subtitle =
    data?.subtitle ||
    'From clarifying washes to cold-pressed scalp oils, discover the purposeful rituals crafted for your hair'
  const cards = data?.cards && data.cards.length > 0 ? data.cards : CATEGORY_CARDS

  return (
    <section className="py-12 sm:py-16 bg-[#E8C4D4]/20 relative border-b border-[#E8C4D4]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Botanical Categories Heading */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block relative">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-bold text-[#2B1822] tracking-tight">
              {heading}
            </h2>
            <BrushStroke className="text-[#6B2D5C]" />
          </div>
          <p className="text-xs sm:text-sm text-[#2B1822]/70 mt-2">
            {subtitle}
          </p>
        </div>

        {/* 4 Pedestal Display Banners (The Wellness Shop Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {cards.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="bg-[#FBF6F8] border border-[#E8C4D4]/60 rounded-lg p-5 flex flex-col justify-between group hover:shadow-lg transition-all duration-300 relative overflow-hidden"
            >
              {/* Category Header */}
              <div className="text-center mb-4">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#2B1822] block mb-1">
                  {cat.tag || 'BEYOND ONE OPTION!'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-sans tracking-wide text-[#6B2D5C] group-hover:scale-105 transition-transform">
                  {cat.title}
                </h3>
                <span className="text-[10px] font-bold text-[#2B1822]/70 uppercase tracking-widest block mt-1">
                  {cat.subtitle}
                </span>
              </div>

              {/* Pedestal Photo */}
              <div className="relative aspect-[4/5] w-full rounded overflow-hidden bg-stone-50">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, 25vw"
                />
              </div>

              {/* Explore Link */}
              <div className="pt-3 text-center">
                <span className="text-xs font-bold text-[#2B1822] group-hover:text-[#6B2D5C] transition-colors inline-flex items-center gap-1 uppercase tracking-wider">
                  <span>Explore Range</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
