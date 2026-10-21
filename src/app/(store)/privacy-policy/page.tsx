import Link from 'next/link'
import { ShieldCheck, Lock } from 'lucide-react'
import { PageHeaderBanner } from '@/components/common/PageHeaderBanner'
import { PolicyNavigation } from '@/components/common/PolicyNavigation'

export const metadata = {
  title: 'Privacy Policy — LOVIXA COSMETIC',
  description: 'Understand how LOVIXA COSMETIC handles, protects, and respects your personal customer data.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#FBF6F8] min-h-[75vh] py-6 sm:py-10 text-[#2B1822]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeaderBanner
          breadcrumbs={[
            { label: 'Privacy Policy' }
          ]}
          badge="DATA INTEGRITY & TRUST"
          title="Data Privacy & Trust,"
          highlightTitle="Your Privacy is Sacred to Us"
          subtitle="Understand how LOVIXA COSMETIC handles, protects, and respects your personal customer data."
          imageSrc="/images/lovixa-panoramic-hero.jpg"
          imageAlt="LOVIXA Privacy Policy"
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
              1. Our Privacy Commitment
            </h2>
            <p>
              At LOVIXA COSMETIC, your privacy and trust are sacred. We collect only information that is strictly required to process your orders, ship your packages, and provide personalized customer assistance. We never sell, rent, or trade your personal data to third-party marketing companies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-sans font-bold text-[#2B1822]">
              2. Information We Collect
            </h2>
            <p>When you browse or purchase from LOVIXA COSMETIC, we collect:</p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-[#2B1822]/70">
              <li><strong>Contact &amp; Shipping Details:</strong> Your name, delivery address, email address, and phone number to fulfill deliveries.</li>
              <li><strong>Order History:</strong> Information regarding purchased products and order status to assist with support and accounts.</li>
              <li><strong>Technical Logs:</strong> Browser session data, device type, and cookies essential for shopping cart functionality.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-sans font-bold text-[#2B1822]">
              3. Payment Security &amp; Encryption
            </h2>
            <p>
              LOVIXA does <strong>not</strong> store or hold your credit card numbers, CVVs, or UPI PINs. All payment transactions are encrypted and processed through industry-certified, PCI-DSS compliant payment gateways (such as Razorpay).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-sans font-bold text-[#2B1822]">
              4. Cookies &amp; Local Storage
            </h2>
            <p>
              We utilize functional cookies and local storage solely to remember your shopping cart items, selected currency, and authentication preferences. You can adjust your browser settings to decline cookies if preferred.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-sans font-bold text-[#2B1822]">
              5. Contact Us Regarding Your Data
            </h2>
            <p>
              To request review, modification, or deletion of your customer information, please contact:
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
