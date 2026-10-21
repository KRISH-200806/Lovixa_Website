'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, Check, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/lib/cart/cart-store'
import { useCurrency } from '@/components/providers/StoreSettingsProvider'
import { SectionHeader } from '@/components/ui/SectionHeader'

interface HairConcern {
  id: string
  title: string
  subtitle: string
  image: string
  routineTitle: string
  routineDesc: string
  steps: string[]
  productTitle: string
  productImage: string
  price: number
  compareAtPrice: number
  slug: string
  productId: string
}

const CONCERNS: HairConcern[] = [
  {
    id: 'hair-fall',
    title: 'Hair Fall & Breakage',
    subtitle: '2 products • Full Duo Routine',
    image: '/images/concern-hairfall.jpg',
    routineTitle: 'Root Strengthening & Anti-Breakage Routine',
    routineDesc: 'Formulated with Bhringraj, Rosemary & Botanical extracts to reinforce weak follicles, reduce shower fall, and strengthen strand tensile grip.',
    steps: [
      'Step 1: Warm 4-5 drops of Hair Oil and gently massage into scalp roots for 10 minutes.',
      'Step 2: Wash with LOVIXA Refreshing Shampoo to cleanse without stripping natural oils.',
      'Step 3: Repeat 3x weekly for visible density and reduced breakage within 21 days.'
    ],
    productTitle: 'LOVIXA Hair Care Duo (Shampoo + Oil)',
    productImage: '/images/lovixa-duo.jpg',
    price: 549,
    compareAtPrice: 699,
    slug: 'lovixa-hair-care-duo',
    productId: 'prod_duo',
  },
  {
    id: 'dandruff-scalp',
    title: 'Dandruff & Flakes',
    subtitle: '2 products • Full Duo Routine',
    image: '/images/concern-dandruff.jpg',
    routineTitle: 'Scalp Balancing & Flake Relief Routine',
    routineDesc: 'Deeply clears micro-buildup and soothes itchy, dry flakes while balancing the scalp microbiome with gentle botanical surfactants.',
    steps: [
      'Step 1: Pre-wash scalp soothing with lightweight Botanical Hair Oil 20 mins prior.',
      'Step 2: Lather LOVIXA Shampoo into scalp focusing on crown and temples.',
      'Step 3: Rinse with lukewarm water to reveal a clean, refreshed, breathable scalp.'
    ],
    productTitle: 'LOVIXA Hair Care Duo (Shampoo + Oil)',
    productImage: '/images/lovixa-duo.jpg',
    price: 549,
    compareAtPrice: 699,
    slug: 'lovixa-hair-care-duo',
    productId: 'prod_duo',
  },
  {
    id: 'dry-frizzy',
    title: 'Dry & Frizzy Hair',
    subtitle: '2 products • Full Duo Routine',
    image: '/images/concern-frizzy.jpg',
    routineTitle: 'Hydration Locking & Frizz Control Routine',
    routineDesc: 'Seals moisture directly into coarse, open cuticles to tame humidity flyaways and restore touchable, bouncy softness.',
    steps: [
      'Step 1: Cleanse with LOVIXA Botanical Shampoo for gentle hydration.',
      'Step 2: On damp ends, apply 2 drops of Hair Oil as a lightweight leave-in serum.',
      'Step 3: Air dry or blow dry on cool setting for smooth, mirror-like gloss.'
    ],
    productTitle: 'LOVIXA Hair Care Duo (Shampoo + Oil)',
    productImage: '/images/lovixa-duo.jpg',
    price: 549,
    compareAtPrice: 699,
    slug: 'lovixa-hair-care-duo',
    productId: 'prod_duo',
  },
  {
    id: 'damaged-splitends',
    title: 'Damaged & Split Ends',
    subtitle: '2 products • Full Duo Routine',
    image: '/images/concern-splitends.jpg',
    routineTitle: 'Intense Cuticle Repair Routine',
    routineDesc: 'Deep lipid restoration for heat-treated and chemically stressed strands, binding frayed split ends and preventing future friction damage.',
    steps: [
      'Step 1: Overnight deep saturation of mid-lengths to ends with Cold-Pressed Hair Oil.',
      'Step 2: Morning rinse with sulfate-free LOVIXA Shampoo to preserve natural keratin.',
      'Step 3: Enjoy noticeably softer, tangle-free ends with zero brittleness.'
    ],
    productTitle: 'LOVIXA Hair Care Duo (Shampoo + Oil)',
    productImage: '/images/lovixa-duo.jpg',
    price: 549,
    compareAtPrice: 699,
    slug: 'lovixa-hair-care-duo',
    productId: 'prod_duo',
  },
  {
    id: 'growth-density',
    title: 'Slow Growth & Thinning',
    subtitle: '2 products • Full Duo Routine',
    image: '/images/concern-growth.jpg',
    routineTitle: 'Follicular Stimulating Routine',
    routineDesc: 'Stimulates micro-circulation at the root level, awakening dormant follicles and boosting strand thickness from the inside out.',
    steps: [
      'Step 1: Apply Hair Oil dropper directly onto thinning zones and hairline.',
      'Step 2: Inverted scalp massage for 5 minutes to accelerate nutrient delivery.',
      'Step 3: Cleanse residue with LOVIXA Shampoo to keep follicular pores open.'
    ],
    productTitle: 'LOVIXA Hair Care Duo (Shampoo + Oil)',
    productImage: '/images/lovixa-duo.jpg',
    price: 549,
    compareAtPrice: 699,
    slug: 'lovixa-hair-care-duo',
    productId: 'prod_duo',
  },
  {
    id: 'oily-buildup',
    title: 'Oily Scalp & Buildup',
    subtitle: '2 products • Full Duo Routine',
    image: '/images/concern-oilyscalp.jpg',
    routineTitle: 'Sebum Clarifying & Reset Routine',
    routineDesc: 'Removes stubborn excess oil, heavy hard water residue, and pollution grime without causing compensatory oil overproduction.',
    steps: [
      'Step 1: Lather LOVIXA Shampoo twice — first to lift sebum, second to nourish.',
      'Step 2: Target 1-2 drops of Hair Oil exclusively on hair ends (avoiding scalp).',
      'Step 3: Scalp stays light, airy, and bouncy for up to 72 hours.'
    ],
    productTitle: 'LOVIXA Hair Care Duo (Shampoo + Oil)',
    productImage: '/images/lovixa-duo.jpg',
    price: 549,
    compareAtPrice: 699,
    slug: 'lovixa-hair-care-duo',
    productId: 'prod_duo',
  },
]

