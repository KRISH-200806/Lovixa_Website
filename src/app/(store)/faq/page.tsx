'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, HelpCircle, Mail, Sparkles, MessageCircle } from 'lucide-react'
import { PageHeaderBanner } from '@/components/common/PageHeaderBanner'
import { PolicyNavigation } from '@/components/common/PolicyNavigation'

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'products' | 'usage' | 'orders' | 'shipping'>('all')
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'q-1': true,
    'q-2': true,
  })

  const toggle = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const faqs = [
    {
      id: 'q-1',
      category: 'products',
      question: 'What products does LOVIXA currently offer?',
      answer:
        'LOVIXA currently offers two foundational hair care essentials: LOVIXA Shampoo (500ml) and LOVIXA Hair Oil (50ml). Both are available individually or together as our Complete Hair Care Ritual Duo. We focus with care on these core products before expanding into other cosmetic categories.',
    },
    {
      id: 'q-2',
      category: 'usage',
      question: 'How should I incorporate LOVIXA into my weekly hair routine?',
      answer:
        'There is no fixed 30-minute rule. You can apply LOVIXA Hair Oil whenever convenient for you—including applying it at night and sleeping with it on for deep overnight nourishment. Whenever applying oil, gently massage into your scalp and hair roots. Wash your hair on alternate days (every other day / એક મૂકીને એક દિવસે) with LOVIXA Botanical Refreshing Shampoo to keep your scalp clean, nourished, and residue-free.',
    },
    {
      id: 'q-3',
      category: 'products',
      question: 'Is LOVIXA Shampoo suitable for all hair types?',
      answer:
        'LOVIXA Botanical Shampoo is crafted with pure botanical extracts for natural hair wellness and everyday care. Important Note: It is NOT suitable for hair that has undergone chemical treatments such as Keratin treatments, Cysteine treatments, or chemical Hair Smoothening/Straightening. For all natural and non-chemically treated hair types, it gently cleanses without stripping essential oils.',
    },
    {
      id: 'q-4',
      category: 'products',
      question: 'Does LOVIXA Hair Oil feel heavy or greasy?',
      answer:
        'No. Our botanical lipid formulation is lightweight and non-comedogenic. It absorbs smoothly into the hair shaft and rinses out completely with LOVIXA Shampoo without leaving heavy or greasy residue.',
    },
    {
      id: 'q-5',
      category: 'orders',
      question: 'How does WhatsApp Checkout and payment work?',
      answer:
        'We offer a seamless, personal WhatsApp-based checkout. When you review your bag and submit your delivery address, your order details are sent to our official business WhatsApp (+91 97124 60509). Our team confirms your items and shares our verified UPI QR code (Google Pay, PhonePe, Paytm, BHIM) or Bank Transfer details. Once you share the payment screenshot, we verify and dispatch your order.',
    },
    {
      id: 'q-6',
      category: 'shipping',
      question: 'What are your delivery charges and timelines?',
      answer:
        'We provide FREE Pan-India Express Shipping on all orders over ₹999. For orders below ₹999, shipping charges are calculated dynamically based on your delivery pincode at checkout. Orders are carefully packaged within 24 to 48 business hours from our certified botanical facility and reach your doorstep within 3 to 5 business days with live WhatsApp and SMS tracking updates.',
    },
    {
      id: 'q-7',
      category: 'shipping',
      question: 'What happens if my package arrives damaged in transit?',
      answer:
        'We take great care in packaging our amber bottles. In the rare event of transit damage or leakage, please take clear photos or video and send them via email at lovixacosmetic@gmail.com or via WhatsApp at +91 97124 60509 within 7 calendar days of delivery. Our customer team will promptly arrange a 100% free brand-new replacement bottle (monetary refunds are not provided).',
    },
    {
      id: 'q-8',
      category: 'orders',
      question: 'How can I track my order status?',
      answer:
        'Once your order is handed over to our courier partner, you will receive a confirmation message on WhatsApp and email containing your airway bill (AWB) tracking number and a direct tracking link.',
    },
  ]

  const filteredFaqs =
    activeTab === 'all' ? faqs : faqs.filter((f) => f.category === activeTab)

  return (
    <div className="bg-[#FBF6F8] min-h-[75vh] py-6 sm:py-10 text-[#2B1822]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeaderBanner
          breadcrumbs={[
            { label: 'Help & Support', href: '/contact' },
            { label: 'FAQs' }
          ]}
          badge="CLEAR & HONEST ANSWERS"
          title="Got Questions?"
          highlightTitle="Frequently Asked Questions"
          subtitle="Everything you need to know about our hair care formulations, everyday rituals, ordering, and delivery."
          imageSrc="/images/lovixa-hero-banner-products.jpg"
          imageAlt="LOVIXA FAQ and Knowledge"
          priority
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pt-8">

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'products', label: 'Formulations & Products' },
            { id: 'usage', label: 'Rituals & Usage' },
            { id: 'orders', label: 'Orders & Payments' },
            { id: 'shipping', label: 'Shipping & Delivery' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer font-sans ${
                activeTab === tab.id
                  ? 'bg-[#6B2D5C] text-white shadow-sm'
                  : 'bg-white text-[#2B1822] hover:bg-[#E8C4D4]/30 hover:text-[#6B2D5C] border border-[#E8C4D4]/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Accordions */}
        <div className="space-y-4 pt-4">
          {filteredFaqs.map((faq) => {
            const isOpen = Boolean(openIds[faq.id])

            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-[#E8C4D4]/60 overflow-hidden transition-all duration-200 hover:border-[#6B2D5C]/50 shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="text-base sm:text-lg font-sans font-bold text-[#2B1822]">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-[#FBF6F8] border border-[#E8C4D4]/60 flex items-center justify-center text-[#6B2D5C] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-[#6B2D5C] text-white border-[#6B2D5C]' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 sm:px-7 sm:pb-7 text-xs sm:text-sm text-[#2B1822]/80 leading-relaxed border-t border-[#E8C4D4]/30 pt-4 font-sans">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Contact Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#E8C4D4]/25 border border-[#E8C4D4]/70 text-center space-y-4">
          <h3 className="font-sans font-bold text-xl sm:text-2xl text-[#2B1822]">Still have questions?</h3>
          <p className="text-xs sm:text-sm text-[#2B1822]/75 font-sans max-w-md mx-auto">
            Our concierge team is always delighted to assist you with order questions or personalized routine advice.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:lovixacosmetic@gmail.com"
              className="btn-primary !py-2.5 !px-6"
            >
              <Mail className="w-4 h-4 text-[#E8C4D4]" />
              <span>Email Support</span>
            </a>
            <Link
              href="/contact"
              prefetch={true}
              scroll={true}
              className="btn-secondary !py-2.5 !px-6"
            >
              <span>Contact Page</span>
            </Link>
          </div>
        </div>

        <PolicyNavigation />
      </div>
    </div>
  )
}
