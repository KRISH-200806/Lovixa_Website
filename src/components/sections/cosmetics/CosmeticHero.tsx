'use client'

import React, { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { COSMETIC_PRODUCTS } from '@/data/mockCosmetics'

export default function CosmeticHero() {
  const { addItem } = useCart()
  const [activeSlide, setActiveSlide] = useState<number>(0)

  const hairShampoo = COSMETIC_PRODUCTS.find((p) => p.slug === 'rosemary-methi-dana-hair-shampoo') || COSMETIC_PRODUCTS[0]
  const lipstickProduct = COSMETIC_PRODUCTS.find((p) => p.slug === 'velvet-luxe-matte-lipstick') || COSMETIC_PRODUCTS[1]

  // Auto slide every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev === 0 ? 1 : 0))
    }, 7000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative overflow-hidden bg-background pt-6 pb-14 sm:pb-18 border-b border-brand-200">
      {/* Background Subtle Blush Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-brand-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Announcement & Slide Selector Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-radius-pill bg-brand-50 border border-brand-200 text-brand-600 text-body-xs font-semibold tracking-wide shadow-sm">
            <span className="inline-block animate-pulse text-sm">✨</span>
            <span>New Launch Spotlight • 2026 Beauty &amp; Haircare Collection</span>
          </div>

          {/* Slide Navigation Tabs */}
          <div className="flex items-center gap-1.5 bg-brand-50/80 backdrop-blur-sm p-1 rounded-radius-pill border border-brand-200">
            <button
              type="button"
              onClick={() => setActiveSlide(0)}
              className={`px-3.5 py-1.5 rounded-radius-pill text-xs font-semibold transition-all ${
                activeSlide === 0
                  ? 'bg-brand-500 text-neutral-0 shadow-elev-1'
                  : 'text-neutral-500 hover:text-foreground'
              }`}
            >
              🌿 Rosemary &amp; Methi Dana Haircare
            </button>
            <button
              type="button"
              onClick={() => setActiveSlide(1)}
              className={`px-3.5 py-1.5 rounded-radius-pill text-xs font-semibold transition-all ${
                activeSlide === 1
                  ? 'bg-brand-500 text-neutral-0 shadow-elev-1'
                  : 'text-neutral-500 hover:text-foreground'
              }`}
            >
              💄 Radiance &amp; Lip Colors
            </button>
          </div>
        </div>

        {/* SLIDE 0: Rosemary & Methi Dana Haircare Banner (PRIMARY HERO) */}
        {activeSlide === 0 && (
          <div className="animate-fade-in space-y-6">
            {/* Grand Hero Banner Card */}
            <div className="relative group rounded-radius-xl sm:rounded-radius-2xl overflow-hidden border border-brand-200 bg-gradient-to-r from-brand-50 via-brand-100 to-brand-50 shadow-elev-3 transition-all duration-300">
              <a href="#shop-products" className="block relative">
                <img
                  src="/images/hero-banner.png"
                  alt="Lovixa Rosemary & Methi Dana Hair Shampoo - Stronger, Healthier Hair Naturally"
                  className="w-full h-auto object-cover object-center max-h-[540px] transition-transform duration-700 group-hover:scale-[1.01]"
                  loading="eager"
                />
              </a>

              {/* Floating Quick Action Overlay on Banner (Bottom Right / Mobile Stack) */}
              <div className="sm:absolute sm:bottom-4 sm:right-4 m-3 sm:m-0 p-3.5 sm:p-4 rounded-radius-lg bg-background/95 backdrop-blur-md border border-brand-200 shadow-elev-3 flex items-center justify-between sm:justify-start gap-4 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-radius-md bg-brand-50 border border-brand-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <span className="text-2xl">🌿</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand-600 block">
                      Featured Haircare
                    </span>
                    <h4 className="font-heading text-body-xs sm:text-body-sm font-semibold text-foreground line-clamp-1">
                      {hairShampoo.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-bold text-foreground text-body-xs sm:text-body-sm">
                        ₹{hairShampoo.price}
                      </span>
                      {hairShampoo.compareAtPrice && (
                        <span className="text-[11px] text-neutral-400 line-through">
                          ₹{hairShampoo.compareAtPrice}
                        </span>
                      )}
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        Save 28%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      addItem({
                        id: hairShampoo.id,
                        title: hairShampoo.title,
                        slug: hairShampoo.slug,
                        price: hairShampoo.price,
                        compareAtPrice: hairShampoo.compareAtPrice,
                        image: hairShampoo.image,
                      })
                    }
                    className="px-5 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-neutral-0 text-body-xs font-semibold whitespace-nowrap shadow-elev-2 hover:shadow-brand-glow transition-all active:scale-95 cursor-pointer"
                  >
                    Add to Cart +
                  </button>
                  <a
                    href="#shop-products"
                    className="hidden md:inline-flex px-4 py-2.5 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-900 text-body-xs font-medium border border-brand-200 transition-colors"
                  >
                    View All
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Benefits Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-radius-lg bg-brand-50/60 border border-brand-200">
              <div className="flex items-center gap-3">
                <span className="text-brand-500 text-xl flex-shrink-0">🌿</span>
                <div>
                  <h4 className="text-body-xs font-semibold text-foreground">Rosemary &amp; Methi Dana</h4>
                  <p className="text-[11px] text-neutral-500">Pure botanical hairfall control</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-brand-500 text-xl flex-shrink-0">🔬</span>
                <div>
                  <h4 className="text-body-xs font-semibold text-foreground">Toxin &amp; Sulphate Free</h4>
                  <p className="text-[11px] text-neutral-500">Paraben-free &amp; daily safe</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-brand-500 text-xl flex-shrink-0">✨</span>
                <div>
                  <h4 className="text-body-xs font-semibold text-foreground">Stronger &amp; Softer Hair</h4>
                  <p className="text-[11px] text-neutral-500">Nourishes roots &amp; scalp</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-brand-500 text-xl flex-shrink-0">🚚</span>
                <div>
                  <h4 className="text-body-xs font-semibold text-foreground">Free Express Shipping</h4>
                  <p className="text-[11px] text-neutral-500">On all orders ₹499+</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 1: Luxury Cosmetics & Skincare (CLASSIC HERO VIEW) */}
        {activeSlide === 1 && (
          <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="space-y-2">
                <span className="block font-accent italic text-h4 text-brand-600 font-normal">
                  for him &amp; her
                </span>
                <h1 className="font-heading text-h1 tracking-wide uppercase text-foreground leading-[1.05]">
                  Unveil Your Natural <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-brand-600 to-brand-900">
                    Radiance &amp; Elegance
                  </span>
                </h1>
              </div>

              <p className="text-body-lg text-neutral-500 max-w-2xl mx-auto lg:mx-0 font-sans leading-relaxed">
                Dermatologically tested, 100% vegan lip colors, barrier-repairing serums, and weightless SPF crafted to elevate your daily beauty ritual.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#shop-products"
                  className="px-8 py-4 rounded-full bg-brand-500 hover:bg-brand-600 text-neutral-0 font-semibold text-body-md tracking-wide shadow-elev-2 hover:shadow-brand-glow transition-all"
                >
                  Shop Best Sellers →
                </a>
                <a
                  href="#categories"
                  className="px-8 py-4 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-900 font-semibold text-body-md border border-brand-200 transition-colors"
                >
                  Explore Categories
                </a>
              </div>

              {/* Trust Points */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-brand-200">
                <div className="flex items-center gap-2 text-left">
                  <span className="text-brand-500 text-lg">🌿</span>
                  <span className="text-body-xs text-neutral-500 font-medium">100% Vegan &amp; Cruelty Free</span>
                </div>
                <div className="flex items-center gap-2 text-left">
                  <span className="text-brand-500 text-lg">🔬</span>
                  <span className="text-body-xs text-neutral-500 font-medium">Derm Tested &amp; Safe</span>
                </div>
                <div className="flex items-center gap-2 text-left">
                  <span className="text-brand-500 text-lg">✨</span>
                  <span className="text-body-xs text-neutral-500 font-medium">16H Long Stay Formula</span>
                </div>
                <div className="flex items-center gap-2 text-left">
                  <span className="text-brand-500 text-lg">🚚</span>
                  <span className="text-body-xs text-neutral-500 font-medium">Free Delivery ₹499+</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-radius-xl overflow-hidden border border-brand-200 bg-gradient-to-br from-brand-100 via-brand-50 to-brand-200 shadow-elev-3 aspect-[4/5]">
                  <img
                    src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80"
                    alt="Lovixa Cosmetics Beauty Model"
                    className="w-full h-full object-cover object-center"
                  />

                  {/* Floating Product Highlight Card */}
                  <div className="absolute inset-x-4 bottom-4 p-4 rounded-radius-lg bg-background/95 backdrop-blur-md border border-brand-200 shadow-elev-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={lipstickProduct.image}
                        alt={lipstickProduct.title}
                        className="w-14 h-14 rounded-radius-md object-cover border border-brand-200"
                      />
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-brand-500">
                          Trending Lip Color
                        </span>
                        <h4 className="font-heading text-body-sm font-semibold text-foreground line-clamp-1">
                          {lipstickProduct.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground text-body-sm">
                            ₹{lipstickProduct.price}
                          </span>
                          <span className="text-xs text-neutral-400 line-through">
                            ₹{lipstickProduct.compareAtPrice}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        addItem({
                          id: lipstickProduct.id,
                          title: lipstickProduct.title,
                          slug: lipstickProduct.slug,
                          price: lipstickProduct.price,
                          compareAtPrice: lipstickProduct.compareAtPrice,
                          image: lipstickProduct.image,
                          selectedShade: lipstickProduct.shades ? lipstickProduct.shades[0] : undefined,
                        })
                      }
                      className="px-5 py-2 rounded-full bg-brand-500 hover:bg-brand-600 text-neutral-0 text-body-xs font-semibold whitespace-nowrap shadow-elev-1 transition-all cursor-pointer"
                    >
                      Add +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
