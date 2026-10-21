'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, ArrowRight, ShoppingBag, Check, Droplets, Leaf, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/lib/cart/cart-store'
import { useCurrency } from '@/components/providers/StoreSettingsProvider'

export function LovixaProductSpotlight() {
  const { addItem, openCart } = useCartStore()
  const { formatPrice } = useCurrency()
  const [added, setAdded] = useState(false)

  const product = {
    id: 'prod_hairoil',
    title: 'LOVIXA Nourishing Hair Oil',
    slug: 'lovixa-hair-oil',
    price: 28.0,
    compareAtPrice: 32.0,
    size: '50ml | 1.69 fl. oz',
    image: '/images/lovixa-hairoil.jpg',
  }

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      quantity: 1,
      image: product.image,
      slug: product.slug,
      optionsSummary: product.size,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
    openCart()
  }

  return (
    <section className="py-16 sm:py-24 bg-[#FBF6F8]/60 border-b border-[#E8C4D4]/60 relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -ml-32 w-80 h-80 rounded-full bg-[#E8C4D4]/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Large Original Product Photography (6 cols) */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl sm:rounded-[2.5rem] overflow-hidden bg-white border-4 border-white shadow-2xl aspect-square sm:aspect-[4/3] lg:aspect-[5/6]">
              <Image
                src={product.image}
                alt="LOVIXA Hair Oil Bottle on Travertine Stone"
                fill
                priority
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              <div className="absolute top-4 left-4 z-10">
                <span className="px-3.5 py-1 rounded-full bg-[#2B1822]/90 backdrop-blur-md text-white text-[10px] font-bold tracking-widest uppercase">
                  BESTSELLER • 50ML
                </span>
              </div>
            </div>
          </div>

          {/* Right: Editorial Campaign Story & Details (6 cols) */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8C4D4] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#6B2D5C]" />
              <span className="text-[11px] font-bold tracking-[0.22em] text-[#6B2D5C] uppercase font-sans">
                FEATURED SPOTLIGHT
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#2B1822] tracking-tight leading-tight">
              LOVIXA Hair Oil
            </h2>

            <p className="text-base sm:text-lg text-[#2B1822]/80 leading-relaxed font-sans">
              Make hair oiling a relaxing part of your self-care ritual. Deeply nourishes strands from root to tip with a lightweight botanical blend that leaves hair silky and manageable.
            </p>

            {/* Verified highlights list */}
            <div className="space-y-3 pt-2 text-left">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#E8C4D4]/70">
                <Droplets className="w-5 h-5 text-[#6B2D5C] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#2B1822]">
                    Cold-Pressed Botanical Elixir
                  </h4>
                  <p className="text-xs text-[#2B1822]/70 font-sans">
                    Nourishing botanical blend formulated to respect scalp balance and soften hair texture.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#E8C4D4]/70">
                <Leaf className="w-5 h-5 text-[#6B2D5C] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#2B1822]">
                    Lightweight Strand Hydration
                  </h4>
                  <p className="text-xs text-[#2B1822]/70 font-sans">
                    Non-greasy, featherlight consistency that rinses cleanly without leaving residue.
                  </p>
                </div>
              </div>
            </div>

            {/* Product Size & Pricing */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-4">
              <div>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-[#2B1822]">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-[#2B1822]/40 line-through ml-2">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
              <div className="h-6 w-px bg-[#E8C4D4]" />
              <span className="px-3 py-1 rounded-full bg-white border border-[#E8C4D4] text-xs font-bold text-[#6B2D5C]">
                {product.size}
              </span>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href={`/products/${product.slug}`}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#6B2D5C] hover:bg-[#562349] text-white text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>DISCOVER THE PRODUCT</span>
                <ArrowRight className="w-4 h-4 text-[#E8C4D4] group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`w-full sm:w-auto px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-200 border border-[#E8C4D4] flex items-center justify-center gap-2 cursor-pointer ${
                  added
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-white hover:bg-[#FBF6F8] text-[#2B1822] hover:border-[#6B2D5C]/60'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#6B2D5C]" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