import type { StorefrontConcernsSectionData } from '@/lib/cms/products'

interface Props {
  data?: StorefrontConcernsSectionData
}

export function LovixaConcerns({ data }: Props) {
  const eyebrow = data?.eyebrow || 'TARGETED BOTANICAL CARE'
  const heading = data?.heading || 'Targeted Rituals for Every Hair Need'
  const subtitle =
    data?.subtitle ||
    'Select your primary hair goal to explore the dedicated two-step restorative Ayurvedic regimen'
  const concerns: any[] = data?.concerns && data.concerns.length > 0 ? data.concerns : CONCERNS

  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [selectedConcern, setSelectedConcern] = useState<any | null>(null)
  const [added, setAdded] = useState(false)

  const { addItem, openCart } = useCartStore()
  const { formatPrice } = useCurrency()

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true })
      window.addEventListener('resize', checkScroll)
      return () => {
        el.removeEventListener('scroll', checkScroll)
        window.removeEventListener('resize', checkScroll)
      }
    }
  }, [])

  // Lock body scroll when routine modal is open
  useEffect(() => {
    if (selectedConcern) {
      document.documentElement.classList.add('modal-open')
      document.body.classList.add('modal-open')
    } else {
      document.documentElement.classList.remove('modal-open')
      document.body.classList.remove('modal-open')
    }
    return () => {
      document.documentElement.classList.remove('modal-open')
      document.body.classList.remove('modal-open')
    }
  }, [selectedConcern])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const scrollAmount = 300
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  const handleAddRoutineToBag = (concern: HairConcern) => {
    addItem({
      productId: concern.productId,
      title: concern.productTitle,
      price: concern.price,
      compareAtPrice: concern.compareAtPrice,
      quantity: 1,
      image: concern.productImage,
      slug: concern.slug,
      optionsSummary: 'Full Care Duo Routine',
    })
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      setSelectedConcern(null)
      openCart()
    }, 900)
  }

  return (
    <section id="concerns" className="py-10 sm:py-14 bg-[#FBF6F8] border-b border-[#E8C4D4]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Fully Centered with Signature Brush Stroke */}
        <div className="relative">
          <SectionHeader
            eyebrow={eyebrow}
            title={heading}
            subtitle={subtitle}
          />

          {/* Carousel Arrows: Only rendered when scrolling is possible */}
          {(canScrollLeft || canScrollRight) && (
            <div className="flex items-center justify-center sm:justify-end gap-2 mt-4 sm:mt-0 sm:absolute sm:right-0 sm:bottom-1">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                aria-label="Previous concerns"
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#E8C4D4]/60 bg-white flex items-center justify-center transition-all shadow-xs cursor-pointer ${
                  canScrollLeft
                    ? 'hover:bg-[#FBF6F8] hover:border-[#6B2D5C] text-[#2B1822]'
                    : 'opacity-40 cursor-not-allowed text-[#2B1822]/30'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                aria-label="Next concerns"
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#E8C4D4]/60 bg-white flex items-center justify-center transition-all shadow-xs cursor-pointer ${
                  canScrollRight
                    ? 'hover:bg-[#FBF6F8] hover:border-[#6B2D5C] text-[#2B1822]'
                    : 'opacity-40 cursor-not-allowed text-[#2B1822]/30'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Horizontal Slider: Centered Cards */}
        <div
          ref={scrollRef}
          className="overflow-x-auto scroll-smooth pb-4 pt-1 px-1 scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex gap-4 sm:gap-5 w-max min-w-full justify-center">
            {concerns.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedConcern(item)}
                className="group w-[215px] sm:w-[245px] shrink-0 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-[#E8C4D4]/60 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center text-center justify-between cursor-pointer"
              >
                {/* Circular image with Rich Plum ring */}
                <div className="w-28 h-28 sm:w-34 sm:h-34 rounded-full p-[3px] border-2 border-[#6B2D5C] mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-104 shadow-xs">
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-[#FBF6F8]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-108 transition-transform duration-500"
                      sizes="(max-width: 640px) 120px, 150px"
                    />
                  </div>
                </div>

                {/* Concern Title: Reduced boldness from font-black to font-semibold */}
                <div className="w-full mb-3 flex-1 flex flex-col justify-center">
                  <h3 className="font-sans font-semibold text-sm sm:text-base text-[#2B1822] leading-snug tracking-tight group-hover:text-[#6B2D5C] transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-[11px] sm:text-xs text-[#2B1822]/60 font-medium mt-1 block">
                    {item.subtitle}
                  </span>
                </div>

                {/* View Routine Pill Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedConcern(item)
                  }}
                  className="w-full py-2 sm:py-2.5 px-3.5 rounded-full bg-[#6B2D5C] hover:bg-[#562349] text-white text-xs sm:text-[13px] font-bold font-sans tracking-wide transition-all shadow-xs hover:shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>View Routine</span>
                  <span className="text-sm font-normal">→</span>
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Interactive Routine Modal: Opens when user taps a card or "View Routine →" */}
      {selectedConcern && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white w-full max-w-lg rounded-3xl border border-[#E8C4D4]/60 shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative p-5 sm:p-6 bg-[#FBF6F8] border-b border-[#E8C4D4]/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full p-[2px] border-2 border-[#6B2D5C] overflow-hidden shrink-0 relative">
                  <Image
                    src={selectedConcern.image}
                    alt={selectedConcern.title}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B2D5C] block">
                    TARGETED HAIR ROUTINE
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-[#2B1822]">
                    {selectedConcern.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedConcern(null)}
                aria-label="Close modal"
                className="w-8 h-8 rounded-full bg-white border border-[#E8C4D4]/60 text-[#2B1822]/60 hover:text-[#2B1822] flex items-center justify-center cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-[#2B1822] mb-1">
                  {selectedConcern.routineTitle}
                </h4>
                <p className="text-xs text-[#2B1822]/75 leading-relaxed">
                  {selectedConcern.routineDesc}
                </p>
              </div>

              {/* Routine Steps Checklist */}
              <div className="bg-[#FBF6F8] rounded-2xl p-4 border border-[#E8C4D4]/40 space-y-2.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#2B1822]/70 block">
                  3-STEP APPLICATION RITUAL:
                </span>
                {selectedConcern.steps?.map((step: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#2B1822]/90">
                    <div className="w-4 h-4 rounded-full bg-[#6B2D5C]/10 border border-[#6B2D5C]/30 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-[#6B2D5C]">{idx + 1}</span>
                    </div>
                    <span className="leading-snug">{step}</span>
                  </div>
                ))}
              </div>

              {/* Recommended Product Duo Box */}
              <div className="border border-[#E8C4D4]/50 rounded-2xl p-3 sm:p-4 flex items-center gap-3.5 bg-white">
                <div className="w-16 h-16 rounded-xl overflow-hidden relative shrink-0 border border-[#E8C4D4]/40 bg-[#FBF6F8]">
                  <Image
                    src={selectedConcern.productImage}
                    alt={selectedConcern.productTitle}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-[#6B2D5C] uppercase tracking-wider block">
                    RECOMMENDED FORMULA
                  </span>
                  <h5 className="text-xs sm:text-sm font-black text-[#2B1822] truncate">
                    {selectedConcern.productTitle}
                  </h5>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-sm font-black text-[#2B1822]">
                      {formatPrice(selectedConcern.price)}
                    </span>
                    <span className="text-[11px] text-[#2B1822]/40 line-through">
                      {formatPrice(selectedConcern.compareAtPrice)}
                    </span>
                    <span className="text-[10px] font-bold text-[#6B2D5C] bg-[#E8C4D4]/40 px-1.5 py-0.5 rounded">
                      SAVE 15%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-[#FBF6F8] border-t border-[#E8C4D4]/40 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedConcern(null)}
                className="px-4 py-2 rounded-full border border-[#E8C4D4]/60 text-xs font-bold text-[#2B1822] hover:bg-white transition cursor-pointer"
              >
                Close
              </button>

              <button
                onClick={() => handleAddRoutineToBag(selectedConcern)}
                className={`flex-1 py-2.5 px-4 rounded-full text-xs font-black tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer ${
                  added
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#6B2D5C] hover:bg-[#562349] text-white'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>ADDED TO BAG!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>ADD ROUTINE TO BAG • {formatPrice(selectedConcern.price)}</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  )
}
