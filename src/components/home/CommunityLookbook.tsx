'use client'

import Link from 'next/link'
import { Sparkles, Heart } from 'lucide-react'

function InstagramIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

interface LookbookItem {
  image: string
  handle: string
  tag: string
  productTitle: string
  productSlug: string
}

const LOOKBOOK_ITEMS: LookbookItem[] = [
  {
    image: '/images/hero-luxury-serum.png',
    handle: '@elena.glows',
    tag: '#GlassSkinRitual',
    productTitle: 'Velvet Rose Barrier Repair Serum',
    productSlug: 'velvet-rose-barrier-serum',
  },
  {
    image: '/images/promo-dewy-lip-glaze.png',
    handle: '@claire.atelier',
    tag: '#DewyPlumGlaze',
    productTitle: 'Dewy Peptide Lip Tint — Rich Plum',
    productSlug: 'dewy-peptide-lip-tint-plum',
  },
  {
    image: '/images/cat-botanical-oils.png',
    handle: '@sarah.botanics',
    tag: '#GoldenSqualane',
    productTitle: 'Botanical Radiance Facial Oil',
    productSlug: 'botanical-radiance-facial-oil',
  },
  {
    image: '/images/cat-barrier-creams.png',
    handle: '@chloe.skincare',
    tag: '#CeramideBarrier',
    productTitle: 'Cellular Defense Velvet Barrier Cream',
    productSlug: 'cellular-defense-barrier-cream',
  },
  {
    image: '/images/prod-silk-powder.png',
    handle: '@maya.beauty',
    tag: '#SoftFocusVelvet',
    productTitle: 'Aura Blossom Silk Finishing Powder',
    productSlug: 'aura-blossom-silk-powder',
  },
]

export function CommunityLookbook() {
  return (
    <section className="py-16 sm:py-20 bg-white border-t border-[#E8C4D4]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FBF6F8] border border-[#E8C4D4] text-xs font-bold text-[#6B2D5C] mb-3">
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>COMMUNITY RADIANCE • @LOVIXABEAUTY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2B1822] tracking-tight">
            Loved Across Vanity Mirrors Worldwide
          </h2>
          <p className="text-xs sm:text-sm text-[#2B1822]/70 mt-2">
            Share your radiant bare-skin glow with <span className="font-bold text-[#6B2D5C]">#LovixaGlow</span> to be featured in our seasonal atelier gallery.
          </p>
        </div>

        {/* 5-Column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {LOOKBOOK_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-[#FBF6F8] border border-[#E8C4D4]/60 shadow-xs hover:shadow-xl transition-all duration-300"
            >
              <img
                src={item.image}
                alt={item.productTitle}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Hover Dark Vignette & Shop Link */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B1822]/85 via-[#2B1822]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-white/90 flex items-center gap-1">
                    <InstagramIcon className="w-3 h-3 text-[#E8C4D4]" />
                    {item.handle}
                  </span>
                  <Heart className="w-3.5 h-3.5 fill-[#E8C4D4] text-[#E8C4D4]" />
                </div>

                <div>
                  <span className="text-[10px] font-mono text-[#E8C4D4] block mb-0.5">
                    {item.tag}
                  </span>
                  <Link
                    href={`/products/${item.productSlug}`}
                    className="text-xs font-serif font-bold hover:underline line-clamp-1 block"
                  >
                    {item.productTitle}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
