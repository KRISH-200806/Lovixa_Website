'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Star,
  Leaf,
  Droplets,
  Truck,
  RotateCcw,
} from 'lucide-react'

interface BannerSlide {
  id: string
  eyebrow: string
  title: string
  highlight: string
  subtitle: string
  primaryCtaText: string
  primaryCtaLink: string
  secondaryCtaText: string
  secondaryCtaLink: string
  image: string
  badgeText: string
}

const HERO_SLIDES: BannerSlide[] = [
  {
    id: 'slide-model',
    eyebrow: '100% BOTANICAL HAIR CARE ESSENTIALS',
    title: 'BEAUTIFUL HAIR BEGINS WITH',
    highlight: 'THOUGHTFUL CARE.',
    subtitle:
      'Enriched with Rosemary, Eucalyptus & Cold-Pressed Botanical Oils. Formulated to gently clarify your scalp and seal moisture for radiant, resilient hair.',
    primaryCtaText: 'SHOP COLLECTION',
    primaryCtaLink: '#collection',
    secondaryCtaText: 'EXPLORE RITUAL',
    secondaryCtaLink: '#ritual',
    image: '/images/lovixa-hero-banner-model.jpg',
    badgeText: '★ 4.9/5 RATED • 1,240+ VERIFIED BUYERS',
  },
  {
    id: 'slide-products',
    eyebrow: 'THE COMPLETE EVERYDAY ESSENTIALS',
    title: 'GENTLE CLEANSING & DEEP',
    highlight: 'ROOT NOURISHMENT.',
    subtitle:
      'LOVIXA Botanical Refreshing Shampoo (200ml) & Nourishing Hair Oil (100ml). The perfect daily routine for clean scalp, glossy ends, and zero frizz.',
    primaryCtaText: 'EXPLORE THE DUO',
    primaryCtaLink: '#concerns',
    secondaryCtaText: 'VIEW PRODUCTS',
    secondaryCtaLink: '#collection',
    image: '/images/lovixa-hero-banner-products.jpg',
    badgeText: '200ML SHAMPOO + 100ML HAIR OIL',
  },
  {
    id: 'slide-duo',
    eyebrow: 'PURE AYURVEDIC WELLNESS',
    title: 'COMPLETE BOTANICAL',
    highlight: 'HAIR CARE DUO SET.',
    subtitle:
      'Nourish your scalp from root to tip with cold-pressed botanical hair care. Mindfully crafted with 100% Ayurvedic integrity and Pan-India delivery.',
    primaryCtaText: 'SHOP THE DUO',
    primaryCtaLink: '#collection',
    secondaryCtaText: 'WHY LOVIXA',
    secondaryCtaLink: '#why-choose',
    image: '/images/lovixa-duo.jpg',
    badgeText: '100% AYURVEDIC FORMULATION',
  },
]

const TRUST_PILLARS = [
  {
    icon: Leaf,
    title: '100% Botanical Extracts',
    desc: 'Sulfate & Paraben Free',
  },
  {
    icon: ShieldCheck,
    title: 'Dermatologist Tested',
    desc: 'Gentle on Sensitive Scalp',
  },
  {
    icon: Droplets,
    title: 'Cold-Pressed Nutrition',
    desc: 'Deep Root Conditioning',
  },
  {
    icon: Truck,
    title: 'Free Pan-India Delivery',
    desc: 'On All Prepaid Orders',
  },
  {
    icon: RotateCcw,
    title: '7-Day Easy Resolution',
    desc: 'Hassle-Free Damaged Transit Care',
  },
]

import type { StorefrontHeroSlide } from '@/lib/cms/products'

