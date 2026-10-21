'use client'

import { Sparkles, ShieldCheck, Droplets, Leaf } from 'lucide-react'
import { COSMETIC_INGREDIENTS } from '@/lib/constants/cosmetics-catalog'

const ICON_MAP = {
  Sparkles,
  ShieldCheck,
  Droplets,
  Leaf,
}

export function IngredientSpotlight() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#FBF6F8] border border-[#E8C4D4] text-xs font-bold text-[#6B2D5C]">
          Science-Backed Bio-Botanicals
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-[#2B1822] tracking-tight">
          Formulated with Cellular Precision
        </h2>
        <p className="text-xs sm:text-sm text-[#2B1822]/70 leading-relaxed">
          We combine cold-pressed botanicals with clinically validated biomimetic actives to restore barrier lipid balance and deliver true glass-skin radiance.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {COSMETIC_INGREDIENTS.map((ing, idx) => {
          const Icon = ICON_MAP[ing.iconName as keyof typeof ICON_MAP] || Sparkles
          return (
            <div
              key={ing.title}
              className="rounded-3xl bg-[#FBF6F8]/60 hover:bg-white border border-[#E8C4D4]/70 hover:border-[#6B2D5C]/40 p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col justify-between group"
            >
              <div>
                {/* Numbered Pill Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-[#E8C4D4] flex items-center justify-center text-[#6B2D5C] group-hover:scale-110 group-hover:bg-[#6B2D5C] group-hover:text-white transition-all shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-black tracking-widest text-[#6B2D5C]/60 font-mono">
                    0{idx + 1}
                  </span>
                </div>

                <span className="text-[11px] uppercase tracking-wider font-bold text-[#6B2D5C] block mb-1">
                  {ing.subtitle}
                </span>
                <h3 className="text-base font-bold text-[#2B1822] mb-2.5 group-hover:text-[#6B2D5C] transition-colors">
                  {ing.title}
                </h3>
                <p className="text-xs text-[#2B1822]/75 leading-relaxed">
                  {ing.description}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-[#E8C4D4]/40 flex items-center gap-2 text-[11px] font-bold text-[#6B2D5C]">
                <span>100% Bio-Active Sourced</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
