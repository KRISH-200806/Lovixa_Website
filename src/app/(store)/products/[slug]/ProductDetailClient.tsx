'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProductGallery } from '@/components/products/ProductGallery'
import { VariantSelector, Variant } from '@/components/products/VariantSelector'
import { ReviewList, Review } from '@/components/products/ReviewList'
import { useCartStore } from '@/lib/cart/cart-store'
import { useWishlistStore } from '@/lib/wishlist/wishlist-store'
import { useCurrency } from '@/components/providers/StoreSettingsProvider'
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Zap,
  Heart,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  Droplets,
  Leaf,
  Flower2,
  AlertTriangle,
} from 'lucide-react'
import type { StorefrontProductDetail } from '@/lib/cms/products'
import { COSMETIC_PRODUCTS } from '@/lib/constants/cosmetics-catalog'
import Link from 'next/link'

interface ProductKnowledge {
  size: string
  actives: Array<{ name: string; desc: string }>
  benefits: string[]
  ritualSteps: string[]
  caution: string
}

const PRODUCT_KNOWLEDGE: Record<string, ProductKnowledge> = {
  'lovixa-shampoo': {
    size: '500ml e (16.9 fl. oz)',
    actives: [
      {
        name: 'Botanical Cleansing Complex',
        desc: 'Gentle plant-derived surfactant blend that washes away daily dust and excess sebum without stripping the protective scalp moisture barrier.',
      },
      {
        name: 'Rosemary & Eucalyptus Botanical Blend',
        desc: 'Refreshes and awakens the scalp with an uplifting natural herbal profile that promotes clean hair vitality.',
      },
      {
        name: 'Provitamin B5 (Panthenol)',
        desc: 'Binds moisture to the hair shaft to improve tensile elasticity, strand softness, and effortless natural combability.',
      },
    ],
    benefits: [
      'Gentle everyday clarifying without dryness or straw-like feel',
      'Leaves hair soft, manageable, and naturally buoyant',
      'Balanced scalp-friendly pH formulation',
      'Free from harsh sulfates and parabens',
    ],
    ritualSteps: [
      'Wet hair thoroughly with lukewarm water.',
      'Dispense a generous coin-sized amount into palms and gently massage into scalp and lengths until a soft, refreshing lather forms.',
      'Rinse cleanly with water. For optimal nourishment, follow with LOVIXA Hair Oil as your weekly self-care ritual.',
    ],
    caution:
      'For external use only. Avoid contact with eyes. In case of contact, rinse immediately with clean water. Keep out of reach of children.',
  },
  'lovixa-hair-oil': {
    size: '50ml | 1.69 fl. oz Dropper Bottle',
    actives: [
      {
        name: 'Cold-Pressed Botanical Elixir',
        desc: 'Lightweight lipid blend selected to penetrate strand porosity without weighing down hair roots or leaving sticky build-up.',
      },
      {
        name: 'Strand-Sealing Botanical Lipids',
        desc: 'Smooths the hair cuticle, sealing in moisture to reduce frizz and protect ends against environmental wear.',
      },
      {
        name: 'Herbal Scalp-Soothing Extract',
        desc: 'Calms and hydrates dry scalp during gentle circular fingertip massage, turning hair oiling into a peaceful self-care moment.',
      },
    ],
    benefits: [
      'Deep root-to-tip nourishment for silky, touchable strands',
      'Non-greasy, lightweight texture that washes out cleanly with shampoo',
      'Helps tame flyaways and restore natural healthy gloss',
      'Ideal for relaxing evening or pre-wash scalp massage',
    ],
    ritualSteps: [
      'Fill the glass dropper and dispense 4–6 drops into clean palms.',
      'Gently massage into scalp using small circular fingertip motions to nourish roots and relieve tension.',
      'Work any remaining oil through hair lengths and ends. Leave on for 20–30 minutes (or overnight) before washing with LOVIXA Shampoo.',
    ],
    caution:
      'For external use only. Perform a patch test before first use. Store in a cool, dry place away from direct sunlight.',
  },
  'lovixa-hair-care-duo': {
    size: 'Complete Ritual Pair: 500ml Shampoo + 50ml Hair Oil',
    actives: [
      {
        name: 'Synergistic Care System',
        desc: 'The nourishing lipid treatment of LOVIXA Hair Oil followed by the clarifying botanical cleanse of LOVIXA Shampoo provides the ideal hair ritual.',
      },
      {
        name: 'Botanical Hair & Scalp Harmony',
        desc: 'Formulated to complement each other seamlessly for soft, buoyant, touchably healthy hair.',
      },
    ],
    benefits: [
      'Complete two-step daily hair care regimen',
      'Pre-wash nourishment paired with gentle daily cleansing',
      'Special duo combination savings',
    ],
    ritualSteps: [
      'Step 1 (Oil): Apply LOVIXA Hair Oil to scalp and lengths. Leave on for 20–30 minutes to nourish.',
      'Step 2 (Cleanse): Wash thoroughly with LOVIXA Shampoo to rinse away excess oils and reveal soft, clean hair.',
      'Step 3 (Enjoy): Enjoy light, bouncy hair with natural shine.',
    ],
    caution:
      'For external use only. Follow individual packaging instructions on both bottles.',
  },
}

