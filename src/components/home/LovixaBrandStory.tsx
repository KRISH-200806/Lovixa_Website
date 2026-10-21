'use client'

import { ShieldCheck, Heart, Leaf, Award } from 'lucide-react'
import { BrushStroke } from '@/components/ui/BrushStroke'
import type { StorefrontBrandStoryData } from '@/lib/cms/products'

const DEFAULT_SEALS = [
  {
    iconType: 'leaf' as const,
    title: '100% Ayurvedic',
    subtitle: 'Cold-Pressed Herbs',
    desc: 'Pure extracts of Bhringraj, Amla & Rosemary brewed naturally.',
  },
  {
    iconType: 'award' as const,
    title: 'AYUSH Certified',
    subtitle: 'Lab-Tested Purity',
    desc: 'Adheres to stringent quality and botanical standardization protocols.',
  },
  {
    iconType: 'shield' as const,
    title: 'Dermatologist Safe',
    subtitle: 'Zero Harsh Sulfates',
    desc: 'Free of SLS/SLES, parabens & synthetic silicones for sensitive scalps.',
  },
  {
    iconType: 'heart' as const,
    title: '100% Cruelty-Free',
    subtitle: 'Vegan & Ethical',
    desc: 'Crafted with respect for nature. Never tested on animals.',
  },
]

function getIcon(type?: string) {
  switch (type) {
    case 'award':
      return Award
    case 'shield':
      return ShieldCheck
    case 'heart':
      return Heart
    case 'leaf':
    default:
      return Leaf
  }
}

interface Props {
  data?: StorefrontBrandStoryData
}

export function LovixaBrandStory({ data }: Props) {
  const heading = data?.heading || 'The LOVIXA Botanical Heritage'
  const storyText =
    data?.storyText ||
    'At LOVIXA, we believe your hair care goes beyond what you see in the mirror — and deserves mindful self-care that goes deeper to the roots. We bring you thoughtful, time-honored Ayurvedic botanical solutions that nurture your scalp with trust, cold-pressed purity, and dermatologically tested clinical efficacy.'
  const seals = data?.seals && data.seals.length > 0 ? data.seals : DEFAULT_SEALS

  return (
    <section id="brand-story" className="py-14 sm:py-20 bg-[#FBF6F8] relative border-b border-[#E8C4D4]/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Centered Heading with Signature Brush Stroke */}
        <div className="inline-block relative mb-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-bold text-[#2B1822] tracking-tight">
            {heading}
          </h2>
          <BrushStroke className="text-[#6B2D5C]" />
        </div>

        {/* Editorial Story Text */}
        <p className="text-xs sm:text-sm text-[#2B1822]/70 leading-relaxed font-sans max-w-2xl mx-auto mb-12">
          {storyText}
        </p>

        {/* 4 Refined Circular Botanical Trust Seals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {seals.map((seal, idx) => {
            const Icon = getIcon(seal.iconType)
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-[#E8C4D4]/60 hover:border-[#6B2D5C]/40 transition-all duration-300 text-center flex flex-col items-center group shadow-xs hover:shadow-md"
              >
                <div className="w-14 h-14 rounded-full bg-[#FBF6F8] border border-[#6B2D5C]/25 text-[#6B2D5C] flex items-center justify-center shadow-xs mb-3.5 group-hover:scale-110 group-hover:bg-[#6B2D5C] group-hover:text-white transition-all">
                  <Icon className="w-6 h-6 stroke-[1.8]" />
                </div>
                <h4 className="text-sm font-bold text-[#2B1822] block mb-0.5">
                  {seal.title}
                </h4>
                <span className="text-[11px] font-semibold text-[#6B2D5C] block mb-2">
                  {seal.subtitle}
                </span>
                <p className="text-[11px] text-[#2B1822]/65 leading-relaxed">
                  {seal.desc}
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
