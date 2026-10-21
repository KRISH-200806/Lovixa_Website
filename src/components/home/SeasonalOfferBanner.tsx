'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Copy, Check, ArrowRight, Tag, ShieldCheck, Gift } from 'lucide-react'

export function SeasonalOfferBanner() {
  const [copied, setCopied] = useState(false)
  const promoCode = 'GLOW15'

  const handleCopy = () => {
    navigator.clipboard.writeText(promoCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative rounded-[2.5rem] bg-[#2B1822] text-white overflow-hidden shadow-2xl border border-[#E8C4D4]/30">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6B2D5C]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#E8C4D4]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 items-center relative z-10">
          {/* Left Column: Graphic Showcase */}
          <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12">
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-[#E8C4D4]/30 shadow-2xl group">
              <img
                src="/images/about-all-products.webp"
                alt="LOVIXA Botanical Care Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              {/* Badge */}
              <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#2B1822]/90 backdrop-blur-md border border-[#E8C4D4]/40 text-[11px] font-black text-[#E8C4D4] flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#E8C4D4]" />
                <span>LIMITED BOTANICAL DROP</span>
              </div>
            </div>
          </div>

          {/* Right Column: Offers & Value Breakdown */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:pr-14 space-y-6">
            {/* Top Eyebrow Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-[#E8C4D4]">
              <Tag className="w-3.5 h-3.5 text-[#E8C4D4]" />
              <span>Autumn Radiance Celebration • Exclusive Online Privilege</span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-4xl lg:text-[2.65rem] font-black tracking-tight leading-[1.15] text-white">
              Complimentary Rosehip Elixir on Orders Over $90
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
              Experience the power of cellular botanicals. Enjoy an instant 15% VIP discount on all individual formulations or bundle any 2 full-size rituals to receive a luxury travel-sized Botanical Radiance Facial Oil.
            </p>

            {/* Volume Tier Deals (Inspired by The Wellness Shop) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-white/5 border border-white/15 rounded-2xl p-3.5 text-center">
                <p className="text-[11px] font-bold text-[#E8C4D4] uppercase tracking-wider">Buy 1 Formulation</p>
                <p className="text-sm font-black text-white mt-0.5">15% Off Code</p>
                <p className="text-[10px] text-white/60 mt-0.5">Use Code GLOW15</p>
              </div>

              <div className="bg-white/10 border border-[#E8C4D4]/40 rounded-2xl p-3.5 text-center relative shadow-sm">
                <span className="absolute -top-2.5 inset-x-0 mx-auto w-max px-2 py-0.5 rounded-full bg-[#6B2D5C] text-[9px] font-black tracking-wider uppercase text-white">
                  POPULAR
                </span>
                <p className="text-[11px] font-bold text-[#E8C4D4] uppercase tracking-wider">Buy 2 Formulations</p>
                <p className="text-sm font-black text-white mt-0.5">Free 15ml Oil ($38)</p>
                <p className="text-[10px] text-white/60 mt-0.5">Auto-applied in cart</p>
              </div>

              <div className="bg-white/5 border border-white/15 rounded-2xl p-3.5 text-center">
                <p className="text-[11px] font-bold text-[#E8C4D4] uppercase tracking-wider">Complete 4-Piece Kit</p>
                <p className="text-sm font-black text-white mt-0.5">Save 25% + Free Bag</p>
                <p className="text-[10px] text-white/60 mt-0.5">Satin Travel Pouch</p>
              </div>
            </div>

            {/* Coupon Code Pill + CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Copy Coupon Box */}
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white transition-all cursor-pointer group active:scale-95"
                title="Click to copy promo code"
              >
                <span className="text-xs font-mono font-bold tracking-widest text-[#E8C4D4]">
                  CODE: {promoCode}
                </span>
                {copied ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                    <Check className="w-3.5 h-3.5" /> Copied!
                  </span>
                ) : (
                  <Copy className="w-3.5 h-3.5 text-white/70 group-hover:text-white" />
                )}
              </button>

              {/* Primary Action Button */}
              <Link
                href="/products?category=bundles"
                className="px-8 py-3.5 bg-[#E8C4D4] hover:bg-white text-[#2B1822] font-black text-xs sm:text-sm rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>Shop Radiance Bundles</span>
                <ArrowRight className="w-4 h-4 text-[#2B1822]" />
              </Link>
            </div>

            {/* Fine Print Guarantees */}
            <div className="flex items-center gap-6 pt-3 text-[11px] text-white/60 border-t border-white/10">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E8C4D4]" />
                30-Day Happiness Guarantee
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-[#E8C4D4]" />
                2 Luxury Samples with Every Order
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
