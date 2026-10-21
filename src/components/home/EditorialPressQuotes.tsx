'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Quote } from 'lucide-react'

interface PressAccolade {
  publication: string
  quote: string
  authorRole: string
  awardTag: string
}

const PRESS_ACCOLADES: PressAccolade[] = [
  {
    publication: 'VOGUE',
    quote:
      'The velvety barrier restoration serum that redefined clinical skincare. It transforms stressed, sensitive skin into a lit-from-within canvas with unprecedented speed.',
    authorRole: 'Beauty & Wellness Editor',
    awardTag: 'Editor’s Pick 2026',
  },
  {
    publication: 'ELLE',
    quote:
      'Sensorial perfection in heavy flint glass. The steam-distilled Damascus rose hydrosol and biomimetic ceramides sink in without any greasy film.',
    authorRole: 'Global Beauty Director',
    awardTag: 'Best Barrier Repair',
  },
  {
    publication: 'ALLURE',
    quote:
      'Awarded Best Clean Lip Glaze 2026. The cushiony tripeptide plumping formula delivers glassy dewy luster with rich berry pigment and zero stickiness.',
    authorRole: 'Senior Aesthetics Editor',
    awardTag: 'Best of Clean Beauty 2026',
  },
  {
    publication: 'HARPER’S BAZAAR',
    quote:
      'Lovixa strikes that rare alchemy: genuine cold-chain botanical purity backed by rigorous clinical perception testing and Parisian apothecary elegance.',
    authorRole: 'Fashion & Skincare Critic',
    awardTag: 'Luxury Formula of the Year',
  },
  {
    publication: 'MARIE CLAIRE',
    quote:
      'A true backstage staple. Models rave about how it instantly soothes irritation and holds moisture through 14-hour shoots under studio lighting.',
    authorRole: 'Lead Makeup Artist Feature',
    awardTag: 'Backstage Holy Grail',
  },
]

export function EditorialPressQuotes() {
  const [activeIndex, setActiveIndex] = useState(0)

  // Auto-advance accolades every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % PRESS_ACCOLADES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const current = PRESS_ACCOLADES[activeIndex]

  return (
    <section className="py-16 sm:py-20 bg-white border-y border-[#E8C4D4]/50 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#FBF6F8] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Section Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FBF6F8] border border-[#E8C4D4] text-xs font-bold text-[#6B2D5C] mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>EDITORIAL ACCLAIM & CRITICS</span>
        </div>

        {/* Quote Block */}
        <div className="min-h-[170px] sm:min-h-[150px] flex flex-col justify-center items-center">
          <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-[#E8C4D4] mb-3 rotate-180 opacity-80" />
          <blockquote className="text-xl sm:text-2xl lg:text-3xl font-serif text-[#2B1822] tracking-tight leading-relaxed max-w-3xl italic animate-in fade-in-50 duration-500">
            &ldquo;{current.quote}&rdquo;
          </blockquote>
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="text-xs font-black tracking-widest uppercase text-[#6B2D5C] font-sans">
              {current.publication}
            </span>
            <span className="text-[#E8C4D4]">•</span>
            <span className="text-xs text-[#2B1822]/60 font-sans">{current.authorRole}</span>
            <span className="text-[#E8C4D4] hidden sm:inline">•</span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full hidden sm:inline">
              {current.awardTag}
            </span>
          </div>
        </div>

        {/* Publication Logo Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-10 pt-8 border-t border-[#E8C4D4]/40">
          {PRESS_ACCOLADES.map((item, idx) => (
            <button
              key={item.publication}
              onClick={() => setActiveIndex(idx)}
              className={`text-sm sm:text-base tracking-[0.25em] font-serif font-black uppercase transition-all duration-300 py-1.5 px-3 rounded-full cursor-pointer ${
                activeIndex === idx
                  ? 'text-[#6B2D5C] border-b-2 border-[#6B2D5C] scale-105'
                  : 'text-[#2B1822]/30 hover:text-[#2B1822]/70'
              }`}
            >
              {item.publication}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
