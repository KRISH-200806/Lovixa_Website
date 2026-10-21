'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  Loader2,
} from 'lucide-react'
import { useCartStore } from '@/lib/cart/cart-store'
import { useCurrency } from '@/components/providers/StoreSettingsProvider'
import { FreeShippingBar } from '@/components/cart/FreeShippingBar'
import { PageHeaderBanner } from '@/components/common/PageHeaderBanner'

export default function CartPage() {
  const { formatPrice } = useCurrency()
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getDiscountAmount,
    getShippingFee,
    getTaxAmount,
    getGrandTotal,
    taxConfig,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCartStore()

  const [promoInput, setPromoInput] = useState('')
  const [promoError, setPromoError] = useState('')
  const [isValidating, setIsValidating] = useState(false)

  const subtotal = getSubtotal()
  const discountAmount = getDiscountAmount()
  const shippingFee = getShippingFee()
  const taxAmount = getTaxAmount()
  const grandTotal = getGrandTotal()

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!promoInput.trim()) return
    setIsValidating(true)
    setPromoError('')

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoInput.trim(),
          subtotal,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.valid) {
        setPromoError(data.error || 'Invalid promo code')
        return
      }

      applyCoupon({
        code: data.code,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minOrderAmount: data.minOrderAmount,
        maxDiscountAmount: data.maxDiscountAmount,
      })
      setPromoInput('')
    } catch {
      setPromoError('Failed to validate promo code')
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <div className="bg-[#FBF6F8] min-h-[75vh] py-6 sm:py-10 text-[#2B1822]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeaderBanner
          breadcrumbs={[{ label: 'Shopping Bag' }]}
          badge="LOVIXA COSMETIC"
          title="Your Shopping Bag,"
          highlightTitle="Review Essentials & Checkout"
          subtitle="Carefully prepared botanical formulations designed for your everyday hair and skincare."
          imageSrc="/images/lovixa-hero-banner-products.jpg"
          imageAlt="LOVIXA Shopping Bag"
          priority
        />

        {items.length > 0 && (
          <div className="flex justify-end pb-4 pt-6">
            <button
              onClick={clearCart}
              className="text-xs text-stone-500 hover:text-rose-600 transition-colors flex items-center gap-1 font-sans cursor-pointer px-3 py-1 rounded-full hover:bg-rose-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Empty Bag ({items.length})</span>
            </button>
          </div>
        )}

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="max-w-xl mx-auto text-center py-16 px-4 bg-[#E8C4D4]/25 border border-[#E8C4D4]/70 rounded-3xl shadow-xs mt-6">
            <div className="w-20 h-20 rounded-full bg-white border border-[#E8C4D4]/60 flex items-center justify-center text-[#6B2D5C] mx-auto mb-6 shadow-xs">
              <ShoppingBag className="w-9 h-9" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-sans font-bold text-[#2B1822] mb-3">
              Your shopping bag is currently empty
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed font-sans mb-8 max-w-md mx-auto">
              Explore LOVIXA&apos;s nature-inspired hair and skin essentials and begin your daily self-care ritual.
            </p>
            <Link
              href="/products"
              className="btn-primary !px-8 !py-4 shadow-md inline-flex items-center gap-2"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 text-[#E8C4D4]" />
            </Link>
          </div>
        ) : (
          /* Full Cart Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-6">
            {/* Left Column: Items List (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free shipping progress indicator */}
              <div className="bg-white p-4 rounded-2xl border border-[#E8C4D4]/60 shadow-2xs">
                <FreeShippingBar subtotal={subtotal} />
              </div>

              {/* Items Card List */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId || 'default'}`}
                    className="p-4 sm:p-6 rounded-3xl bg-white border border-[#E8C4D4]/60 hover:border-[#6B2D5C]/40 shadow-2xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6"
                  >
                    {/* Thumbnail & Meta */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#FBF6F8] border border-[#E8C4D4]/50 shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-sans font-bold text-lg text-[#2B1822]/40">
                            LX
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 space-y-1">
                        <Link
                          href={item.slug ? `/products/${item.slug}` : '/products'}
                          className="font-sans font-bold text-base sm:text-lg text-[#2B1822] hover:text-[#6B2D5C] transition-colors line-clamp-1"
                        >
                          {item.title}
                        </Link>
                        {item.optionsSummary && (
                          <p className="text-xs text-stone-500 font-sans">
                            {item.optionsSummary}
                          </p>
                        )}
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="font-bold text-sm text-[#2B1822] font-sans">
                            {formatPrice(item.price)}
                          </span>
                          {item.compareAtPrice && item.compareAtPrice > item.price && (
                            <span className="text-xs text-stone-400 line-through font-sans">
                              {formatPrice(item.compareAtPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls & Remove Action */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E8C4D4]/60">
                      <div className="flex items-center border border-[#E8C4D4]/70 rounded-full px-2.5 py-1 bg-[#FBF6F8]">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1, item.variantId)
                          }
                          className="p-1 text-stone-600 hover:text-[#6B2D5C] transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-[#2B1822] font-sans">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1, item.variantId)
                          }
                          className="p-1 text-stone-600 hover:text-[#6B2D5C] transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-sans font-bold text-base text-[#2B1822] block">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.productId, item.variantId)}
                          className="text-[11px] text-rose-600 hover:text-rose-800 transition-colors inline-flex items-center gap-1 font-sans cursor-pointer mt-0.5"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping Link */}
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#6B2D5C] hover:text-[#562349] uppercase tracking-wider font-sans transition-colors"
                >
                  <span>&larr; Continue Shopping</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Order Summary (4 cols) */}
            <div className="lg:col-span-4">
              <div className="bg-[#E8C4D4]/25 border border-[#E8C4D4]/70 rounded-3xl p-6 sm:p-8 space-y-6 sticky top-28 shadow-2xs">
                <h2 className="text-lg font-sans font-bold text-[#2B1822] border-b border-[#E8C4D4]/70 pb-4">
                  Order Summary
                </h2>

                {/* Promo Code Input */}
                <div>
                  <label className="block text-xs font-bold text-[#2B1822] uppercase tracking-wider mb-2 font-sans">
                    Promotional Code
                  </label>
                  {coupon ? (
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-emerald-300 text-xs">
                      <div className="flex items-center gap-2 text-emerald-800 font-semibold font-sans">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Code applied: <strong>{coupon.code}</strong></span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-xs text-rose-600 hover:text-rose-800 font-bold underline cursor-pointer font-sans"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 px-3.5 py-2.5 rounded-full bg-white border border-[#E8C4D4]/70 text-xs text-[#2B1822] uppercase placeholder:normal-case placeholder:text-stone-400 focus:outline-none focus:border-[#6B2D5C] focus:ring-1 focus:ring-[#6B2D5C] font-sans"
                      />
                      <button
                        type="submit"
                        disabled={isValidating || !promoInput.trim()}
                        className="px-5 py-2.5 rounded-full bg-[#6B2D5C] hover:bg-[#562349] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 font-sans uppercase tracking-wider"
                      >
                        {isValidating && <Loader2 className="w-3 h-3 animate-spin" />}
                        <span>Apply</span>
                      </button>
                    </form>
                  )}
                  {promoError && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium font-sans">{promoError}</p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 text-xs sm:text-sm text-stone-600 font-sans border-t border-[#E8C4D4]/70 pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#2B1822]">{formatPrice(subtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#6B2D5C] font-semibold">
                      <span>Discount ({coupon?.code})</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Estimated Shipping</span>
                    <span className={`font-semibold ${shippingFee === 0 ? 'text-[#6B2D5C]' : 'text-[#2B1822]'}`}>
                      {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                    </span>
                  </div>

                  {taxConfig?.enabled !== false && (
                    <div className="flex justify-between text-xs text-stone-500">
                      <span>
                        {taxConfig?.taxLabel || 'GST'} ({taxConfig?.ratePercentage || 18}%)
                      </span>
                      <span className="font-medium text-[#2B1822]">
                        {taxConfig?.pricesIncludeTax ? `Included (${formatPrice(taxAmount)})` : formatPrice(taxAmount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-base font-sans font-bold text-[#2B1822] pt-3 border-t border-[#E8C4D4]/70">
                    <span>Grand Total</span>
                    <span>{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  className="btn-primary w-full !py-4 shadow-md flex items-center justify-center gap-2 group font-sans"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 text-[#E8C4D4] group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Trust Badges */}
                <div className="pt-2 border-t border-[#E8C4D4]/60 space-y-2 text-xs text-stone-600 font-sans">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#6B2D5C] shrink-0" />
                    <span>256-bit Encrypted Checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#6B2D5C] shrink-0" />
                    <span>Pan-India Delivery in 3–5 Business Days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-[#6B2D5C] shrink-0" />
                    <span>7-Day Transit Damage Assistance</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
