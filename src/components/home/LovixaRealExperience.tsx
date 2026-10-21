'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Eye, Play, Check, ShoppingBag, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useRef } from 'react'
import { useCartStore } from '@/lib/cart/cart-store'
import { useCurrency } from '@/components/providers/StoreSettingsProvider'
import { BrushStroke } from '@/components/ui/BrushStroke'

interface ExperienceReel {
  id: string
  title: string
  customerName: string
  views: string
  videoThumbnail: string
  productId: string
  productTitle: string
  productImage: string
  productSlug: string
  price: number
  compareAtPrice: number
  discount: string
}

const REELS: ExperienceReel[] = [
  {
    id: 'reel_1',
    title: 'My 14-Day Shampoo Transformation',
    customerName: 'Priya S., Mumbai',
    views: '2.5k',
    videoThumbnail: '/images/reel-1.jpg',
    productId: 'prod_shampoo',
    productTitle: 'LOVIXA Botanical Refreshing Shampoo',
    productImage: '/images/lovixa-shampoo.jpg',
    productSlug: 'lovixa-shampoo',
    price: 299,
    compareAtPrice: 399,
    discount: '25% OFF',
  },
  {
    id: 'reel_2',
    title: 'How I Apply Hair Oil for Root Growth',
    customerName: 'Ananya M., Delhi',
    views: '3.8k',
    videoThumbnail: '/images/reel-2.jpg',
    productId: 'prod_oil',
    productTitle: 'LOVIXA Nourishing Hair Oil (50ml)',
    productImage: '/images/lovixa-hairoil.jpg',
    productSlug: 'lovixa-hair-oil',
    price: 299,
    compareAtPrice: 399,
    discount: '25% OFF',
  },
  {
    id: 'reel_3',
    title: 'Say Goodbye to Frizz & Scalp Flakes',
    customerName: 'Kavita R., Ahmedabad',
    views: '1.9k',
    videoThumbnail: '/images/lovixa-insta-1.jpg',
    productId: 'prod_duo',
    productTitle: 'LOVIXA Complete Hair Care Duo Set',
    productImage: '/images/lovixa-duo.jpg',
    productSlug: 'lovixa-hair-care-duo',
    price: 549,
    compareAtPrice: 699,
    discount: '21% OFF',
  },
  {
    id: 'reel_4',
    title: 'The Best Ayurvedic Scalp Massage Ritual',
    customerName: 'Sneha P., Bengaluru',
    views: '4.2k',
    videoThumbnail: '/images/lovixa-insta-2.jpg',
    productId: 'prod_oil',
    productTitle: 'LOVIXA Nourishing Hair Oil (50ml)',
    productImage: '/images/lovixa-hairoil.jpg',
    productSlug: 'lovixa-hair-oil',
    price: 299,
    compareAtPrice: 399,
    discount: '25% OFF',
  },
  {
    id: 'reel_5',
    title: 'Unboxing My Daily Essentials Kit',
    customerName: 'Rhea D., Pune',
    views: '2.1k',
    videoThumbnail: '/images/lovixa-insta-3.jpg',
    productId: 'prod_duo',
    productTitle: 'LOVIXA Hair Care Duo (Shampoo + Oil)',
    productImage: '/images/lovixa-duo.jpg',
    productSlug: 'lovixa-hair-care-duo',
    price: 549,
    compareAtPrice: 699,
    discount: '21% OFF',
  },
]

import type { StorefrontRealExperienceData } from '@/lib/cms/products'

interface Props {
  data?: StorefrontRealExperienceData
}

export function LovixaRealExperience({ data }: Props) {
  const { addItem, openCart } = useCartStore()
  const { formatPrice } = useCurrency()
  const [addedSlug, setAddedSlug] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const heading = data?.heading || 'Real Rituals, Visible Transformations'
  const subtitle =
    data?.subtitle ||
    'Authentic hair journeys, daily rituals, and unfiltered results shared by our loyal community'
  const reels: any[] = data?.reels && data.reels.length > 0 ? data.reels : REELS

  const handleAddToCart = (item: any) => {
    addItem({
      productId: item.productId || 'prod_item',
      title: item.productTitle,
      price: item.price,
      compareAtPrice: item.compareAtPrice,
      quantity: 1,
      image: item.productImage,
      slug: item.productSlug,
      optionsSummary: 'Verified Customer Choice',
    })
    setAddedSlug(item.id)
    setTimeout(() => setAddedSlug(null), 1800)
    openCart()
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -300 : 300,
      behavior: 'smooth',
    })
  }

  return (
    <section className="py-12 sm:py-16 bg-[#FBF6F8] relative border-b border-[#E8C4D4]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* The Wellness Shop Signature Heading */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block relative">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-bold text-[#2B1822] tracking-tight">
              {heading}
            </h2>
            <BrushStroke className="text-[#6B2D5C]" />
          </div>
          <p className="text-xs sm:text-sm text-[#2B1822]/70 mt-2">
            {subtitle}
          </p>
        </div>

        {/* Video Reels Carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth pb-4 px-1 scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {reels.map((reel) => {
              const isAdded = addedSlug === reel.id

              return (
                <div
                  key={reel.id}
                  className="w-[230px] sm:w-[250px] shrink-0 bg-white border border-[#E8C4D4]/60 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  {/* Portrait Video Thumbnail */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
                    <Image
                      src={reel.videoThumbnail}
                      alt={reel.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="250px"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    {/* Top Views Badge */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/50 backdrop-blur-xs text-white text-[11px] px-2 py-0.5 rounded-full font-medium">
                      <Eye className="w-3 h-3" />
                      <span>{reel.views}</span>
                    </div>

                    {/* Play Button Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full bg-white/85 text-[#2B1822] flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-white transition-transform">
                        <Play className="w-5 h-5 fill-[#2B1822] ml-0.5" />
                      </div>
                    </div>

                    {/* Customer Caption */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                      <p className="text-xs font-bold leading-tight drop-shadow-xs line-clamp-2">
                        {reel.title}
                      </p>
                      <span className="text-[10px] text-white/80 block mt-0.5 font-medium">
                        {reel.customerName}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Product Card Tag */}
                  <div className="p-3 bg-white space-y-2 border-t border-[#E8C4D4]/30">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded overflow-hidden relative shrink-0 border border-[#E8C4D4]/40 bg-[#FBF6F8]">
                        <Image
                          src={reel.productImage}
                          alt={reel.productTitle}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-semibold text-[#2B1822] truncate">
                          {reel.productTitle}
                        </h4>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs font-bold text-[#2B1822]">
                            {formatPrice(reel.price)}
                          </span>
                          <span className="text-[10px] text-stone-400 line-through">
                            {formatPrice(reel.compareAtPrice)}
                          </span>
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded">
                            {reel.discount}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rich Plum ADD TO CART Button */}
                    <button
                      onClick={() => handleAddToCart(reel)}
                      className={`w-full py-2 px-3 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        isAdded
                          ? 'bg-emerald-700 text-white'
                          : 'bg-[#6B2D5C] hover:bg-[#562349] text-white active:scale-98'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>ADDED</span>
                        </>
                      ) : (
                        <span>ADD TO CART</span>
                      )}
                    </button>
                  </div>

                </div>
              )
            })}
          </div>
        </div>

        {/* Centered VIEW ALL Button */}
        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-block px-10 py-3 bg-[#6B2D5C] hover:bg-[#562349] text-white text-xs font-bold tracking-widest uppercase transition-all duration-200 shadow-xs"
          >
            VIEW ALL
          </Link>
        </div>

      </div>
    </section>
  )
}
