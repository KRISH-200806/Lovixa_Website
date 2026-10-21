'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight, Check, ShoppingBag, ShieldCheck, Heart } from 'lucide-react'
import { useCartStore } from '@/lib/cart/cart-store'
import { useCurrency } from '@/components/providers/StoreSettingsProvider'

interface RitualOption {
  id: string
  title: string
  label: string
  description: string
  concern: string
  pairTitle: string
  pairDescription: string
  productA: {
    id: string
    title: string
    slug: string
    price: number
    image: string
  }
  productB: {
    id: string
    title: string
    slug: string
    price: number
    image: string
  }
  bundlePrice: number
  comparePrice: number
  resultsClaim: string
}

const RITUAL_OPTIONS: RitualOption[] = [
  {
    id: 'barrier',
    title: 'Barrier Recovery & Redness Relief',
    label: 'Compromised Barrier',
    description: 'Soothes stinging, flaking, and sensitivity by rebuilding lipid bilayers.',
    concern: 'Dry, reactive, sensitized skin barrier',
    pairTitle: 'The Cellular Barrier Defense Duo',
    pairDescription: 'Velvet Rose Barrier Repair Serum + Cellular Defense Velvet Barrier Cream',
    productA: {
      id: 'prod_1',
      title: 'Velvet Rose Barrier Repair Serum (30ml)',
      slug: 'velvet-rose-barrier-serum',
      price: 68.0,
      image: '/images/hero-luxury-serum.png',
    },
    productB: {
      id: 'prod_5',
      title: 'Cellular Defense Velvet Barrier Cream (50ml)',
      slug: 'cellular-defense-barrier-cream',
      price: 62.0,
      image: '/images/cat-barrier-creams.png',
    },
    bundlePrice: 110.0,
    comparePrice: 130.0,
    resultsClaim: '94% experienced visible redness reduction in 7 days',
  },
  {
    id: 'hydration',
    title: 'Deep Glass-Skin Radiance & Plump',
    label: 'Dullness & Dehydration',
    description: 'Multi-depth molecular moisture topped with pure botanical lipids.',
    concern: 'Tired, dehydrated, lackluster complexion',
    pairTitle: 'The Glass Radiance Elixir Duo',
    pairDescription: 'Rose Dew Hydrating Elixir + Botanical Radiance Facial Oil with Squalane',
    productA: {
      id: 'prod_7',
      title: 'Rose Dew Ultra-Hydrating Plump Elixir (30ml)',
      slug: 'rose-dew-hydrating-elixir',
      price: 54.0,
      image: '/images/cat-hydrating-serums.png',
    },
    productB: {
      id: 'prod_3',
      title: 'Botanical Radiance Facial Oil with Squalane (30ml)',
      slug: 'botanical-radiance-facial-oil',
      price: 74.0,
      image: '/images/cat-botanical-oils.png',
    },
    bundlePrice: 108.0,
    comparePrice: 128.0,
    resultsClaim: '98% noticed 72-hour sustained dewy glow',
  },
  {
    id: 'lips',
    title: 'High-Shine Dewy Lip Plumping',
    label: 'Plush Lip Volume',
    description: 'Triple peptide lip conditioning with non-sticky glass luster.',
    concern: 'Dry lips, fine lines, uneven tint',
    pairTitle: 'The Dewy Peptide Glaze Duo',
    pairDescription: 'Dewy Lip Tint Rich Plum + Dewy Lip Tint Rosewood Glaze',
    productA: {
      id: 'prod_2',
      title: 'Dewy Peptide Glaze Lip Tint — Rich Plum',
      slug: 'dewy-peptide-lip-tint-plum',
      price: 28.0,
      image: '/images/cat-lip-care.png',
    },
    productB: {
      id: 'prod_8',
      title: 'Dewy Peptide Lip Tint — Rosewood Glaze',
      slug: 'dewy-peptide-lip-tint-rosewood',
      price: 28.0,
      image: '/images/promo-dewy-lip-glaze.png',
    },
    bundlePrice: 48.0,
    comparePrice: 56.0,
    resultsClaim: '12-hour plush moisture with zero stickiness',
  },
]

