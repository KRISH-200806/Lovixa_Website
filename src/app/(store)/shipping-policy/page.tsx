import Link from 'next/link'
import { Truck, ShieldCheck, Clock, MapPin, Sparkles } from 'lucide-react'
import { PageHeaderBanner } from '@/components/common/PageHeaderBanner'
import { PolicyNavigation } from '@/components/common/PolicyNavigation'

export const metadata = {
  title: 'Shipping Policy — LOVIXA COSMETIC',
  description: 'Detailed shipping guidelines, dispatch timeframes, and pan-India delivery details for LOVIXA orders.',
}

export default function ShippingPolicyPage() {
  return (
    <div className="bg-[#FBF6F8] min-h-[75vh] py-6 sm:py-10 text-[#2B1822]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeaderBanner
          breadcrumbs={[
            { label: 'Shipping Policy' }
          ]}
          badge="DELIVERY & DISPATCH"
          title="Prompt Pan-India Delivery,"
          highlightTitle="Dispatched Fast With Care"
          subtitle="Explore dispatch schedules, delivery timelines across India, tracking, and trusted courier partners."
          imageSrc="/images/lovixa-hero-banner-products.jpg"
          imageAlt="LOVIXA Shipping Policy"
          priority
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="space-y-1 border-b border-[#E8C4D4]/60 pb-6">
          <p className="text-xs text-[#2B1822]/60 font-sans">
            Last Updated: October 2026 • LOVIXA COSMETIC
          </p>
        </div>

        {/* Policy Content */}
        <div className="space-y-8 text-sm sm:text-base text-[#2B1822]/85 leading-relaxed font-sans">
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#2B1822]">
              1. Processing &amp; Dispatch Timeframe
            </h2>
            <p>
              Every LOVIXA order is inspected and hand-packed with protective cushioning to ensure your amber bottles arrive in pristine condition.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-[#2B1822]/75">
              <li>Orders placed Monday through Saturday before 2:00 PM IST are processed within 24 to 48 hours.</li>
              <li>Orders placed on Sundays or gazetted public holidays are processed on the subsequent working day.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#2B1822]">
              2. Pan-India Delivery Timelines
            </h2>
            <p>
              We partner with trusted tier-1 logistics couriers across India:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#E8C4D4]/20 border border-[#E8C4D4]/60">
                <h4 className="font-bold text-[#6B2D5C] text-sm">Metro Cities</h4>
                <p className="text-xs text-[#2B1822]/70 mt-1">Delhi NCR, Mumbai, Bengaluru, Ahmedabad, Pune, Chennai, Kolkata: <strong>2–4 Business Days</strong>.</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#E8C4D4]/20 border border-[#E8C4D4]/60">
                <h4 className="font-bold text-[#6B2D5C] text-sm">Rest of India &amp; Tier 2/3</h4>
                <p className="text-xs text-[#2B1822]/70 mt-1">Regional hubs and non-metro districts: <strong>3–6 Business Days</strong> depending on postal connectivity.</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#2B1822]">
              3. Shipping Fees &amp; Thresholds
            </h2>
            <p>
              We provide <strong>FREE Express Pan-India Shipping</strong> on all orders of <strong>₹999 and above</strong>. For orders below ₹999, shipping charges are not fixed and are calculated dynamically at checkout based on your delivery pincode and regional courier zone to ensure the most cost-effective and secure handling.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#2B1822]">
              4. Real-Time Tracking Information
            </h2>
            <p>
              Immediately upon courier pickup, an automated notification containing your courier name, Air Waybill (AWB) number, and live tracking URL will be sent to your WhatsApp and email provided at checkout.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#2B1822]">
              5. Queries &amp; Delivery Assistance
            </h2>
            <p>
              If you experience courier delay, non-delivery, or need address amendments prior to dispatch, please contact our support desk immediately:
            </p>
            <p className="p-4 rounded-2xl bg-[#E8C4D4]/20 border border-[#E8C4D4]/60 text-xs sm:text-sm">
              Email: <a href="mailto:lovixacosmetic@gmail.com" className="font-bold text-[#6B2D5C] underline">lovixacosmetic@gmail.com</a><br />
              WhatsApp: <a href="https://wa.me/919712460509" target="_blank" rel="noreferrer" className="font-bold text-[#6B2D5C] underline">+91 97124 60509</a><br />
              Hours: Monday – Saturday • 10:00 AM – 6:00 PM IST
            </p>
          </section>
        </div>

        <PolicyNavigation />
      </div>
    </div>
  )
}
