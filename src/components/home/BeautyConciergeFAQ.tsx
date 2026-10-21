'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle, MessageSquareHeart, Sparkles } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const FAQS: FAQItem[] = [
  {
    category: 'Formulation & Usage',
    question: 'How should I layer the Velvet Rose Barrier Serum into my daily skincare ritual?',
    answer:
      'Apply 3–4 drops onto freshly cleansed, slightly damp skin every morning and evening. Gently press into face, neck, and décolletage until fully absorbed. Follow with our Cellular Defense Velvet Barrier Cream to seal in the multi-molecular hydration for up to 72 hours.',
  },
  {
    category: 'Skin Safety & Sensitivity',
    question: 'Are Lovixa formulations safe for sensitive, reactive, or rosacea-prone skin?',
    answer:
      'Yes, unconditionally. Every formula is dermatologist-tested, hypoallergenic, and completely free of artificial fragrances, drying alcohols, parabens, and essential oil sensitizers. Our primary focus is restoring compromised skin barrier bilayers.',
  },
  {
    category: 'Lip Care & Plumping',
    question: 'How do the Dewy Peptide Lip Glazes provide volume without tingling or stinging?',
    answer:
      'Unlike traditional irritant-based plumpers (which use capsicum or cinnamon to induce swelling), Lovixa utilizes biomimetic Palmitoyl Tripeptide-1 and plant-derived hyaluronic spheres that hydrate and cushion lip tissues from within, delivering high-shine volume without irritation or discomfort.',
  },
  {
    category: 'Orders & Guarantees',
    question: 'What is your 30-Day Glowing Guarantee and how do returns work?',
    answer:
      'We stand behind every drop we formulate. If your skin does not feel noticeably calmer, more hydrated, and visibly radiant within 30 days of receiving your order, contact our concierge team for a full 100% refund—no complex return requirements.',
  },
  {
    category: 'Sourcing & Ethics',
    question: 'Are all Lovixa botanical ingredients sustainably sourced and cruelty-free?',
    answer:
      'All of our botanicals—including sunrise-harvested Damascus Rose hydrosol and cold-pressed wild rosehip seed oil—are ethically sourced from certified organic cooperatives. We are 100% vegan and PETA certified cruelty-free with zero animal testing.',
  },
  {
    category: 'Shipping & Gifting',
    question: 'Can I include a personalized gift note and luxury packaging?',
    answer:
      'Yes! All orders arrive in our signature unbleached blush gift boxes with recyclable tissue. At checkout, you can select complimentary luxury gift wrapping and include a handwritten gift card message for the recipient.',
  },
]

export function BeautyConciergeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center space-y-3 mb-12">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FBF6F8] border border-[#E8C4D4] text-xs font-bold text-[#6B2D5C]">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Beauty Concierge & Common Inquiries</span>
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-[#2B1822] tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-[#2B1822]/70 leading-relaxed max-w-xl mx-auto">
          Everything you need to know about our clean botanical formulations, ritual layering, clinical testing, and guarantees.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3.5">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx
          return (
            <div
              key={faq.question}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? 'border-[#6B2D5C]/40 bg-[#FBF6F8]/60 shadow-md'
                  : 'border-[#E8C4D4]/70 bg-white hover:border-[#6B2D5C]/30'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full py-4 sm:py-5 px-5 sm:px-6 flex items-center justify-between text-left gap-4 cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-[#6B2D5C] hidden sm:inline-block">
                    0{idx + 1}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-[#2B1822] tracking-tight">
                    {faq.question}
                  </span>
                </div>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen
                      ? 'bg-[#6B2D5C] text-white rotate-180'
                      : 'bg-[#FBF6F8] text-[#2B1822] border border-[#E8C4D4]'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-[#2B1822]/75 leading-relaxed border-t border-[#E8C4D4]/40 mt-1 animate-in fade-in-50 duration-200">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Support Box */}
      <div className="mt-10 p-6 rounded-3xl bg-[#FBF6F8] border border-[#E8C4D4] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white border border-[#E8C4D4] flex items-center justify-center text-[#6B2D5C] shrink-0">
            <MessageSquareHeart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#2B1822]">Have a specialized skin question?</p>
            <p className="text-[11px] text-[#2B1822]/60">Our formulation team is available Monday through Friday for personal skin consultations.</p>
          </div>
        </div>
        <a
          href="mailto:concierge@lovixabeauty.com"
          className="px-5 py-2.5 rounded-full bg-[#6B2D5C] hover:bg-[#562349] text-white text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs"
        >
          Contact Concierge
        </a>
      </div>
    </section>
  )
}
