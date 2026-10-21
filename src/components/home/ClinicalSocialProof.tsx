'use client'

import { Star, ShieldCheck, CheckCircle2, Heart } from 'lucide-react'
import { COSMETIC_TESTIMONIALS } from '@/lib/constants/cosmetics-catalog'

export function ClinicalSocialProof() {
  return (
    <section className="bg-[#FBF6F8]/80 border-y border-[#E8C4D4]/60 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header & Clinical Numbers */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white border border-[#E8C4D4] text-xs font-bold text-[#6B2D5C]">
            Clinical Verification & Social Proof
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#2B1822] tracking-tight">
            Proven by Science. Loved by Skin.
          </h2>
          <p className="text-xs sm:text-sm text-[#2B1822]/70 leading-relaxed">
            Independent clinical perception tests conducted with 120 participants across diverse skin types over 28 consecutive days.
          </p>
        </div>

        {/* 3 Metric Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
          <div className="bg-white border border-[#E8C4D4]/80 rounded-3xl p-6 sm:p-8 text-center shadow-xs hover:shadow-md transition-shadow">
            <span className="text-4xl sm:text-5xl font-black text-[#6B2D5C] tracking-tight font-heading">
              98%
            </span>
            <p className="text-xs sm:text-sm font-bold text-[#2B1822] mt-2">
              Instant Deep Hydration
            </p>
            <p className="text-xs text-[#2B1822]/60 mt-1 leading-relaxed">
              Reported profound, plump moisture retention lasting past 48 hours.
            </p>
          </div>

          <div className="bg-white border border-[#E8C4D4]/80 rounded-3xl p-6 sm:p-8 text-center shadow-xs hover:shadow-md transition-shadow">
            <span className="text-4xl sm:text-5xl font-black text-[#6B2D5C] tracking-tight font-heading">
              94%
            </span>
            <p className="text-xs sm:text-sm font-bold text-[#2B1822] mt-2">
              Barrier Redness Relief
            </p>
            <p className="text-xs text-[#2B1822]/60 mt-1 leading-relaxed">
              Observed visible soothing of seasonal irritation and dry sensitivity.
            </p>
          </div>

          <div className="bg-white border border-[#E8C4D4]/80 rounded-3xl p-6 sm:p-8 text-center shadow-xs hover:shadow-md transition-shadow">
            <span className="text-4xl sm:text-5xl font-black text-[#6B2D5C] tracking-tight font-heading">
              100%
            </span>
            <p className="text-xs sm:text-sm font-bold text-[#2B1822] mt-2">
              Vegan & Non-Comedogenic
            </p>
            <p className="text-xs text-[#2B1822]/60 mt-1 leading-relaxed">
              Certified zero pore-clogging waxes, zero animal derivatives or testing.
            </p>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COSMETIC_TESTIMONIALS.map((item) => (
            <div
              key={item.author}
              className="bg-white border border-[#E8C4D4]/80 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:shadow-lg transition-shadow group"
            >
              <div>
                {/* Highlight Pill & Star rating */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FBF6F8] border border-[#E8C4D4] text-[#6B2D5C]">
                    {item.product}
                  </span>
                  <div className="flex items-center text-[#6B2D5C]">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#6B2D5C]" />
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-[#2B1822]/85 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              {/* Author & Verification */}
              <div className="pt-5 mt-5 border-t border-[#E8C4D4]/50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#2B1822]">{item.author}</h4>
                  <p className="text-[11px] text-[#2B1822]/60 mt-0.5">{item.role}</p>
                </div>
                {item.verified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6B2D5C]" title="Verified Purchase">
                    <CheckCircle2 className="w-4 h-4 text-[#6B2D5C]" />
                    <span className="hidden sm:inline">Verified</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
