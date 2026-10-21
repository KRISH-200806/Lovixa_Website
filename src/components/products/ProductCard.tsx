'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star, Heart, Check, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/cart/cart-store'
import { useWishlistStore } from '@/lib/wishlist/wishlist-store'
import { useCurrency } from '@/components/providers/StoreSettingsProvider'
import { useState } from 'react'

export interface ProductCardProps {
  id: string
  title: string
  slug: string
  price: number
  compareAtPrice?: number
  image?: string
  brand?: string
  rating?: number
  reviewCount?: number
  badge?: string
  shortDescription?: string
}

const SIZES: Record<string, string> = {
  'lovixa-shampoo': '500ml',
  'lovixa-hair-oil': '50ml',
  'lovixa-hair-care-duo': '500ml + 50ml',
}

export function ProductCard(props: ProductCardProps) {
  const {
    id,
    title,
    slug,
    price,
    compareAtPrice,
    image,
    rating = 5.0,
    reviewCount = 1240,
    badge = 'B1G1 + FREE GIFT',
  } = props

  const { addItem, openCart } = useCartStore()
  const { formatPrice } = useCurrency()
  const { toggleItem, isInWishlist } = useWishlistStore()
  const isWishlisted = isInWishlist(id)
  const [justAdded, setJustAdded] = useState(false)

  const sizeLabel = SIZES[slug]

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: id,
      title,
      slug,
      price,
      compareAtPrice,
      image,
      quantity: 1,
      maxStock: 50,
      optionsSummary: sizeLabel,
    })
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1600)
    openCart()
  }

  return (
    <div className="group bg-white flex flex-col justify-between transition-all duration-300">
      {/* Square Thumbnail Container (The Wellness Shop Style) */}
      <div className="relative aspect-square w-full bg-[#FBF6F8] overflow-hidden mb-3">
        <Link href={`/products/${slug}`} className="block w-full h-full relative">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300 font-sans font-bold text-2xl">
              {title.slice(0, 2).toUpperCase()}
            </div>
          )}
        </Link>

        {/* Top-Left Rich Plum Promo Tag Badge */}
        <div className="absolute top-2 left-2 z-10 pointer-events-none">
          <span className="bg-[#6B2D5C] text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 tracking-wider uppercase shadow-xs">
            {badge || 'B1G1 + FREE GIFT'}
          </span>
        </div>

        {/* Wishlist Heart on Top Right */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleItem({
              productId: id,
              title,
              slug,
              price,
              compareAtPrice,
              image,
            })
          }}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 backdrop-blur-xs transition-all cursor-pointer shadow-xs z-10 ${
            isWishlisted ? 'text-[#6B2D5C]' : 'text-stone-400 hover:text-[#6B2D5C]'
          }`}
          aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#6B2D5C]' : ''}`} />
        </button>
      </div>

      {/* Product Info */}
      <div className="px-2 pt-1 pb-4 flex-1 flex flex-col justify-between gap-3.5">
        <div className="space-y-2">
          <Link
            href={`/products/${slug}`}
            className="text-xs sm:text-sm font-semibold text-[#2B1822] hover:text-[#6B2D5C] transition-colors line-clamp-2 leading-snug block"
          >
            {title}
          </Link>

          {/* 5 Golden Stars Rating */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <div className="flex text-[#E59834]">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-[#E59834] stroke-[#E59834]" />
              ))}
            </div>
            <span className="text-[11px] text-stone-500 font-medium">
              ({reviewCount})
            </span>
          </div>
        </div>

        {/* Price Row: strikethrough then bold offer price */}
        <div className="flex items-baseline gap-2.5 pt-1">
          {compareAtPrice && compareAtPrice > price && (
            <span className="text-xs sm:text-sm text-stone-400 line-through">
              {formatPrice(compareAtPrice)}
            </span>
          )}
          <span className="text-sm sm:text-base font-bold text-[#2B1822]">
            {formatPrice(price)}
          </span>
        </div>
      </div>

      {/* Full-width Rich Plum ADD TO CART Button */}
      <button
        onClick={handleQuickAdd}
        className={`w-full py-3 px-4 font-sans text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-xs ${
          justAdded
            ? 'bg-emerald-700 text-white'
            : 'bg-[#6B2D5C] hover:bg-[#562349] text-white active:scale-98'
        }`}
      >
        {justAdded ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>ADDED TO CART</span>
          </>
        ) : (
          <span>ADD TO CART</span>
        )}
      </button>
    </div>
  )
}