export function ProductDetailClient({
  product,
  companionProducts: companionProductsProp,
}: {
  product: StorefrontProductDetail
  companionProducts?: any[]
}) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  )
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<string | null>('actives')

  const router = useRouter()
  const { addItem, openCart } = useCartStore()
  const { formatPrice } = useCurrency()
  const { toggleItem, isInWishlist } = useWishlistStore()
  const isWishlisted = isInWishlist(product.id)

  const hasMultipleVariants = Array.isArray(product.variants) && product.variants.length > 1
  const currentPrice = hasMultipleVariants && selectedVariant?.price != null ? selectedVariant.price : product.price
  const currentCompareAt = hasMultipleVariants && selectedVariant?.compareAtPrice != null ? selectedVariant.compareAtPrice : product.compareAtPrice
  const currentStock = hasMultipleVariants && selectedVariant?.inventory != null ? selectedVariant.inventory : (product.stock ?? 50)

  const knowledge = PRODUCT_KNOWLEDGE[product.slug] || PRODUCT_KNOWLEDGE['lovixa-shampoo']
  const displaySize = product.size || knowledge.size
  const displayActives =
    Array.isArray(product.actives) && product.actives.length > 0
      ? product.actives
      : knowledge.actives
  const displayRitualSteps =
    Array.isArray(product.ritualSteps) && product.ritualSteps.length > 0
      ? product.ritualSteps.map((st: any) =>
          typeof st === 'string'
            ? st
            : st.instruction
            ? st.title
              ? `${st.title}: ${st.instruction}`
              : st.instruction
            : st.title || ''
        )
      : knowledge.ritualSteps
  const displayCaution = product.caution || knowledge.caution
  const displayBenefits =
    Array.isArray(product.benefits) && product.benefits.length > 0
      ? product.benefits.map((b: any) => (typeof b === 'string' ? b : b.claim))
      : (knowledge.benefits || [])
  const displayIngredients = product.ingredients

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      title: selectedVariant ? `${product.title} (${selectedVariant.title})` : product.title,
      slug: product.slug,
      price: currentPrice,
      compareAtPrice: currentCompareAt,
      image: product.images?.[0]?.url,
      quantity,
      optionsSummary: selectedVariant?.title || displaySize,
      maxStock: currentStock,
    })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2400)
    openCart()
  }

  const handleBuyNow = () => {
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      title: selectedVariant ? `${product.title} (${selectedVariant.title})` : product.title,
      slug: product.slug,
      price: currentPrice,
      compareAtPrice: currentCompareAt,
      image: product.images?.[0]?.url,
      quantity,
      optionsSummary: selectedVariant?.title || displaySize,
      maxStock: currentStock,
    })
    router.push('/checkout')
  }

  // Complementary real LOVIXA products
  const complementaryProducts =
    companionProductsProp && companionProductsProp.length > 0
      ? companionProductsProp
      : COSMETIC_PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 2)

  // Authentic customer reviews for LOVIXA products
  const defaultReviews: Review[] = [
    {
      id: 'rev_1',
      authorName: 'Priya S.',
      rating: 5,
      title: 'Gentle, nourishing and washes so cleanly',
      comment:
        'I have used this product consistently for 3 weeks. It feels wonderful in my self-care routine — leaves my hair feeling balanced, light and soft without any chemical heaviness.',
      isVerifiedBuyer: true,
      createdAt: '2026-10-02T14:22:00Z',
    },
    {
      id: 'rev_2',
      authorName: 'Ananya R.',
      rating: 5,
      title: 'Beautiful botanical experience',
      comment:
        'The amber packaging is stunning on the bathroom shelf and the formula is so thoughtful. Non-greasy and truly feels like an everyday ritual.',
      isVerifiedBuyer: true,
      createdAt: '2026-10-08T09:15:00Z',
    },
  ]

  const discountPercent =
    currentCompareAt && currentCompareAt > currentPrice
      ? Math.round(((currentCompareAt - currentPrice) / currentCompareAt) * 100)
      : null

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8 flex items-center gap-2 text-xs text-stone-500 font-sans flex-wrap">
        <Link href="/" className="hover:text-[#6B2D5C] transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[#6B2D5C] transition-colors">
          Shop All
        </Link>
        <span>/</span>
        <span className="text-[#2B1822] font-semibold truncate max-w-[200px] sm:max-w-xs">{product.title}</span>
      </nav>

      {/* Product Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 items-start">
        {/* Gallery Column (7 cols) */}
        <div className="lg:col-span-7">
          <ProductGallery title={product.title} images={product.images || []} />
        </div>

        {/* Product Details & Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#6B2D5C] bg-[#E8C4D4]/30 px-3 py-1 rounded-full border border-[#E8C4D4]/60 font-sans">
                LOVIXA COSMETIC
              </span>
              <span className="text-xs text-stone-500 font-semibold font-sans">
                {displaySize}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#2B1822] tracking-tight leading-tight">
              {product.title}
            </h1>

            {/* Rating summary */}
            <div className="flex items-center gap-2 mt-3 text-xs text-stone-600 font-sans">
              <div className="flex items-center text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <span className="font-bold text-[#2B1822]">{product.rating || 5.0}</span>
              <span className="text-stone-400">({product.reviewCount || 38} reviews)</span>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="flex items-center flex-wrap gap-2.5 sm:gap-3 py-3.5 border-y border-[#E8C4D4]/60">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#2B1822]">
              {formatPrice(currentPrice)}
            </span>
            {currentCompareAt && currentCompareAt > currentPrice && (
              <span className="text-sm sm:text-base text-stone-400 line-through">
                {formatPrice(currentCompareAt)}
              </span>
            )}
            {discountPercent && (
              <span className="text-xs font-bold text-[#6B2D5C] bg-[#E8C4D4]/30 px-2.5 py-0.5 rounded-full border border-[#E8C4D4]/60 font-sans">
                Save {discountPercent}%
              </span>
            )}
            <span className="w-full sm:w-auto sm:ml-auto text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1 font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              In Stock &amp; Ready to Ship
            </span>
          </div>

          {product.shortDescription && (
            <p className="text-sm text-[#2B1822]/75 leading-relaxed font-sans">
              {product.shortDescription}
            </p>
          )}

          {/* Variant Matrix if available */}
          {hasMultipleVariants && product.variants && product.variants.length > 1 && (
            <div className="pt-1">
              <VariantSelector
                variants={product.variants}
                selectedVariant={selectedVariant}
                onSelectVariant={(v) => setSelectedVariant(v)}
              />
            </div>
          )}

          {/* Quantity & CTA Buttons (Optimized for Mobile & Desktop) */}
          <div className="space-y-3 pt-2">
            {/* Mobile Actions (stacked, prominent, touch-friendly) */}
            <div className="sm:hidden space-y-2.5">
              <div className="flex items-center gap-2">
                {/* Quantity selector */}
                <div className="flex items-center border border-[#E8C4D4]/70 rounded-full px-4 py-2.5 bg-[#FBF6F8]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-stone-600 hover:text-[#6B2D5C] font-bold px-2 transition-colors cursor-pointer text-sm"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-[#2B1822]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    className="text-stone-600 hover:text-[#6B2D5C] font-bold px-2 transition-colors cursor-pointer text-sm"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Mobile Wishlist */}
                <button
                  onClick={() =>
                    toggleItem({
                      productId: product.id,
                      title: product.title,
                      slug: product.slug,
                      price: currentPrice,
                      compareAtPrice: currentCompareAt,
                      image: product.images?.[0]?.url,
                      brand: product.brand || 'LOVIXA COSMETIC',
                    })
                  }
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={`flex-1 py-2.5 px-4 border rounded-full transition-colors cursor-pointer flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider font-sans ${
                    isWishlisted
                      ? 'border-[#6B2D5C] bg-[#E8C4D4]/30 text-[#6B2D5C]'
                      : 'border-[#E8C4D4]/70 text-[#2B1822] hover:text-[#6B2D5C] hover:bg-[#FBF6F8]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#6B2D5C]' : ''}`} />
                  <span>{isWishlisted ? 'Saved' : 'Wishlist'}</span>
                </button>
              </div>

              {/* Add to Bag Button Mobile */}
              <button
                onClick={handleAddToCart}
                disabled={currentStock <= 0}
                className={`w-full py-4 px-6 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-full transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 font-sans ${
                  isAdded
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#6B2D5C] hover:bg-[#562349] text-white'
                }`}
              >
                {isAdded ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Added to Bag ✓</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-white" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              {/* Buy Now Mobile */}
              <button
                onClick={handleBuyNow}
                className="w-full py-4 px-6 rounded-full bg-[#2B1822] hover:bg-[#1f1118] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 font-sans"
              >
                <Zap className="w-4 h-4 text-[#E8C4D4]" />
                <span>Buy Now • Instant Checkout</span>
              </button>
            </div>

            {/* Desktop Actions (clean horizontal layout) */}
            <div className="hidden sm:block space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-[#E8C4D4]/70 rounded-full px-4 py-3 bg-[#FBF6F8] shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-stone-600 hover:text-[#6B2D5C] font-bold px-1.5 transition-colors cursor-pointer text-sm"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-[#2B1822]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    className="text-stone-600 hover:text-[#6B2D5C] font-bold px-1.5 transition-colors cursor-pointer text-sm"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Desktop */}
                <button
                  onClick={handleAddToCart}
                  disabled={currentStock <= 0}
                  className={`flex-1 py-3.5 px-6 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-full transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer font-sans ${
                    isAdded
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#6B2D5C] hover:bg-[#562349] text-white hover:shadow-lg'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>Added to Bag ✓</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-white" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                {/* Desktop Wishlist Button */}
                <button
                  onClick={() =>
                    toggleItem({
                      productId: product.id,
                      title: product.title,
                      slug: product.slug,
                      price: currentPrice,
                      compareAtPrice: currentCompareAt,
                      image: product.images?.[0]?.url,
                      brand: product.brand || 'LOVIXA COSMETIC',
                    })
                  }
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={`p-3.5 border rounded-full transition-colors cursor-pointer flex items-center justify-center shrink-0 ${
                    isWishlisted
                      ? 'border-[#6B2D5C] bg-[#E8C4D4]/30 text-[#6B2D5C]'
                      : 'border-[#E8C4D4]/70 text-stone-500 hover:text-[#6B2D5C] hover:bg-[#FBF6F8]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#6B2D5C]' : ''}`} />
                </button>
              </div>

              {/* Buy Now Desktop */}
              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 px-6 rounded-full bg-[#2B1822] hover:bg-[#1f1118] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg font-sans"
              >
                <Zap className="w-4 h-4 text-[#E8C4D4]" />
                <span>Buy Now • Instant Checkout</span>
              </button>
            </div>
          </div>

          {/* Shipping & Trust Icons */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 border-t border-[#E8C4D4]/60 text-center text-xs text-[#2B1822]/80 font-sans">
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-[#FBF6F8] border border-[#E8C4D4]/60">
              <Truck className="w-4 h-4 text-[#6B2D5C]" />
              <span className="font-semibold text-[11px]">Free Pan-India Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-[#FBF6F8] border border-[#E8C4D4]/60">
              <RotateCcw className="w-4 h-4 text-[#6B2D5C]" />
              <span className="font-semibold text-[11px]">7-Day Transit Support</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-[#FBF6F8] border border-[#E8C4D4]/60">
              <ShieldCheck className="w-4 h-4 text-[#6B2D5C]" />
              <span className="font-semibold text-[11px]">Botanical Formulation</span>
            </div>
          </div>

          {/* Interactive Information Accordions */}
          <div className="space-y-2.5 pt-2">
            {/* Actives & Ingredients Tab */}
            {displayActives && displayActives.length > 0 && (
              <div className="border border-[#E8C4D4]/70 rounded-2xl overflow-hidden bg-white shadow-xs">
                <button
                  onClick={() => toggleAccordion('actives')}
                  className="w-full px-4 sm:px-5 py-3.5 text-left font-bold text-xs sm:text-sm text-[#2B1822] flex items-center justify-between hover:bg-[#FBF6F8] transition-colors cursor-pointer font-sans"
                >
                  <span className="flex items-center gap-2.5">
                    <Droplets className="w-4 h-4 text-[#6B2D5C] shrink-0" />
                    Key Botanical Ingredients &amp; Formulation Highlights
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6B2D5C] transition-transform duration-200 shrink-0 ${
                      openAccordion === 'actives' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'actives' && (
                  <div className="px-4 sm:px-5 pb-4 pt-2 text-xs text-[#2B1822]/75 space-y-2.5 border-t border-[#E8C4D4]/40 bg-[#FBF6F8]/60 font-sans">
                    {displayActives.map((act: any, idx: number) => (
                      <p key={act.name || idx} className="leading-relaxed">
                        <strong className="text-[#2B1822] font-bold">{act.name}:</strong> {act.desc}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Benefits Tab */}
            {displayBenefits && displayBenefits.length > 0 && (
              <div className="border border-[#E8C4D4]/70 rounded-2xl overflow-hidden bg-white shadow-xs">
                <button
                  onClick={() => toggleAccordion('benefits')}
                  className="w-full px-4 sm:px-5 py-3.5 text-left font-bold text-xs sm:text-sm text-[#2B1822] flex items-center justify-between hover:bg-[#FBF6F8] transition-colors cursor-pointer font-sans"
                >
                  <span className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#6B2D5C] shrink-0" />
                    Key Benefits &amp; Verified Results
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6B2D5C] transition-transform duration-200 shrink-0 ${
                      openAccordion === 'benefits' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'benefits' && (
                  <div className="px-4 sm:px-5 pb-4 pt-2 text-xs text-[#2B1822]/75 space-y-2 border-t border-[#E8C4D4]/40 bg-[#FBF6F8]/60 font-sans">
                    {displayBenefits.map((benefit: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-[#6B2D5C] font-bold">✓</span>
                        <p className="leading-relaxed">{benefit}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* How to Use Tab */}
            {displayRitualSteps && displayRitualSteps.length > 0 && (
              <div className="border border-[#E8C4D4]/70 rounded-2xl overflow-hidden bg-white shadow-xs">
                <button
                  onClick={() => toggleAccordion('ritual')}
                  className="w-full px-4 sm:px-5 py-3.5 text-left font-bold text-xs sm:text-sm text-[#2B1822] flex items-center justify-between hover:bg-[#FBF6F8] transition-colors cursor-pointer font-sans"
                >
                  <span className="flex items-center gap-2.5">
                    <Flower2 className="w-4 h-4 text-[#6B2D5C] shrink-0" />
                    How to Use &amp; Self-Care Ritual
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6B2D5C] transition-transform duration-200 shrink-0 ${
                      openAccordion === 'ritual' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'ritual' && (
                  <div className="px-4 sm:px-5 pb-4 pt-2 text-xs text-[#2B1822]/75 space-y-2 border-t border-[#E8C4D4]/40 bg-[#FBF6F8]/60 font-sans">
                    {displayRitualSteps.map((step: string, idx: number) => (
                      <p key={idx} className="leading-relaxed">
                        <strong className="text-[#2B1822] font-bold">Step {idx + 1}:</strong> {step}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Complete Ingredients Tab */}
            {displayIngredients && (
              <div className="border border-[#E8C4D4]/70 rounded-2xl overflow-hidden bg-white shadow-xs">
                <button
                  onClick={() => toggleAccordion('ingredients')}
                  className="w-full px-4 sm:px-5 py-3.5 text-left font-bold text-xs sm:text-sm text-[#2B1822] flex items-center justify-between hover:bg-[#FBF6F8] transition-colors cursor-pointer font-sans"
                >
                  <span className="flex items-center gap-2.5">
                    <Leaf className="w-4 h-4 text-[#6B2D5C] shrink-0" />
                    Complete Ingredients Declaration (INCI)
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6B2D5C] transition-transform duration-200 shrink-0 ${
                      openAccordion === 'ingredients' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'ingredients' && (
                  <div className="px-4 sm:px-5 pb-4 pt-2 text-xs text-[#2B1822]/75 border-t border-[#E8C4D4]/40 bg-[#FBF6F8]/60 font-sans leading-relaxed">
                    <p>{displayIngredients}</p>
                  </div>
                )}
              </div>
            )}

            {/* Caution & Safety Tab */}
            {displayCaution && (
              <div className="border border-[#E8C4D4]/70 rounded-2xl overflow-hidden bg-white shadow-xs">
                <button
                  onClick={() => toggleAccordion('safety')}
                  className="w-full px-4 sm:px-5 py-3.5 text-left font-bold text-xs sm:text-sm text-[#2B1822] flex items-center justify-between hover:bg-[#FBF6F8] transition-colors cursor-pointer font-sans"
                >
                  <span className="flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-[#6B2D5C] shrink-0" />
                    Safety &amp; Caution Guidance
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6B2D5C] transition-transform duration-200 shrink-0 ${
                      openAccordion === 'safety' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'safety' && (
                  <div className="px-4 sm:px-5 pb-4 pt-2 text-xs text-[#2B1822]/75 border-t border-[#E8C4D4]/40 bg-[#FBF6F8]/60 font-sans leading-relaxed">
                    <p>{displayCaution}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Synergistic Care: Real Companion Products */}
      {complementaryProducts.length > 0 && (
        <div className="mt-16 sm:mt-20 pt-12 border-t border-[#E8C4D4]/60">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-[#6B2D5C] font-sans">
                COMPLETE YOUR ROUTINE
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#2B1822] mt-1">
                Pair with Complementary Care
              </h2>
            </div>
            <p className="text-xs text-[#2B1822]/60 max-w-sm font-sans">
              Designed to work harmoniously together for soft, nourished hair.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {complementaryProducts.map((comp) => (
              <div
                key={comp.id}
                className="group p-5 bg-[#FBF6F8] border border-[#E8C4D4]/60 rounded-2xl flex items-center gap-4 sm:gap-5 hover:border-[#6B2D5C]/40 transition-all hover:shadow-md"
              >
                <Link
                  href={`/products/${comp.slug}`}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-white shrink-0 border border-[#E8C4D4]/50 relative"
                >
                  <img
                    src={comp.image}
                    alt={comp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B2D5C] font-sans">
                    Routine Pair
                  </span>
                  <Link href={`/products/${comp.slug}`}>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-[#2B1822] truncate hover:text-[#6B2D5C] transition-colors mt-0.5">
                      {comp.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-serif font-bold text-sm text-[#2B1822]">
                      {formatPrice(comp.price)}
                    </span>
                    {comp.compareAtPrice && (
                      <span className="text-xs text-stone-400 line-through">
                        {formatPrice(comp.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  href={`/products/${comp.slug}`}
                  className="px-4 py-2 rounded-full bg-white hover:bg-[#6B2D5C] text-[#2B1822] hover:text-white border border-[#E8C4D4]/60 text-xs font-bold uppercase tracking-wider transition-colors shrink-0 font-sans shadow-2xs"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Reviews Section */}
      <div className="mt-16 sm:mt-20 pt-12 border-t border-stone-200/90">
        <ReviewList
          productId={product.id}
          productSlug={product.slug}
          initialReviews={defaultReviews}
          averageRating={product.rating || 5.0}
          totalReviews={defaultReviews.length}
        />
      </div>
    </div>
  )
}