export function InteractiveRitualFinder() {
  const [selectedId, setSelectedId] = useState<string>('barrier')
  const [bundleAdded, setBundleAdded] = useState(false)
  const { addItem, openCart } = useCartStore()
  const { formatPrice } = useCurrency()

  const currentOption = RITUAL_OPTIONS.find((opt) => opt.id === selectedId) || RITUAL_OPTIONS[0]

  const handleAddBundle = () => {
    // Add product A
    addItem({
      productId: currentOption.productA.id,
      title: currentOption.productA.title,
      slug: currentOption.productA.slug,
      price: currentOption.productA.price,
      image: currentOption.productA.image,
      quantity: 1,
      maxStock: 50,
    })
    // Add product B
    addItem({
      productId: currentOption.productB.id,
      title: currentOption.productB.title,
      slug: currentOption.productB.slug,
      price: currentOption.productB.price,
      image: currentOption.productB.image,
      quantity: 1,
      maxStock: 50,
    })

    setBundleAdded(true)
    setTimeout(() => {
      setBundleAdded(false)
      openCart()
    }, 1200)
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-[#FBF6F8] border border-[#E8C4D4]/80 rounded-[2.5rem] p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-sm">
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#E8C4D4]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto text-center space-y-3 mb-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8C4D4] text-xs font-bold text-[#6B2D5C]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Ritual Architect</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#2B1822] tracking-tight">
            Find Your Signature Radiance Pairing
          </h2>
          <p className="text-xs sm:text-sm text-[#2B1822]/70 leading-relaxed">
            Select your skin priority to reveal the synergistic 2-step routine clinically tailored to balance and illuminate your skin.
          </p>
        </div>

        {/* Priority Selector Pills */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-10">
          {RITUAL_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedId(opt.id)}
              className={`px-5 py-3 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedId === opt.id
                  ? 'bg-[#6B2D5C] text-white shadow-md scale-105'
                  : 'bg-white text-[#2B1822] hover:bg-white/80 border border-[#E8C4D4]/80'
              }`}
            >
              <span>{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Ritual Solution Card */}
        <div className="bg-white border border-[#E8C4D4]/80 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Product Pair Visuals */}
            <div className="lg:col-span-5 flex items-center justify-center gap-4">
              {/* Product A */}
              <div className="relative aspect-square w-1/2 rounded-2xl overflow-hidden border border-[#E8C4D4]/70 bg-[#FBF6F8] shadow-xs group">
                <img
                  src={currentOption.productA.image}
                  alt={currentOption.productA.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2 left-2 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#2B1822]/90 text-white">
                  Step 1
                </span>
              </div>

              {/* Plus icon */}
              <div className="w-8 h-8 rounded-full bg-[#FBF6F8] border border-[#E8C4D4] flex items-center justify-center font-black text-[#6B2D5C] shrink-0 text-sm">
                +
              </div>

              {/* Product B */}
              <div className="relative aspect-square w-1/2 rounded-2xl overflow-hidden border border-[#E8C4D4]/70 bg-[#FBF6F8] shadow-xs group">
                <img
                  src={currentOption.productB.image}
                  alt={currentOption.productB.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2 left-2 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#6B2D5C] text-white">
                  Step 2
                </span>
              </div>
            </div>

            {/* Right: Formulation Details and Action */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#6B2D5C] uppercase tracking-wider bg-[#FBF6F8] border border-[#E8C4D4] px-3 py-1 rounded-full">
                  Target: {currentOption.concern}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Bundle Privilege
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-[#2B1822] tracking-tight">
                {currentOption.pairTitle}
              </h3>

              <p className="text-xs sm:text-sm text-[#2B1822]/80 leading-relaxed">
                {currentOption.description} Designed to work in sequence: {currentOption.pairDescription}.
              </p>

              {/* Clinical Claim Pill */}
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#FBF6F8] border border-[#E8C4D4]/60 text-xs text-[#2B1822]/85">
                <ShieldCheck className="w-4 h-4 text-[#6B2D5C] shrink-0" />
                <span className="font-semibold">{currentOption.resultsClaim}</span>
              </div>

              {/* Price and CTA */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#E8C4D4]/50">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-[#2B1822]">
                      {formatPrice(currentOption.bundlePrice)}
                    </span>
                    <span className="text-xs text-[#2B1822]/40 line-through">
                      {formatPrice(currentOption.comparePrice)}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#6B2D5C] font-bold">
                    Includes 2 Full-Size Formulations
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleAddBundle}
                    className={`px-6 py-3 font-bold text-xs rounded-full shadow-md transition-all duration-300 flex items-center gap-2 cursor-pointer active:scale-95 ${
                      bundleAdded
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#6B2D5C] hover:bg-[#562349] text-white hover:scale-105'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{bundleAdded ? 'Added Both to Cart ✓' : 'Add Ritual Duo to Bag'}</span>
                  </button>

                  <Link
                    href={`/products/${currentOption.productA.slug}`}
                    className="p-3 rounded-full bg-white border border-[#E8C4D4] hover:border-[#6B2D5C] text-[#2B1822] hover:text-[#6B2D5C] transition-colors"
                    title="View Details"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
