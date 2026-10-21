'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { BrushStroke } from '@/components/ui/BrushStroke'
import type { StorefrontFAQsData } from '@/lib/cms/products'

const DEFAULT_FAQS = [
  {
    question: 'Is LOVIXA Shampoo suitable for all hair types?',
    answer:
      'LOVIXA Botanical Shampoo is crafted with pure botanical extracts for natural hair care and root wellness. Important Note: It is NOT suitable for chemically treated hair such as Keratin, Cysteine, or Chemical Smoothening/Straightening treatments. For all natural and untreated hair types, it gently cleanses without stripping natural oils.',
  },
  {
    question: 'How should I use the Hair Oil and Shampoo in my weekly routine?',
    answer:
      'There is no strict 30-minute limit. You can apply LOVIXA Hair Oil whenever you like—even applying it at night and sleeping with it on for deep overnight nourishment. Whenever applying oil, gently massage into your scalp and hair roots. Wash your hair on alternate days (every other day / એક મૂકીને એક દિવસે) with LOVIXA Botanical Refreshing Shampoo.',
  },
  {
    question: 'What are the shipping charges and delivery timelines across India?',
    answer:
      'We offer FREE express shipping across India on all orders above ₹999. For orders below ₹999, shipping charges are calculated dynamically based on your delivery pincode at checkout. Orders are carefully packed within 24 to 48 hours and typically reach your doorstep in 3 to 5 business days with live WhatsApp and SMS tracking.',
  },
  {
    question: 'Are LOVIXA products 100% cruelty-free and vegan?',
    answer:
      'Absolutely. We believe mindful self-care must be ethical. None of our botanical ingredients or finished products are ever tested on animals, and our formulas are 100% vegan certified.',
  },
]

interface Props {
  data?: StorefrontFAQsData
}

export function LovixaFAQ({ data }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const heading = data?.heading || 'Hair Ritual & Care Guidance'
  const subtitle =
    data?.subtitle ||
    'Everything you need to know about our botanical sourcing, usage rituals, and mindful delivery'
  const items = data?.items && data.items.length > 0 ? data.items : DEFAULT_FAQS

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <section id="faq" className="py-14 sm:py-20 bg-[#FBF6F8] border-b border-[#E8C4D4]/40 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Heading with Signature Brush Stroke */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-block relative">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-bold text-[#2B1822] tracking-tight">
              {heading}
            </h2>
            <BrushStroke className="text-[#6B2D5C]" />
          </div>
          <p className="text-xs sm:text-sm text-[#2B1822]/70 mt-2">
            {subtitle}
          </p>
        </div>

        {/* Clean Modern Accordion List */}
        <div className="bg-white rounded-2xl border border-[#E8C4D4]/60 p-5 sm:p-8 shadow-xs divide-y divide-[#E8C4D4]/30">
          {items.map((faq, idx) => {
            const isOpen = openIndex === idx

            return (
              <div key={idx} className="py-4 first:pt-0 last:pb-0">
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between text-left gap-4 py-2 cursor-pointer group"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-semibold text-[#2B1822] group-hover:text-[#6B2D5C] transition-colors leading-snug">
                    {faq.question}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#FBF6F8] flex items-center justify-center shrink-0 text-[#6B2D5C] group-hover:bg-[#6B2D5C] group-hover:text-white transition-all">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="pt-2 pb-1 text-xs sm:text-sm text-[#2B1822]/75 leading-relaxed font-sans animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
