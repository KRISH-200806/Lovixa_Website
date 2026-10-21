'use client'

import { BrushStroke } from '@/components/ui/BrushStroke'
import type { StorefrontWhyChooseData } from '@/lib/cms/products'

function CleanIcon() {
  return (
    <svg
      className="w-8 h-8 text-[#6B2D5C]"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M35 15C35 15 43 16 48 22C53 28 51 36 44 40C37 44 30 38 30 38" />
      <path d="M30 38C30 38 25 31 21 30C17 29 12 31 12 35C12 39 17 43 23 43" />
      <path d="M30 38L44 24" />
      <path d="M8 50C16 50 20 48 24 45L34 45C38 45 42 42 45 38" />
      <path d="M8 44C12 44 16 45 19 47" />
      <path d="M8 44V56H26" />
    </svg>
  )
}

function ConsciousIcon() {
  return (
    <svg
      className="w-8 h-8 text-[#6B2D5C]"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 28C22 22.48 26.48 18 32 18C37.52 18 42 22.48 42 28C42 32.5 39 36 37 38.5V43H27V38.5C25 36 22 32.5 22 28Z" />
      <path d="M28 47H36" />
      <path d="M30 51H34" />
      <path d="M32 38V28" />
      <path d="M32 32C34.5 30 37 30 37 32C37 34 34.5 35 32 34" />
      <path d="M32 30C29.5 28 27 28 27 30C27 32 29.5 33 32 32" />
      <line x1="32" y1="10" x2="32" y2="14" />
      <line x1="18" y1="14" x2="21" y2="17" />
      <line x1="46" y1="14" x2="43" y2="17" />
      <line x1="12" y1="28" x2="16" y2="28" />
      <line x1="48" y1="28" x2="52" y2="28" />
    </svg>
  )
}

function EffectiveIcon() {
  return (
    <svg
      className="w-8 h-8 text-[#6B2D5C]"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="32" cy="21" r="5" />
      <path d="M24 36C24 32 27.5 29 32 29C36.5 29 40 32 40 36" />
      <circle cx="18" cy="24" r="4" />
      <path d="M12 38C12 35 14.5 32.5 18 32.5C19.5 32.5 21 33 22 34" />
      <circle cx="46" cy="24" r="4" />
      <path d="M52 38C52 35 49.5 32.5 46 32.5C44.5 32.5 43 33 42 34" />
      <path
        d="M32 42C30 40 26 42 26 45C26 48 32 52 32 52C32 52 38 48 38 45C38 42 34 40 32 42Z"
        fill="#6B2D5C"
        stroke="#6B2D5C"
        strokeWidth="1"
      />
    </svg>
  )
}

interface Props {
  data?: StorefrontWhyChooseData
}

export function LovixaWhyChoose({ data }: Props) {
  const heading = data?.heading || 'The LOVIXA Purity Standard'
  const subtitle =
    data?.subtitle ||
    'Time-honored Ayurvedic wisdom married with modern clean cosmetic science — uncompromised botanical integrity'
  const pillars =
    data?.pillars && data.pillars.length > 0
      ? data.pillars
      : [
          {
            iconType: 'clean' as const,
            title: 'CLEAN',
            desc: 'Formulated without harsh sulfates, parabens, or silicones. Gentle, safe & scalp-friendly botanical ingredients.',
          },
          {
            iconType: 'conscious' as const,
            title: 'CONSCIOUS',
            desc: 'Inspired by clean, safe, cruelty-free, and environmentally mindful Ayurvedic practices.',
          },
          {
            iconType: 'effective' as const,
            title: 'EFFECTIVE',
            desc: 'Combines pure Ayurvedic botanicals & modern cosmetic science to deliver visible root-to-tip results.',
          },
        ]

  return (
    <section id="why-choose" className="py-14 sm:py-20 bg-[#E8C4D4]/25 border-y border-[#E8C4D4]/50 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Heading with Signature Brush Stroke */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-block relative">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-bold text-[#2B1822] tracking-tight">
              {heading}
            </h2>
            <BrushStroke className="text-[#6B2D5C]" />
          </div>
          <p className="text-xs sm:text-sm text-[#2B1822]/70 mt-2 max-w-md mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Pillars in Elegant Light Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8C4D4]/60 shadow-xs hover:shadow-md transition-all duration-300 text-center flex flex-col items-center group"
            >
              <div className="w-16 h-16 rounded-full bg-[#E8C4D4]/30 flex items-center justify-center mb-4 group-hover:scale-108 transition-transform">
                {pillar.iconType === 'conscious' ? (
                  <ConsciousIcon />
                ) : pillar.iconType === 'effective' ? (
                  <EffectiveIcon />
                ) : (
                  <CleanIcon />
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-sans uppercase tracking-wider text-[#2B1822] mb-2">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#2B1822]/70 leading-relaxed font-sans">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
