'use client'

import { useCartStore } from '@/lib/cart/cart-store'
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useCurrency } from '@/components/providers/StoreSettingsProvider'
import { FreeShippingBar } from './FreeShippingBar'
import { useState, useEffect } from 'react'

export function CartDrawer() {
  const { formatPrice } = useCurrency()
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
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

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (!isOpen) return
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
    const prevBodyOverflow = document.body.style.overflow
    const prevHtmlOverflow = document.documentElement.style.overflow
    const prevBodyPaddingRight = document.body.style.paddingRight

    document.documentElement.classList.add('modal-open')
    document.body.classList.add('modal-open')
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.documentElement.classList.remove('modal-open')
      document.body.classList.remove('modal-open')
      document.documentElement.style.overflow = prevHtmlOverflow
      document.body.style.overflow = prevBodyOverflow
      document.body.style.paddingRight = prevBodyPaddingRight
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, closeCart])

  if (!isOpen) return null

  const subtotal = getSubtotal()
  const discountAmount = getDiscountAmount()
  const shippingFee = getShippingFee()
  const taxAmount = getTaxAmount()
  const grandTotal = getGrandTotal()

  const handleApplyPromo = async () => {
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
    } catch (err) {
      console.error(err)
      setPromoError('Failed to validate promo code')
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Slide-out Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-6 md:pl-10">
        <div className="w-screen max-w-full sm:max-w-md md:max-w-lg bg-[#FBF6F8] shadow-2xl flex flex-col h-full border-l border-[#E8C4D4]/60">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E8C4D4]/50 flex items-center justify-between bg-[#FBF6F8] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#E8C4D4]/30 flex items-center justify-center text-[#6B2D5C]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#2B1822] font-sans">Shopping Bag</h2>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-[#E8C4D4]/30 text-[#6B2D5C] border border-[#E8C4D4]/60 rounded-full font-sans">
                {items.length}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-full text-[#2B1822]/60 hover:text-[#2B1822] hover:bg-[#E8C4D4]/20 transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-4 sm:px-5 py-2.5 bg-[#FBF6F8] border-b border-[#E8C4D4]/40 shrink-0">
            <FreeShippingBar subtotal={subtotal} />
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-[#E8C4D4]/30 border border-[#E8C4D4]/50 flex items-center justify-center mb-4 text-[#6B2D5C]">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="text-base font-serif font-bold text-[#2B1822]">Your shopping bag is empty</h3>
                <p className="text-xs text-[#2B1822]/70 mt-1 max-w-xs font-sans">
                  Explore our collection of thoughtful haircare and skincare essentials.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-6 px-6 py-2.5 bg-[#6B2D5C] hover:bg-[#562349] text-white text-xs font-bold tracking-wider uppercase rounded-full transition-all cursor-pointer shadow-sm font-sans"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId || 'base'}`}
                  className="flex gap-3 sm:gap-3.5 p-3 sm:p-3.5 bg-white hover:bg-[#FBF6F8] rounded-2xl border border-[#E8C4D4]/50 transition-all"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#FBF6F8] rounded-xl border border-[#E8C4D4]/40 overflow-hidden shrink-0 flex items-center justify-center relative">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ShoppingBag className="w-6 h-6 text-stone-300" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-[#2B1822] truncate font-sans">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeItem(item.productId, item.variantId)}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-1 rounded-md hover:bg-rose-50 cursor-pointer shrink-0"
                          aria-label={`Remove ${item.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.optionsSummary && (
                        <p className="text-[11px] text-[#2B1822]/60 mt-0.5 truncate font-sans">
                          {item.optionsSummary}
                        </p>
                      )}

                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-[#2B1822] font-sans">
                          {formatPrice(item.price)}
                        </span>
                        {item.compareAtPrice && item.compareAtPrice > item.price && (
                          <span className="text-[11px] text-stone-400 line-through font-sans">
                            {formatPrice(item.compareAtPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2 pt-1">
                      <div className="flex items-center border border-[#E8C4D4]/80 rounded-lg bg-white shadow-2xs">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                          className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-[#2B1822]/60 hover:text-[#6B2D5C] transition cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-[#2B1822] min-w-[20px] text-center font-sans">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                          className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-[#2B1822]/60 hover:text-[#6B2D5C] transition cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-[#2B1822] font-sans">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#E8C4D4]/50 bg-[#FBF6F8] space-y-3.5 shrink-0">
              {/* Promo Code Input */}
              <div>
                {coupon ? (
                  <div className="flex items-center justify-between px-3 py-1.5 bg-white border border-[#6B2D5C]/30 rounded-xl text-xs text-[#6B2D5C]">
                    <span className="font-semibold truncate">
                      Applied: {coupon.code}{' '}
                      ({coupon.discountType === 'percentage'
                        ? `-${coupon.discountValue}%`
                        : coupon.discountType === 'fixed_amount'
                        ? `-$${coupon.discountValue}`
                        : 'Free Shipping'})
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-[#6B2D5C] hover:underline font-bold ml-2 shrink-0 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                      className="text-xs px-3 py-2 bg-white border border-[#E8C4D4]/70 text-[#2B1822] rounded-xl flex-1 focus:outline-none focus:border-[#6B2D5C] uppercase font-sans placeholder:normal-case placeholder:text-[#2B1822]/40"
                    />
                    <button
                      onClick={handleApplyPromo}
                      disabled={isValidating || !promoInput.trim()}
                      className="px-3.5 py-2 bg-[#6B2D5C] text-white text-xs font-bold rounded-xl hover:bg-[#562349] transition-colors disabled:opacity-50 flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      {isValidating && <Loader2 className="w-3 h-3 animate-spin" />}
                      <span>Apply</span>
                    </button>
                  </div>
                )}
                {promoError && <p className="text-[11px] text-rose-600 mt-1 font-sans">{promoError}</p>}
              </div>

              {/* Subtotal breakdown */}
              <div className="space-y-1.5 text-xs text-[#2B1822]/70 font-sans">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#2B1822]">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#6B2D5C] font-bold">
                    <span>Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={`font-semibold ${shippingFee === 0 ? 'text-emerald-700' : 'text-[#2B1822]'}`}>
                    {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-bold text-[#2B1822] pt-2 border-t border-[#E8C4D4]/50">
                  <span>Total</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-0.5">
                <Link
                  href="/checkout"
                  prefetch={true}
                  onClick={closeCart}
                  className="w-full py-3 sm:py-3.5 bg-[#6B2D5C] hover:bg-[#562349] text-white font-bold text-xs sm:text-sm tracking-wider uppercase rounded-full transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer text-center"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/cart"
                  prefetch={true}
                  onClick={closeCart}
                  className="w-full py-2.5 bg-white text-[#2B1822] hover:text-[#6B2D5C] border border-[#E8C4D4]/80 font-bold text-xs tracking-wider uppercase rounded-full hover:bg-[#FBF6F8] transition-all flex items-center justify-center cursor-pointer text-center"
                >
                  <span>View Full Bag</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