export function LovixaHero({ slides }: { slides?: StorefrontHeroSlide[] }) {
  const activeSlides: BannerSlide[] =
    slides && slides.length > 0
      ? slides.map((s, idx) => ({
          id: `cms-slide-${idx}`,
          eyebrow: s.badge || '100% BOTANICAL HAIR CARE ESSENTIALS',
          title: s.heading || 'BEAUTIFUL HAIR BEGINS WITH',
          highlight: s.highlightHeading || 'THOUGHTFUL CARE.',
          subtitle: s.subheading || 'Enriched with Rosemary, Eucalyptus & Cold-Pressed Botanical Oils.',
          primaryCtaText: s.ctaText || 'SHOP COLLECTION',
          primaryCtaLink: s.ctaLink || '/products',
          secondaryCtaText: s.secondaryCtaText || 'EXPLORE RITUAL',
          secondaryCtaLink: s.secondaryCtaLink || '/about',
          image: s.image || s.imageUrl || '/images/lovixa-hero-banner-products.jpg',
          badgeText: s.badge || '★ 4.9/5 RATED • 1,240+ VERIFIED BUYERS',
        }))
      : HERO_SLIDES

  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const totalSlides = activeSlides.length

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % totalSlides)
  }, [totalSlides])

  useEffect(() => {
    if (isPaused || totalSlides <= 1) return
    const timer = setInterval(nextSlide, 5500)
    return () => clearInterval(timer)
  }, [isPaused, nextSlide, totalSlides])

  return (
    <section
      aria-label="Hero Banner Slideshow"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden bg-[#2B1822] text-white select-none"
    >
      {/* ============================================================== */}
      {/* 1. FULL-WIDTH CINEMATIC HERO SLIDER                            */}
      {/* ============================================================== */}
      <div className="relative w-full h-[480px] sm:h-[560px] md:h-[620px] lg:h-[660px] xl:h-[700px] overflow-hidden">
        {activeSlides.map((slide, idx) => {
          const isActive = idx === current
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Banner Image */}
              <div className="relative w-full h-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={idx === 0}
                  className="object-cover object-right md:object-center transition-transform duration-7000 ease-out"
                  sizes="100vw"
                />
                {/* Contrast Gradient Overlays for Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#2B1822]/95 via-[#2B1822]/80 md:via-[#2B1822]/60 to-transparent md:w-3/4" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2B1822]/90 via-transparent to-black/20 md:hidden" />
              </div>

              {/* Banner Text Overlay Content */}
              <div className="absolute inset-0 z-20 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-xl md:max-w-2xl lg:max-w-3xl space-y-3 sm:space-y-4 md:space-y-5">
                    
                    {/* Eyebrow Pill */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-xs">
                      <Sparkles className="w-3 h-3 text-[#E8C4D4]" />
                      <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase font-sans">
                        {slide.eyebrow}
                      </span>
                    </div>

                    {/* Refined Luxury Headline */}
                    <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-sans font-bold tracking-tight leading-[1.18] text-white uppercase drop-shadow-xs">
                      {slide.title}{' '}
                      <span className="text-[#E8C4D4] block sm:inline font-normal">
                        {slide.highlight}
                      </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 leading-relaxed font-sans font-normal max-w-xl drop-shadow-xs line-clamp-3 sm:line-clamp-none">
                      {slide.subtitle}
                    </p>

                    {/* Trust Rating Badge */}
                    <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-wider text-[#E8C4D4] uppercase font-sans">
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <span className="truncate">{slide.badgeText}</span>
                    </div>

                    {/* Refined Pill CTAs */}
                    <div className="pt-1.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5">
                      <Link
                        href={slide.primaryCtaLink}
                        className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#6B2D5C] hover:bg-[#562349] text-white text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-101 flex items-center justify-center gap-2 group cursor-pointer text-center"
                      >
                        <span>{slide.primaryCtaText}</span>
                        <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                      </Link>

                      <Link
                        href={slide.secondaryCtaLink}
                        className="px-5 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/40 hover:border-white text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center cursor-pointer text-center"
                      >
                        <span>{slide.secondaryCtaText}</span>
                      </Link>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Carousel Indicator Dots */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === current ? 'w-7 bg-[#6B2D5C]' : 'w-2 bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. D2C TRUST PILLARS BAR (The Wellness Shop Proof Bar)          */}
      {/* ============================================================== */}
      <div className="bg-[#FBF6F8] text-[#2B1822] border-y border-[#E8C4D4]/50 py-4 sm:py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 items-center">
            {TRUST_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#6B2D5C]/10 border border-[#6B2D5C]/20 text-[#6B2D5C] flex items-center justify-center shrink-0 shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold font-sans text-[#2B1822] truncate leading-tight">
                      {pillar.title}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-[#2B1822]/60 font-medium font-sans truncate">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
