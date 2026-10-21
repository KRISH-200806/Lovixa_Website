'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import { useWishlistStore } from '@/lib/wishlist/wishlist-store'
import { useCartStore } from '@/lib/cart/cart-store'
import { useCurrency } from '@/components/providers/StoreSettingsProvider'
import { PageHeaderBanner } from '@/components/common/PageHeaderBanner'

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore()
  const { addItem, openCart } = useCartStore()
  const { formatPrice } = useCurrency()

  const handleAddToCart = (item: (typeof items)[0]) => {
    addItem({
      productId: item.productId,
      title: item.title,
      price: item.price,
      compareAtPrice: item.compareAtPrice,
      quantity: 1,
      image: item.image,
      slug: item.slug,
    })
    openCart()
  }

  return (
    <div className="bg-[#FBF6F8] min-h-[75vh] py-6 sm:py-10 text-[#2B1822]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <PageHeaderBanner
          breadcrumbs={[{ label: 'Wishlist' }]}
          badge="SAVED FORMULATIONS"
          title="Your Saved Essentials,"
          highlightTitle="Everyday Beauty Favorites"
          subtitle="Keep your favorite botanical essentials handy and ready to add to your daily routine."
          imageSrc="/images/lovixa-hero-banner-model.jpg"
          imageAlt="Saved LOVIXA Products"
          priority
        />

        {items.length > 0 && (
          <div className="flex justify-end pb-2">
            <button
              onClick={clearWishlist}
              className="text-xs text-stone-500 hover:text-rose-600 transition-colors flex items-center gap-1 font-sans cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Wishlist ({items.length})</span>
            </button>
          </div>
        )}

        {items.length === 0 ? (
          <div className="max-w-xl mx-auto text-center py-16 px-4 bg-[#E8C4D4]/20 border border-[#E8C4D4]/70 rounded-3xl shadow-xs">
            <div className="w-20 h-20 rounded-full bg-white border border-[#E8C4D4]/60 flex items-center justify-center text-[#6B2D5C] mx-auto mb-6 shadow-xs">
              <Heart className="w-9 h-9" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-sans font-bold text-[#2B1822] mb-3">
              Your wishlist is currently empty
            </h2>
            <p className="text-sm text-[#2B1822]/70 leading-relaxed font-sans mb-8 max-w-md mx-auto">
              Save your favorite LOVIXA formulations here to revisit and craft your personal self-care ritual.
            </p>
            <Link
              href="/products"
              prefetch={true}
              scroll={true}
              className="btn-primary !px-8 !py-4 inline-flex items-center gap-2 shadow-md"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 text-[#E8C4D4]" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {items.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-3xl border border-[#E8C4D4]/70 p-5 flex flex-col justify-between hover:shadow-md hover:border-[#6B2D5C]/40 transition-all duration-300 relative group"
              >
                <div>
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FBF6F8] mb-4 border border-[#E8C4D4]/60">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-sans font-bold text-2xl text-[#2B1822]/30">
                        LX
                      </div>
                    )}

                    <button
                      onClick={() => removeItem(item.productId)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-stone-500 hover:text-rose-600 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B2D5C] block mb-1 font-sans">
                    {item.brand || 'LOVIXA COSMETIC'}
                  </span>

                  <Link
                    href={item.slug ? `/products/${item.slug}` : '/products'}
                    prefetch={true}
                    scroll={true}
                    className="font-sans font-bold text-base sm:text-lg text-[#2B1822] hover:text-[#6B2D5C] transition-colors block leading-snug mb-2"
                  >
                    {item.title}
                  </Link>

                  <div className="flex items-center gap-2 mb-4 font-sans">
                    <span className="text-base font-sans font-bold text-[#2B1822]">
                      {formatPrice(item.price)}
                    </span>
                    {item.compareAtPrice && item.compareAtPrice > item.price && (
                      <span className="text-xs text-[#2B1822]/40 line-through">
                        {formatPrice(item.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleAddToCart(item)}
                  className="btn-primary w-full !py-3 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#E8C4D4]" />
                  <span>Add to Bag</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
