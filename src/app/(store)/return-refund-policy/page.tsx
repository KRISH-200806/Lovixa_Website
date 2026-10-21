import Link from 'next/link'
import { RotateCcw, ShieldCheck, Mail, AlertCircle } from 'lucide-react'
import { PageHeaderBanner } from '@/components/common/PageHeaderBanner'
import { PolicyNavigation } from '@/components/common/PolicyNavigation'

export const metadata = {
  title: 'Return & Replacement Policy — LOVIXA COSMETIC',
  description: 'Understand the free transit damage replacement guidelines for LOVIXA products.',
}

export default function ReturnRefundPolicyPage() {
  return (
    <div className="bg-[#FBF6F8] min-h-[75vh] py-6 sm:py-10 text-[#2B1822]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeaderBanner
          breadcrumbs={[
            { label: 'Return & Replacement Policy' }
          ]}
          badge="PEACE OF MIND COMMITMENT"
          title="Peace of Mind,"
          highlightTitle="Return & Transit Replacement Policy"
          subtitle="Understand our hygiene standards, transit damage replacement guarantee, and replacement procedure."
          imageSrc="/images/lovixa-hero-banner-products.jpg"
          imageAlt="LOVIXA Return and Replacement Policy"
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
              1. Hygiene &amp; Cosmetic Safety Guidelines
            </h2>
            <p>
              Due to the personal nature and strict hygiene standards applicable to cosmetic and hair care products, opened or unsealed items cannot be returned or restocked once used. This ensures that every customer receives 100% factory-sealed, untouched, and authentic bottles.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-sans font-bold text-[#2B1822]">
              2. Transit Damage &amp; Free Replacement (Strictly No Cash Refunds)
            </h2>
            <p>
              Your satisfaction and receiving an immaculate product are paramount. In the rare event that your LOVIXA bottle arrives damaged, leaking, or with broken tamper seals, we offer a 100% free brand-new replacement. Please note that all cosmetic sales are final, and we provide <strong>replacements only</strong> for verified transit damages; monetary or cash refunds are not provided.
            </p>
            <div className="p-5 rounded-2xl bg-[#E8C4D4]/20 border border-[#E8C4D4]/60 space-y-3 text-sm">
              <p className="font-semibold text-[#6B2D5C]">7-Day Transit Replacement Claim Procedure:</p>
              <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm text-[#2B1822]/70">
                <li>Notify our concierge within <strong>7 calendar days</strong> of parcel receipt.</li>
                <li>Send your Order Number along with 2–3 clear photographs/video of the outer package and damaged bottle to our email at <strong>lovixacosmetic@gmail.com</strong> or via WhatsApp at <strong>+91 97124 60509</strong>.</li>
                <li>Upon verification by our team, we will immediately dispatch a brand-new replacement bottle at zero additional cost to you.</li>
              </ol>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-sans font-bold text-[#2B1822]">
              3. Order Cancellation Prior to Dispatch
            </h2>
            <p>
              You may request order cancellation by emailing or WhatsApping us prior to courier handover. Once an order has been picked up by our logistics courier partner, dispatch must proceed, and standard transit replacement guidelines will apply.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-sans font-bold text-[#2B1822]">
              4. Replacement Only Policy (No Monetary Refunds)
            </h2>
            <p>
              All purchases made through LOVIXA are final. We do not provide monetary refunds (cash, UPI, or bank refunds). In case of verified damage or manufacturing defect, our commitment is to provide a brand-new, factory-sealed replacement product shipped swiftly to your address.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-sans font-bold text-[#2B1822]">
              5. Customer Care &amp; Replacement Inquiries
            </h2>
            <p>
              For any questions regarding your order or replacement assistance, reach our concierge team at:
            </p>
            <p className="p-4 rounded-2xl bg-[#E8C4D4]/20 border border-[#E8C4D4]/60 text-xs sm:text-sm">
              Email: <a href="mailto:lovixacosmetic@gmail.com" className="font-bold text-[#6B2D5C] underline">lovixacosmetic@gmail.com</a><br />
              WhatsApp: <a href="https://wa.me/919712460509" target="_blank" rel="noreferrer" className="font-bold text-[#6B2D5C] underline">+91 97124 60509</a><br />
              Instagram: <a href="https://www.instagram.com/lovixa_cosmetic" target="_blank" rel="noreferrer" className="font-bold text-[#6B2D5C] underline">@lovixa_cosmetic</a>
            </p>
          </section>
        </div>

        <PolicyNavigation />
      </div>
    </div>
  )
}
