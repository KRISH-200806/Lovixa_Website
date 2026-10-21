'use client'

import Link from 'next/link'
import { ArrowRight, Check, Droplets, Sparkles, Heart } from 'lucide-react'

export function PromotionalSplitBanners() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Banner 1: Barrier Restoration Ritual */}
        <div className="relative rounded-[2rem] bg-[#FBF6F8] border border-[#E8C4D4]/80 p-6 sm:p-8 lg:p-10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#E8C4D4]/50 blur-3xl pointer-events-none" />

          {/* Top Tags */}
          <div className="flex items-center justify-between mb-6 relative z-10">
            <span className="px-3.5 py-1 rounded-full bg-white border border-[#E8C4D4] text-xs font-black tracking-wider uppercase text-[#6B2D5C]">
              CLINICAL RITUAL DUO
            </span>
            <span className="text-xs font-bold text-[#6B2D5C] bg-[#E8C4D4]/40 px-3 py-1 rounded-full">
              Save $26 on Set
            </span>
          </div>

          {/* Main Visual */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-[#E8C4D4]/80 bg-white mb-6 shadow-sm">
            <img
              src="/images/promo-barrier-ritual.png"
              alt="Barrier Restoration Duo: Rosehip Serum & Cellular Defense Cream"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            {/* Float badge */}
            <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E8C4D4]/80 text-[11px] font-bold text-[#6B2D5C] shadow-sm flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-[#6B2D5C]" />
              <span>5 Biomimetic Ceramides</span>
            </div>
          </div>

          {/* Content & Details */}
          <div className="space-y-4 relative z-10">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#2B1822] tracking-tight">
                The Cellular Barrier Restoration Ritual
              </h3>
              <p className="text-xs sm:text-sm text-[#2B1822]/75 mt-2 leading-relaxed">
                A clinically formulated synergy of cold-pressed rosehip seed oil and biomimetic ceramides. Locks in 72-hour deep cellular moisture and reverses environmental stress.
              </p>
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-[#2B1822]/80">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#6B2D5C] shrink-0" />
                <span>Restores compromised skin barrier</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#6B2D5C] shrink-0" />
                <span>Zero fragrance & hypoallergenic</span>
              </div>
            </div>

            {/* Price and CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E8C4D4]/60">
              <div>
                <span className="text-lg font-black text-[#2B1822]">$110.00</span>
                <span className="text-xs text-[#2B1822]/40 line-through ml-2">$136.00</span>
              </div>
              <Link
                href="/products/cellular-defense-barrier-cream"
                className="px-6 py-3 bg-[#6B2D5C] hover:bg-[#562349] text-white font-bold text-xs rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>Shop Ritual Duo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Banner 2: Dewy Peptide Lip Glaze */}
        <div className="relative rounded-[2rem] bg-[#FBF6F8] border border-[#E8C4D4]/80 p-6 sm:p-8 lg:p-10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#82356F]/20 blur-3xl pointer-events-none" />

          {/* Top Tags */}
          <div className="flex items-center justify-between mb-6 relative z-10">
            <span className="px-3.5 py-1 rounded-full bg-white border border-[#E8C4D4] text-xs font-black tracking-wider uppercase text-[#6B2D5C]">
              VIRAL SENSATION
            </span>
            <span className="text-xs font-bold text-[#6B2D5C] bg-[#E8C4D4]/40 px-3 py-1 rounded-full">
              Over 10,000 Sold
            </span>
          </div>

          {/* Main Visual */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-[#E8C4D4]/80 bg-white mb-6 shadow-sm">
            <img
              src="/images/promo-dewy-lip-glaze.png"
              alt="Dewy Peptide Lip Tint Glaze Shades"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            {/* Float badge */}
            <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E8C4D4]/80 text-[11px] font-bold text-[#6B2D5C] shadow-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#6B2D5C]" />
              <span>High-Shine Zero Stickiness</span>
            </div>
          </div>

          {/* Content & Details */}
          <div className="space-y-4 relative z-10">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#2B1822] tracking-tight">
                Dewy Peptide Lip Glaze & Plumping Tints
              </h3>
              <p className="text-xs sm:text-sm text-[#2B1822]/75 mt-2 leading-relaxed">
                Enriched with volume-enhancing tripeptides and wild plum seed oil. Cushions lips in glassy pigment, leaving an effortless dewy luster that lasts all day.
              </p>
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-[#2B1822]/80">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#6B2D5C] shrink-0" />
                <span>3 Universally flattering shades</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#6B2D5C] shrink-0" />
                <span>Nourishing organic shea esters</span>
              </div>
            </div>

            {/* Price and CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E8C4D4]/60">
              <div>
                <span className="text-lg font-black text-[#2B1822]">$28.00</span>
                <span className="text-xs text-[#2B1822]/60 ml-2">8 Luxe Shades</span>
              </div>
              <Link
                href="/products?category=lip-care"
                className="px-6 py-3 bg-[#6B2D5C] hover:bg-[#562349] text-white font-bold text-xs rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Lip Glazes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
