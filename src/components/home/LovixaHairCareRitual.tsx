'use client'

import Image from 'next/image'
import { Droplets, Sparkles, Smile, ArrowRight } from 'lucide-react'

const STEPS = [
  {
    step: '01',
    title: 'NOURISH & MASSAGE',
    action: 'Cold-Pressed Hair Oil',
    instruction: 'Apply 5-8 drops onto your scalp and hair ends. Massage gently in circular motions 20-30 mins prior to wash.',
    icon: Droplets,
    image: '/images/lovixa-story.jpg',
  },
  {
    step: '02',
    title: 'BOTANICAL CLEANSE',
    action: 'Refreshing Shampoo',
    instruction: 'Lather gently onto wet hair. Plant surfactants lift daily impurities while keeping natural moisture intact.',
    icon: Sparkles,
    image: '/images/lovixa-insta-4.jpg',
  },
  {
    step: '03',
    title: 'NATURAL RADIANCE',
    action: 'Silky Shine Finish',
    instruction: 'Rinse thoroughly with lukewarm water. Air-dry to experience manageable, bouncy, and lustrous hair.',
    icon: Smile,
    image: '/images/lovixa-insta-2.jpg',
  },
]

export function LovixaHairCareRitual() {
  return (
    <section id="ritual" className="py-10 sm:py-14 bg-white relative border-b border-[#F0DCE5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Section Header */}
        <div className="text-center max-w-xl mx-auto mb-7 sm:mb-9 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF3F6] border border-[#E8C4D4] text-[#6B2D5C] text-[10px] sm:text-xs font-bold tracking-widest uppercase font-sans">
            <Sparkles className="w-3 h-3 text-[#6B2D5C]" />
            <span>HOW IT WORKS</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-sans font-black text-[#2B1822] tracking-tight uppercase">
            The 3-Step Hair Ritual
          </h2>

          <p className="text-xs sm:text-sm text-[#2B1822]/70 font-sans">
            Simple, mindful self-care for optimal scalp wellness and glossy locks.
          </p>
        </div>

        {/* 3 Clean Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {STEPS.map((step) => {
            const Icon = step.icon

            return (
              <div
                key={step.step}
                className="bg-[#FAF6F8]/70 border border-[#F0DCE5] rounded-2xl overflow-hidden hover:bg-white hover:border-[#6B2D5C]/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Step Image */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-white">
                    <Image
                      src={step.image}
                      alt={`Step ${step.step}: ${step.title}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute top-3 left-3 bg-[#2B1822]/90 backdrop-blur-sm text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase font-sans shadow-sm">
                      STEP {step.step}
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="p-4 sm:p-5 space-y-1.5">
                    <span className="text-[10px] font-bold text-[#6B2D5C] uppercase tracking-wider block font-sans">
                      {step.action}
                    </span>

                    <h3 className="text-base sm:text-lg font-sans font-black text-[#2B1822] leading-snug">
                      {step.title}
                    </h3>

                    <p className="text-xs text-[#2B1822]/75 leading-relaxed font-sans pt-1">
                      {step.instruction}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 border-t border-[#F0DCE5]/60 flex items-center justify-between text-[10px] font-bold text-[#6B2D5C] uppercase tracking-wider font-sans">
                  <span>LOVIXA ROUTINE</span>
                  <span>STEP {step.step} OF 03</span>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
