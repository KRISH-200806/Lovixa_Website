'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles } from 'lucide-react'
import { COSMETIC_CATEGORIES } from '@/lib/constants/cosmetics-catalog'
import type { StorefrontCategory } from '@/lib/cms/products'

export function CategoryShowcase({ categories }: { categories?: StorefrontCategory[] }) {
  const displayCategories =
    categories && categories.length > 0
      ? categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          tag: c.badge || 'Botanical Care',
          itemCount: c.itemCount || 'Explore Ritual',
          image: c.image || '/images/lovixa-hero-banner-products.jpg',
        }))
      : COSMETIC_CATEGORIES

  return (
    <section className="w-full bg-[#FBF6F8] py-14 sm:py-20 border-b border-[#E8C4D4]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (Centered Luxury Beauty Aesthetic) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12 gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E8C4D4] text-xs font-bold text-[#6B2D5C] mb-2.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Targeted Rituals & Formulations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2B1822] tracking-tight">
              Shop by Category & Ritual
            </h2>
            <p className="text-xs sm:text-sm text-[#2B1822]/75 mt-1.5 max-w-xl font-sans leading-relaxed">
              Explore cold-pressed botanical solutions, clarifying cleansers, and nourishing oils tailored to your daily ritual.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B2D5C] hover:text-[#562349] group self-start sm:self-auto cursor-pointer py-1 border-b border-[#6B2D5C]/30 hover:border-[#6B2D5C] transition-all font-sans"
          >
            <span>View all formulations</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 5-Column Pedestal Cards Grid (Wellness Shop inspiration) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5">
          {displayCategories.map((cat) => (
            <Link
              key={cat.id || cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group relative bg-white hover:bg-[#FBF6F8] border border-[#E8C4D4]/70 hover:border-[#6B2D5C]/50 rounded-3xl p-3 sm:p-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col justify-between overflow-hidden"
            >
              {/* Pedestal Thumbnail with Zoom */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF3F6] shadow-xs border border-[#E8C4D4]/40">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2B1822]/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Label and Count Pill */}
              <div className="pt-3.5 text-center">
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#2B1822] group-hover:text-[#6B2D5C] transition-colors truncate">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-[#2B1822]/60 mt-0.5 truncate font-sans">
                  {cat.tag}
                </p>
                <div className="mt-2.5 inline-block px-3 py-0.5 rounded-full bg-[#E8C4D4]/30 group-hover:bg-[#6B2D5C] border border-[#E8C4D4] group-hover:border-[#6B2D5C] text-[10px] font-bold text-[#6B2D5C] group-hover:text-white transition-colors font-sans">
                  {cat.itemCount}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
