'use client'

import { ShieldCheck, Leaf, Sparkles, RefreshCw, CheckCircle2, Heart } from 'lucide-react'

export function BrandPledgeAndTrust() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="border border-[#E8C4D4]/80 rounded-[2.5rem] bg-white p-6 sm:p-10 lg:p-14 shadow-sm">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FBF6F8] border border-[#E8C4D4] text-xs font-bold text-[#6B2D5C]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>The Lovixa Conscious Formulation Standard</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#2B1822] tracking-tight">
            Transparent Beauty. Proven by Integrity.
          </h2>
          <p className="text-xs sm:text-sm text-[#2B1822]/70 leading-relaxed">
            We hold our cosmetic chemistry to the highest European clean beauty safety thresholds, combining botanical authenticity with rigorous dermatological testing.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Pillar 1 */}
          <div className="p-6 rounded-3xl bg-[#FBF6F8]/70 border border-[#E8C4D4]/60 space-y-3 hover:-translate-y-1 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#E8C4D4] flex items-center justify-center text-[#6B2D5C] shadow-xs">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#2B1822]">
              Zero Harsh Synthetics
            </h3>
            <p className="text-xs text-[#2B1822]/70 leading-relaxed">
              Formulated without parabens, sulfates (SLS/SLES), mineral oils, synthetic colorants, microplastics, or drying alcohols.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-3xl bg-[#FBF6F8]/70 border border-[#E8C4D4]/60 space-y-3 hover:-translate-y-1 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#E8C4D4] flex items-center justify-center text-[#6B2D5C] shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#2B1822]">
              Cold-Chain Distillation
            </h3>
            <p className="text-xs text-[#2B1822]/70 leading-relaxed">
              Botanical essences are extracted at low thermal thresholds to safeguard fragile polyphenol and antioxidant bio-potency.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-3xl bg-[#FBF6F8]/70 border border-[#E8C4D4]/60 space-y-3 hover:-translate-y-1 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#E8C4D4] flex items-center justify-center text-[#6B2D5C] shadow-xs">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#2B1822]">
              30-Day Glowing Guarantee
            </h3>
            <p className="text-xs text-[#2B1822]/70 leading-relaxed">
              If your skin doesn't feel calmer and visibly more radiant within 30 days, we honor an effortless full refund—bottles included.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-3xl bg-[#FBF6F8]/70 border border-[#E8C4D4]/60 space-y-3 hover:-translate-y-1 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#E8C4D4] flex items-center justify-center text-[#6B2D5C] shadow-xs">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#2B1822]">
              PETA Vegan & Cruelty-Free
            </h3>
            <p className="text-xs text-[#2B1822]/70 leading-relaxed">
              Never tested on animals at any stage of formulation or manufacturing. Certified 100% vegan with Leaping Bunny standard compliance.
            </p>
          </div>
        </div>

        {/* Banner with Verification Checklist */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#2B1822] text-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#6B2D5C] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-black text-[#E8C4D4] uppercase tracking-wider">
                Laboratory Certified Batches
              </p>
              <p className="text-xs sm:text-sm text-white/90 font-medium">
                Every batch is microbiological and heavy metal tested before packaging.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-white/70">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Hypoallergenic Tested
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Non-Comedogenic
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Dermatologist Approved
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
