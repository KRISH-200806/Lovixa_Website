'use client'

import Image from 'next/image'
import { Check, ShoppingBag, Truck, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/lib/cart/cart-store'
import { useCurrency } from '@/components/providers/StoreSettingsProvider'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { StorefrontPromoBannerData } from '@/lib/cms/products'

interface Props {
  data?: StorefrontPromoBannerData
}

export function LovixaPromoBanner({ data }: Props) {
  const { addItem, openCart } = useCartStore()
  const { formatPrice } = useCurrency()
  const [added, setAdded] = useState(false)

  const sectionTitle = data?.sectionTitle || 'The Essential Scalp & Strand Ritual Duo'
  const sectionSubtitle =
    data?.sectionSubtitle ||
    'Combine our Botanical Cleanser and Cold-Pressed Scalp Elixir for lasting flake defense, root strength, and mirror gloss'
  const badge = data?.badge || 'SIGNATURE CEREMONY SET'
  const ritualTitle = data?.ritualTitle || 'TWO-STEP RESTORATIVE CEREMONY'
  const productTitle = data?.productTitle || 'Botanical Shampoo (500ml) + Hair Oil (50ml)'
  const description =
    data?.description ||
    'The ultimate Ayurvedic hair ritual. Deeply purifies scalp pores with gentle plant surfactants while locking in root nutrients for lasting softness and hair fall resistance.'
  const features =
    data?.features && data.features.length > 0
      ? data.features
      : [
          'Gentle daily cleanse maintains natural scalp moisture barrier',
          'Cold-pressed Bhringraj & Rosemary strengthen follicle grip',
          '100% Ayurvedic • Zero Sulfates • Dermatologically Approved',
        ]
  const offerPrice = typeof data?.offerPrice === 'number' && data.offerPrice >= 100 ? data.offerPrice : 549
  const comparePrice = typeof data?.comparePrice === 'number' && data.comparePrice >= 100 ? data.comparePrice : 699
  const discountTag = data?.discountTag || 'Save 21%'
  const ctaText = data?.ctaText || 'ADD COMPLETE DUO TO BAG'
  const image = data?.image || '/images/lovixa-duo.jpg'
  const freeShippingText = data?.freeShippingText || 'Free Shipping Included'
  const trustText = data?.trustText || '100% Authentic Ayurvedic'

  const duoProduct = {
    id: 'prod_duo',
    title: productTitle,
    slug: 'lovixa-hair-care-duo',
    price: offerPrice,
    compareAtPrice: comparePrice,
    image: image,
  }

  const handleAddDuo = () => {
    addItem({
      productId: duoProduct.id,
      title: duoProduct.title,
      price: duoProduct.price,
      compareAtPrice: duoProduct.compareAtPrice,
      quantity: 1,
      image: duoProduct.image,
      slug: duoProduct.slug,
      optionsSummary: '500ml Shampoo + 50ml Hair Oil',
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
    openCart()
  }

  return (
    <section className="py-12 sm:py-16 bg-[#E8C4D4]/20 border-b border-[#E8C4D4]/40 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          eyebrow={badge}
          title={sectionTitle}
          subtitle={sectionSubtitle}
        />

        {/* Cohesive Luxury Duo Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8C4D4]/60 p-6 sm:p-8 lg:p-10 shadow-sm max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Duo Product Image (6 cols) */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-square max-w-md mx-auto rounded-xl overflow-hidden bg-[#FBF6F8] border border-[#E8C4D4]/40 shadow-xs group">
                <Image
                  src={image}
                  alt={productTitle}
                  fill
                  className="object-cover group-hover:scale-104 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />

                {/* Offer Badge on Top Left */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-[#6B2D5C] text-white text-[10px] font-black px-2.5 py-1 tracking-wider uppercase shadow-xs">
                    {badge}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full border border-[#E8C4D4]/40 text-[11px] font-bold text-[#2B1822] shadow-xs">
                  500ml + 50ml Duo Set
                </div>
              </div>
            </div>

            {/* Right Offer Details & Action (6 cols) */}
            <div className="lg:col-span-6 space-y-5">
              <div>
                <span className="text-[11px] font-bold text-[#6B2D5C] uppercase tracking-wider block mb-1">
                  {ritualTitle}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-sans text-[#2B1822] leading-tight">
                  {productTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#2B1822]/75 mt-2 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-2 pt-1 border-t border-[#E8C4D4]/30">
                {features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#2B1822]/80 font-sans">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-emerald-600" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Price & Action */}
              <div className="pt-3 border-t border-[#E8C4D4]/30">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-2xl sm:text-3xl font-bold text-[#2B1822]">
                    {formatPrice(offerPrice)}
                  </span>
                  {comparePrice > offerPrice && (
                    <span className="text-sm text-stone-400 line-through">
                      {formatPrice(comparePrice)}
                    </span>
                  )}
                  <span className="text-xs font-bold text-[#6B2D5C] bg-[#E8C4D4]/40 border border-[#E8C4D4]/60 px-2 py-0.5 rounded">
                    {discountTag}
                  </span>
                </div>

                {/* Rich Plum Action Button */}
                <button
                  onClick={handleAddDuo}
                  className={`w-full py-3.5 px-6 rounded-full font-sans text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                    added
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#6B2D5C] hover:bg-[#562349] text-white active:scale-98'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>ADDED DUO TO BAG!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>
                        {ctaText} • {formatPrice(offerPrice)}
                      </span>
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="mt-3 flex items-center justify-center sm:justify-start gap-4 text-[11px] text-[#2B1822]/60 font-sans">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#6B2D5C]" />
                    <span>{freeShippingText}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#6B2D5C]" />
                    <span>{trustText}</span>
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
