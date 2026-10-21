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
    <div className="bg-[#FBF6F8] min-h-[75vh] py-4 sm:py-6 text-[#2B1822] flex items-center justify-center">
      <div className="max-w-lg w-full mx-auto px-4 sm:px-6">

        {/* Main Compact Card */}
        <div className="bg-white border border-[#E8C4D4]/70 rounded-3xl p-5 sm:p-6 shadow-lg shadow-[#6B2D5C]/5 text-center space-y-4">

          {/* Header Icon & Status Pill */}
          <div className="space-y-2">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-200/80 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <WhatsAppIcon className="w-6 h-6 fill-current" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200/70 font-sans">
              <Clock className="w-3 h-3 text-amber-700" />
              <span>Awaiting WhatsApp Confirmation</span>
            </div>

            <h1 className="text-lg sm:text-xl font-sans font-bold text-[#2B1822] tracking-tight">
              Order Initiated Successfully!
            </h1>

            <p className="text-[11px] sm:text-xs text-[#2B1822]/70 max-w-sm mx-auto font-sans leading-relaxed">
              Your order has been recorded. Tap below to send details on WhatsApp so our concierge team can verify stock and share payment instructions.
            </p>
          </div>

          {/* Primary Action Button: Re-open WhatsApp */}
          <div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs tracking-wider uppercase rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer font-sans active:scale-[0.98]"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" />
              <span>Send Order on WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-90" />
            </a>
            <p className="text-[10px] text-stone-400 font-sans mt-1">
              Opens WhatsApp Web / Mobile app with your order pre-filled.
            </p>
          </div>

          {/* Compact Order Details Box */}
          <div className="bg-[#FDFBFC] border border-[#E8C4D4]/60 rounded-2xl p-3.5 sm:p-4 text-left font-sans space-y-2">
            
            {/* Header row: Order Ref & Total */}
            <div className="flex justify-between items-center pb-2 border-b border-[#E8C4D4]/50">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">Order Reference</span>
                <strong className="font-mono text-[#6B2D5C] text-sm font-extrabold tracking-wide">
                  #{orderId}
                </strong>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">Total Payable</span>
                <span className="font-bold text-[#6B2D5C] text-base">
                  {orderSnapshot?.currencySymbol || '₹'}
                  {Number(orderSnapshot?.grandTotal ?? liveOrder?.grandTotal ?? 0).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            {/* Details 2-Column Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs pt-0.5">
              {orderSnapshot?.customerName && (
                <div>
                  <span className="text-[11px] text-stone-400 block">Customer</span>
                  <span className="font-semibold text-[#2B1822] truncate block">{orderSnapshot.customerName}</span>
                </div>
              )}

              {orderSnapshot?.customerPhone && (
                <div>
                  <span className="text-[11px] text-stone-400 block">WhatsApp Mobile</span>
                  <span className="font-semibold text-[#2B1822] block">+91 {orderSnapshot.customerPhone}</span>
                </div>
              )}

              <div>
                <span className="text-[11px] text-stone-400 block">Payment Mode</span>
                <span className="font-semibold text-[#2B1822] block">Manual UPI / Bank</span>
              </div>

              <div>
                <span className="text-[11px] text-stone-400 block">Payment Status</span>
                <span className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full mt-0.5 ${
                  isPaid
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-900'
                }`}>
                  {isPaid ? 'Paid & Verified' : 'Awaiting Payment'}
                </span>
              </div>
            </div>
          </div>

          {/* Compact 4-Step Pipeline */}
          <div className="text-left space-y-2 pt-2 border-t border-[#E8C4D4]/50">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B2D5C] font-sans block">
              What Happens Next:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-sans">
              <div className="p-2.5 bg-[#FBF6F8] rounded-xl border border-[#E8C4D4]/50 space-y-1">
                <span className="w-5 h-5 rounded-full bg-[#6B2D5C] text-white inline-flex items-center justify-center text-[10px] font-bold mx-auto">1</span>
                <p className="text-[11px] font-bold text-[#2B1822] leading-tight">Send on WA</p>
                <p className="text-[10px] text-stone-500 leading-tight">Verify stock</p>
              </div>

              <div className="p-2.5 bg-[#FBF6F8] rounded-xl border border-[#E8C4D4]/50 space-y-1">
                <span className="w-5 h-5 rounded-full bg-[#6B2D5C] text-white inline-flex items-center justify-center text-[10px] font-bold mx-auto">2</span>
                <p className="text-[11px] font-bold text-[#2B1822] leading-tight">UPI / QR</p>
                <p className="text-[10px] text-stone-500 leading-tight">Shared in chat</p>
              </div>

              <div className="p-2.5 bg-[#FBF6F8] rounded-xl border border-[#E8C4D4]/50 space-y-1">
                <span className="w-5 h-5 rounded-full bg-[#6B2D5C] text-white inline-flex items-center justify-center text-[10px] font-bold mx-auto">3</span>
                <p className="text-[11px] font-bold text-[#2B1822] leading-tight">Pay &amp; Verify</p>
                <p className="text-[10px] text-stone-500 leading-tight">Share UTR</p>
              </div>

              <div className="p-2.5 bg-[#FBF6F8] rounded-xl border border-[#E8C4D4]/50 space-y-1">
                <span className="w-5 h-5 rounded-full bg-[#6B2D5C] text-white inline-flex items-center justify-center text-[10px] font-bold mx-auto">4</span>
                <p className="text-[11px] font-bold text-[#2B1822] leading-tight">Dispatch</p>
                <p className="text-[10px] text-stone-500 leading-tight">Within 24h</p>
              </div>
            </div>
          </div>

          {/* Compact Security Strip */}
          <div className="p-2.5 bg-amber-50/70 border border-amber-200/70 rounded-xl flex items-center gap-2 text-left font-sans text-[11px] text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <p className="leading-tight text-stone-600">
              <strong className="text-amber-900">Security Note:</strong> LOVIXA team will <strong>NEVER</strong> ask for your UPI PIN, passwords, or OTPs.
            </p>
          </div>

          {/* Compact Footer CTAs */}
          <div className="flex items-center justify-center gap-2.5 pt-2 border-t border-[#E8C4D4]/50 font-sans">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 border border-[#E8C4D4] bg-white text-[#2B1822] font-semibold text-xs rounded-full hover:bg-[#FBF6F8] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs uppercase tracking-wider"
            >
              <Printer className="w-3.5 h-3.5 text-[#6B2D5C]" />
              <span>Print Details</span>
            </button>

            <Link
              href="/products"
              className="px-5 py-2 bg-[#6B2D5C] hover:bg-[#562349] text-white font-semibold text-xs rounded-full transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer uppercase tracking-wider"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E8C4D4]" />
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
