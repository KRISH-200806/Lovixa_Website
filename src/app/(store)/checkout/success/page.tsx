'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowRight,
  Clock,
  Printer,
  ShieldAlert,
  ShoppingBag,
  ExternalLink,
  MessageCircle,
  QrCode,
  Truck,
  CheckCircle2,
} from 'lucide-react'
import { Suspense, useEffect, useState } from 'react'

function WhatsAppIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 2C6.516 2 2.016 6.5 2.016 12.016c0 1.953.563 3.844 1.625 5.484L2 22l4.672-1.609a9.98 9.98 0 0 0 5.359 1.547h.016c5.516 0 10.016-4.5 10.016-10.016 0-2.672-1.047-5.188-2.938-7.078A9.97 9.97 0 0 0 12.031 2zm0 18.234h-.016a8.28 8.28 0 0 1-4.234-1.156l-.313-.188-3.141 1.078 1.047-3.063-.203-.328a8.26 8.26 0 0 1-1.391-4.563c0-4.563 3.719-8.281 8.281-8.281 2.219 0 4.297.859 5.859 2.422a8.25 8.25 0 0 1 2.422 5.859c0 4.563-3.719 8.22-8.312 8.22zm4.547-6.188c-.25-.125-1.469-.734-1.703-.812-.234-.094-.406-.125-.578.125-.172.25-.672.828-.828 1-.156.172-.313.203-.563.078-.25-.125-1.062-.391-2.016-1.25a7.53 7.53 0 0 1-1.391-1.734c-.156-.25-.016-.391.109-.516.109-.109.25-.281.375-.422.125-.141.172-.25.25-.406.078-.172.047-.313-.016-.438-.078-.125-.578-1.406-.812-1.922-.219-.516-.438-.453-.594-.453-.156 0-.328-.016-.5-.016s-.453.063-.688.313c-.234.25-.906.891-.906 2.172s.922 2.516 1.047 2.688c.125.172 1.828 2.781 4.422 3.906.625.266 1.109.438 1.484.563.625.188 1.188.172 1.641.109.5-.078 1.469-.609 1.672-1.203.203-.594.203-1.094.141-1.203-.063-.109-.234-.172-.484-.297z" />
    </svg>
  )
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id') || 'LVX-2026-0001'
  const tokenFromUrl = searchParams.get('token')

  const [orderSnapshot, setOrderSnapshot] = useState<any>(null)
  const [liveOrder, setLiveOrder] = useState<any>(null)

  useEffect(() => {
    let token = tokenFromUrl

    // 1. Load local snapshot saved during checkout submit
    if (typeof window !== 'undefined') {
      try {
        const raw = sessionStorage.getItem('lovixa_last_order')
        if (raw) {
          const parsed = JSON.parse(raw)
          if (parsed.orderNumber === orderId) {
            setOrderSnapshot(parsed)
            if (!token && parsed.guestAccessToken) {
              token = parsed.guestAccessToken
            }
          }
        }
      } catch (e) { }
    }

    // 2. Fetch live order status from server with secure access token
    const tokenQuery = token ? `&token=${encodeURIComponent(token)}` : ''
    fetch(`/api/orders?orderNumber=${encodeURIComponent(orderId)}${tokenQuery}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.orders && data.orders.length > 0) {
          setLiveOrder(data.orders[0])
        }
      })
      .catch((err) => console.warn('Could not fetch order from server:', err))
  }, [orderId, tokenFromUrl])

  const businessNumber =
    orderSnapshot?.businessNumber ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    '919712460509'

  const whatsappUrl =
    orderSnapshot?.whatsappUrl ||
    `https://wa.me/${businessNumber}?text=${encodeURIComponent(
      `Hello LOVIXA! I have placed order #${orderId}. Please confirm product availability and payment instructions.`
    )}`

  const orderStatus = liveOrder?.orderStatus || 'awaiting_confirmation'
  const isPaid = liveOrder?.paymentStatus === 'paid'

  return (
    <div className="bg-[#FBF6F8] min-h-[85vh] py-10 sm:py-16 text-[#2B1822]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Main Card */}
        <div className="bg-white border border-[#E8C4D4]/70 rounded-3xl p-6 sm:p-10 shadow-sm text-center space-y-6">

          {/* Header Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-xs">
            <WhatsAppIcon className="w-9 h-9 sm:w-11 sm:h-11 fill-current" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200 font-sans">
              <Clock className="w-3.5 h-3.5" />
              <span>Awaiting WhatsApp Confirmation</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-bold text-[#2B1822] tracking-tight">
              Order Initiated Successfully!
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto font-sans leading-relaxed">
              Your order details have been securely recorded. Please send the pre-filled message on WhatsApp so our concierge team can verify stock and share payment instructions.
            </p>
          </div>

          {/* Primary Action Button: Re-open WhatsApp */}
          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-4 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm tracking-wider uppercase rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer font-sans active:scale-[0.99]"
            >
              <WhatsAppIcon className="w-5 h-5 fill-current" />
              <span>Send Order on WhatsApp</span>
              <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
            </a>
            <p className="text-[11px] text-stone-500 font-sans mt-2">
              Opens WhatsApp Web or mobile app. Tap &ldquo;Send&rdquo; inside WhatsApp to hand off your order.
            </p>
          </div>

          {/* Order Details Summary Box */}
          <div className="bg-[#FBF6F8] border border-[#E8C4D4]/70 rounded-2xl p-5 sm:p-6 text-left space-y-3.5 font-sans max-w-xl mx-auto">
            <div className="flex justify-between items-center text-xs pb-2.5 border-b border-[#E8C4D4]/50">
              <span className="text-stone-500">Order Reference</span>
              <strong className="font-mono text-[#6B2D5C] text-sm font-bold tracking-wide">
                #{orderId}
              </strong>
            </div>

            {orderSnapshot?.customerName && (
              <div className="flex justify-between items-center text-xs pb-2.5 border-b border-[#E8C4D4]/50">
                <span className="text-stone-500">Customer Name</span>
                <span className="font-semibold text-[#2B1822]">{orderSnapshot.customerName}</span>
              </div>
            )}

            {orderSnapshot?.customerPhone && (
              <div className="flex justify-between items-center text-xs pb-2.5 border-b border-[#E8C4D4]/50">
                <span className="text-stone-500">WhatsApp Mobile</span>
                <span className="font-semibold text-[#2B1822]">+91 {orderSnapshot.customerPhone}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-xs pb-2.5 border-b border-[#E8C4D4]/50">
              <span className="text-stone-500">Payment Method</span>
              <span className="font-semibold text-[#2B1822]">Manual UPI / Bank Transfer</span>
            </div>

            <div className="flex justify-between items-center text-xs pb-2.5 border-b border-[#E8C4D4]/50">
              <span className="text-stone-500">Payment Status</span>
              <span className={`inline-flex items-center gap-1 font-bold text-xs px-2.5 py-0.5 rounded-full ${isPaid
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-900'
                }`}>
                {isPaid ? 'Paid & Verified' : 'Awaiting Payment'}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-500">Order Status</span>
              <span className="font-bold text-[#6B2D5C] capitalize">
                {orderStatus.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Phase 7: Step-by-Step Manual Payment Workflow Guide */}
          <div className="text-left space-y-4 pt-4 border-t border-[#E8C4D4]/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B2D5C] font-sans flex items-center gap-1.5">
              <span>Next Steps: How Your Order Will Be Processed</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">

              <div className="p-3.5 bg-[#FBF6F8] rounded-xl border border-[#E8C4D4]/50 space-y-1">
                <div className="flex items-center gap-2 font-bold text-[#2B1822]">
                  <span className="w-5 h-5 rounded-full bg-[#6B2D5C] text-white flex items-center justify-center text-[10px]">1</span>
                  <span>Review on WhatsApp</span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  Our official team checks availability in our Ayurvedic dispensary and confirms shipping charges.
                </p>
              </div>

              <div className="p-3.5 bg-[#FBF6F8] rounded-xl border border-[#E8C4D4]/50 space-y-1">
                <div className="flex items-center gap-2 font-bold text-[#2B1822]">
                  <span className="w-5 h-5 rounded-full bg-[#6B2D5C] text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Official UPI / QR Shared</span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  We share our verified business UPI ID or payment QR code directly in the WhatsApp chat.
                </p>
              </div>

              <div className="p-3.5 bg-[#FBF6F8] rounded-xl border border-[#E8C4D4]/50 space-y-1">
                <div className="flex items-center gap-2 font-bold text-[#2B1822]">
                  <span className="w-5 h-5 rounded-full bg-[#6B2D5C] text-white flex items-center justify-center text-[10px]">3</span>
                  <span>Complete Payment &amp; Verify</span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  Pay via GPay, PhonePe, Paytm, or NetBanking. Share the reference / UTR on WhatsApp for verification.
                </p>
              </div>

              <div className="p-3.5 bg-[#FBF6F8] rounded-xl border border-[#E8C4D4]/50 space-y-1">
                <div className="flex items-center gap-2 font-bold text-[#2B1822]">
                  <span className="w-5 h-5 rounded-full bg-[#6B2D5C] text-white flex items-center justify-center text-[10px]">4</span>
                  <span>Dispatch &amp; Live Tracking</span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  Products are dispatched within 24 hours. You receive live airway bill tracking on WhatsApp.
                </p>
              </div>

            </div>
          </div>

          {/* Security Alert (Phase 7 & 10) */}
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start gap-3 text-left font-sans text-xs text-amber-900">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="block font-bold">Important Security Notice</strong>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                LOVIXA team will <strong>NEVER</strong> ask for your UPI PIN, banking passwords, OTPs, or credit card numbers. Never share confidential payment credentials with anyone.
              </p>
            </div>
          </div>

          {/* Footer CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-[#E8C4D4]/50 font-sans">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-6 py-2.5 border border-[#E8C4D4] bg-white text-[#2B1822] font-semibold text-xs rounded-full hover:bg-[#FBF6F8] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs uppercase tracking-wider"
            >
              <Printer className="w-4 h-4 text-[#6B2D5C]" />
              <span>Print Order Details</span>
            </button>

            <Link
              href="/products"
              className="w-full sm:w-auto px-7 py-2.5 bg-[#6B2D5C] hover:bg-[#562349] text-white font-semibold text-xs rounded-full transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer uppercase tracking-wider"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4 text-[#E8C4D4]" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center text-xs text-stone-500 font-sans">
          Loading order confirmation...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
