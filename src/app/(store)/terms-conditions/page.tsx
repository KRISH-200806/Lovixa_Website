import Link from 'next/link'
import { FileText, ShieldCheck } from 'lucide-react'
import { PageHeaderBanner } from '@/components/common/PageHeaderBanner'
import { PolicyNavigation } from '@/components/common/PolicyNavigation'

export const metadata = {
  title: 'Terms & Conditions — LOVIXA COSMETIC',
  description: 'Terms of service and purchasing conditions for LOVIXA COSMETIC website visitors and customers.',
}

export default function TermsConditionsPage() {
  return (
    <div className="bg-[#FBF6F8] min-h-[75vh] py-6 sm:py-10 text-[#2B1822]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeaderBanner
          breadcrumbs={[
            { label: 'Terms & Conditions' }
          ]}
          badge="TERMS OF SERVICE"
          title="Transparency & Trust,"
          highlightTitle="Terms of Service & Usage"
          subtitle="Clear conditions and guidelines for shopping, browsing, and ordering at LOVIXA COSMETIC."
          imageSrc="/images/lovixa-panoramic-hero.jpg"
          imageAlt="LOVIXA Terms and Conditions"
          priority
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pt-8">
        <div className="space-y-1 border-b border-[#E8C4D4]/60 pb-6">
          <p className="text-xs text-[#2B1822]/60 font-sans">
            Last Updated: October 2026 • LOVIXA COSMETIC
          </p>
        </div>

        {/* Policy Content */}
        <div className="space-y-8 text-sm sm:text-base text-[#2B1822]/80 leading-relaxed font-sans">
          <section className="space-y-3">
            <h2 className="text-xl font-sans font-bold text-[#2B1822]">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or purchasing from LOVIXA COSMETIC, you agree to comply with and be bound by these Terms and Conditions. Please review them carefully before completing any transaction.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-sans font-bold text-[#2B1822]">
              2. Authentic Product Information &amp; Cosmetic Guidance
            </h2>
            <p>
              We strive to display our cosmetic products with exact photography, ingredient transparency, net volumes, and directions. Our products are formulated for cosmetic hair and skin self-care; they are not intended to diagnose, treat, cure, or prevent medical diseases. Individual skin and hair textures and responses may vary.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-sans font-bold text-[#2B1822]">
              3. Pricing, Orders &amp; Replacement Policy
            </h2>
            <p>
              All listed prices are in Indian Rupee (INR / ₹) and include statutory taxes (GST) unless stated otherwise. We reserve the right to modify prices or discontinue products without prior notice. All cosmetic purchases are final; as stated in our Return &amp; Replacement Policy, we offer 100% free replacements for verified transit damages, but do not offer monetary refunds. In the unexpected event that an item is out of stock prior to dispatch, we will promptly notify you and issue an immediate full refund.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-sans font-bold text-[#2B1822]">
              4. Intellectual Property
            </h2>
            <p>
              The LOVIXA brand name, logo, packaging designs, photography, typography layouts, and website text are the exclusive intellectual property of LOVIXA COSMETIC. Reproduction or unauthorized commercial use without written permission is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-sans font-bold text-[#2B1822]">
              5. Governing Law &amp; Inquiries
            </h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of India. For any operational queries, please reach out directly:
            </p>
            <p className="p-4 rounded-2xl bg-[#E8C4D4]/20 border border-[#E8C4D4]/60 text-xs sm:text-sm">
              Email: <a href="mailto:lovixacosmetic@gmail.com" className="font-bold text-[#6B2D5C] underline">lovixacosmetic@gmail.com</a><br />
              WhatsApp: <a href="https://wa.me/919712460509" target="_blank" rel="noreferrer" className="font-bold text-[#6B2D5C] underline">+91 97124 60509</a>
            </p>
          </section>
        </div>

        <PolicyNavigation />
      </div>
    </div>
  )
}
