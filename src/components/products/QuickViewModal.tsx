'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Star, ShoppingBag, CheckCircle2, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react'
import { useQuickViewStore } from '@/lib/quick-view/quick-view-store'
import { useCartStore } from '@/lib/cart/cart-store'
import { useCurrency } from '@/components/providers/StoreSettingsProvider'

export function QuickViewModal() {
  const { isOpen, product, closeQuickView } = useQuickViewStore()
  const { addItem, openCart } = useCartStore()
  const { formatPrice } = useCurrency()

  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  // Lock background scroll when QuickView modal is open
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
      if (e.key === 'Escape') closeQuickView()
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
  }, [isOpen, closeQuickView])

  if (!isOpen || !product) return null

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null

  const isOutOfStock = product.stock !== undefined && product.stock !== null ? product.stock <= 0 : false

  const handleAddToCart = () => {
    if (isOutOfStock) return
    addItem({
      productId: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: product.image,
      quantity,
      maxStock: product.stock != null ? product.stock : 50,
    })
    setIsAdded(true)
    setTimeout(() => {
      setIsAdded(false)
      closeQuickView()
      openCart()
    }, 800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={closeQuickView}
        className="fixed inset-0 bg-[#2B1822]/70 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Modal Container */}
      <div className="relative bg-[#FBF6F8] border border-[#E8C4D4]/70 rounded-[1.5rem] shadow-2xl max-w-3xl w-full overflow-hidden z-10 animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-[#2B1822] hover:text-[#6B2D5C] transition-colors border border-[#E8C4D4]/60 cursor-pointer shadow-xs"
          aria-label="Close Quick View"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-6 sm:p-8">
          {/* Product Image Column */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-white border border-[#E8C4D4]/60 group">
            {product.image ? (
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#2B1822]/30 font-sans font-bold text-3xl">
                {product.title.slice(0, 2).toUpperCase()}
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
              {product.badge && (
                <span className="bg-[#2B1822]/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm tracking-wider uppercase">
                  {product.badge}
                </span>
              )}
              {discountPercent && (
                <span className="bg-[#6B2D5C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  -{discountPercent}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Product Details Column */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              {/* Brand Tag */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#6B2D5C]">
                  {product.brand || 'LOVIXA COSMETIC'}
                </span>
                <span className="text-[10px] text-[#6B2D5C] bg-[#E8C4D4]/30 px-2 py-0.5 rounded-full border border-[#E8C4D4]/60 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6B2D5C] animate-pulse" />
                  In Stock
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-sans font-bold text-[#2B1822] tracking-tight leading-tight">
                {product.title}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2 text-xs">
                <div className="flex text-[#6B2D5C]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#6B2D5C]" />
                  ))}
                </div>
                <span className="font-bold text-[#2B1822]">{product.rating || 4.9}</span>
                <span className="text-[#2B1822]/60">({product.reviewCount || 38} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2.5 mt-3 py-2 border-y border-[#E8C4D4]/60">
                <span className="font-sans font-bold text-2xl text-[#2B1822]">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-sm text-[#2B1822]/40 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              {product.shortDescription && (
                <p className="text-xs text-[#2B1822]/75 leading-relaxed mt-3">
                  {product.shortDescription}
                </p>
              )}

              {/* Clean Formula Seals */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#E8C4D4]/60 text-[11px] text-[#2B1822]/70">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#6B2D5C] shrink-0" />
                  <span>Nature-Inspired Care</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#6B2D5C] shrink-0" />
                  <span>Everyday Self-Care</span>
                </div>
              </div>
            </div>

            {/* Actions: Quantity & Add to Cart */}
            <div className="space-y-3 pt-3">
              <div className="flex gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-[#E8C4D4]/60 rounded-full px-4 py-2 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-[#2B1822]/70 hover:text-[#6B2D5C] font-bold px-1 transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-[#2B1822]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-[#2B1822]/70 hover:text-[#6B2D5C] font-bold px-1 transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3 px-6 rounded-full font-sans font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 ${
                    isOutOfStock
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
                      : isAdded
                      ? 'bg-[#562349] text-white shadow-[#6B2D5C]/20 cursor-pointer'
                      : 'bg-[#6B2D5C] hover:bg-[#562349] text-white shadow-[#6B2D5C]/20 cursor-pointer'
                  }`}
                >
                  {isOutOfStock ? (
                    <span>Out of Stock</span>
                  ) : isAdded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>Added to Bag ✓</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Shopping Bag</span>
                    </>
                  )}
                </button>
              </div>

              {/* View Full Page Link */}
              <Link
                href={`/products/${product.slug}`}
                onClick={closeQuickView}
                className="w-full text-center text-xs font-medium text-[#6B2D5C] hover:text-[#562349] py-1 inline-flex items-center justify-center gap-1 group transition-colors"
              >
                <span>View Full Formulation Details</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
