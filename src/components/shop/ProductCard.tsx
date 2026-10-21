'use client'

import React, { useState } from 'react'
import { useCart } from '@/context/CartContext'
import type { CosmeticProduct } from '@/data/mockCosmetics'

interface ProductCardProps {
  product: CosmeticProduct
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [selectedShadeIndex, setSelectedShadeIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const hasShades = Boolean(product.hasShades && product.shades && product.shades.length > 0)
  const activeShade = hasShades && product.shades ? product.shades[selectedShadeIndex] : undefined

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAdding(true)

    addItem({
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: product.image,
      selectedShade: activeShade
        ? {
            shadeName: activeShade.shadeName,
            colorHex: activeShade.colorHex,
            sku: activeShade.sku,
          }
        : undefined,
    })

    setTimeout(() => {
      setIsAdding(false)
    }, 600)
  }

  return (
    <div className="group relative bg-brand-50/60 border border-brand-200 rounded-radius-lg overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-brand-500/60 hover:shadow-elev-3 hover:bg-brand-50/90">
      {/* Top Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-50">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase bg-brand-500 text-neutral-0 rounded-radius-pill shadow-elev-1">
              Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase bg-background/90 backdrop-blur-sm text-brand-500 border border-brand-200 rounded-radius-pill">
              New Arrival
            </span>
          )}
          {discountPercent && (
            <span className="px-2.5 py-1 text-[11px] font-bold bg-semantic-success text-neutral-0 rounded-radius-pill">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            setIsWishlisted(!isWishlisted)
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-md border border-brand-200 flex items-center justify-center text-neutral-500 hover:text-brand-500 hover:scale-110 transition-all z-10"
          aria-label="Add to wishlist"
        >
          <svg
            className={`w-4 h-4 ${isWishlisted ? 'fill-brand-500 text-brand-500' : 'fill-none'}`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Quick Add Overlay on desktop hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block z-10">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full py-2.5 px-4 bg-brand-500 hover:bg-brand-600 text-neutral-0 text-body-xs font-semibold rounded-full backdrop-blur-md border border-brand-500 transition-all shadow-elev-2 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isAdding ? (
              <span className="text-neutral-0 font-bold">Added to Bag ✓</span>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 text-[11px] text-neutral-500 uppercase tracking-wider mb-1.5">
            <span>{product.category.name}</span>
            <div className="flex items-center gap-1 text-brand-500 font-semibold">
              <span>★</span>
              <span>{product.rating}</span>
              <span className="text-neutral-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-sans text-body-sm font-bold text-foreground group-hover:text-brand-500 transition-colors line-clamp-1">
            {product.title}
          </h3>

          {/* Tagline */}
          <p className="text-body-xs text-neutral-500 line-clamp-1 mt-1 font-sans">
            {product.tagline}
          </p>

          {/* Shade Swatches */}
          {hasShades && product.shades && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1.5">
                <span>Shade:</span>
                <span className="font-medium text-foreground truncate max-w-[140px]">
                  {activeShade?.shadeName}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {product.shades.map((shade, idx) => (
                  <button
                    key={shade.shadeName}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      setSelectedShadeIndex(idx)
                    }}
                    className={`w-5 h-5 rounded-full border transition-all ${
                      selectedShadeIndex === idx
                        ? 'border-brand-500 scale-110 ring-2 ring-brand-500/40'
                        : 'border-brand-200 hover:border-brand-500 opacity-90'
                    }`}
                    style={{ backgroundColor: shade.colorHex }}
                    title={shade.shadeName}
                    aria-label={`Select shade ${shade.shadeName}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pricing and Mobile Add Button */}
        <div className="pt-4 mt-3 border-t border-brand-200 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-h5 font-bold text-foreground">
              ₹{product.price}
            </span>
            {product.compareAtPrice && (
              <span className="text-body-xs text-neutral-400 line-through">
                ₹{product.compareAtPrice}
              </span>
            )}
          </div>

          {/* Mobile direct Add button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="md:hidden px-3.5 py-1.5 rounded-full bg-brand-500 text-neutral-0 text-body-xs font-semibold hover:bg-brand-600 transition-colors shadow-elev-1 cursor-pointer"
          >
            {isAdding ? '✓' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}
