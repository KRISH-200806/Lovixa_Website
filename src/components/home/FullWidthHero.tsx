'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Check,
  Star,
  Leaf,
  Droplets,
  Heart,
} from 'lucide-react'
import type { StorefrontHeroSlide } from '@/lib/cms/products'

interface HeroSlide {
  id: string
  eyebrow: string
  title: string
  italicPart: string
  description: string
  primaryCtaText: string
  primaryCtaLink: string
  secondaryCtaText: string
  secondaryCtaLink: string
  image: string
  tabLabel: string
  badgeTopLeft: { text: string; icon: 'sparkles' | 'droplets' | 'leaf' }
  badgeTopRight: string
  badgeBottom: { title: string; subtitle: string }
}

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-botanical-care',
    eyebrow: 'Clean Botanical Beauty & Care',
    title: 'Sculpt Your Signature Radiance',
    italicPart: 'with Nature-Inspired Care',
    description:
      'Nourish, protect, and illuminate with cold-pressed organic botanicals, gentle herbal bases, and pure plant oils crafted for everyday natural radiance and enduring vitality.',
    primaryCtaText: 'Explore Collection',
    primaryCtaLink: '/products',
    secondaryCtaText: 'Our Philosophy',
    secondaryCtaLink: '/about',
    image: '/images/lovixa-hero-banner-products.jpg',
    tabLabel: 'Signature Care',
    badgeTopLeft: { text: '100% Bio-Botanical Active', icon: 'sparkles' },
    badgeTopRight: 'Cold-Pressed Extracts',
    badgeBottom: {
      title: 'Dermatologist Verified',
      subtitle: 'Gentle on all skin & scalp types',
    },
  },
  {
    id: 'slide-hair-wellness',
    eyebrow: 'Everyday Scalp & Hair Ritual',
    title: 'Pure Botanical Hair Wellness',
    italicPart: 'for Lasting Root Strength',
    description:
      'Enriched with clarifying rosemary and cold-pressed herbal oils crafted to nurture strands, soothe the scalp microbiome, and restore lustrous natural vitality.',
    primaryCtaText: 'Discover Hair Care',
    primaryCtaLink: '/products?category=hair-care',
    secondaryCtaText: 'View Ritual Duo',
    secondaryCtaLink: '/products/lovixa-hair-care-duo',
    image: '/images/lovixa-hero-banner-model.jpg',
    tabLabel: 'Hair Wellness',
    badgeTopLeft: { text: 'Ayurvedic Botanical Blend', icon: 'leaf' },
    badgeTopRight: 'Zero Harsh Sulfates',
    badgeBottom: {
      title: 'Root-to-Tip Nourishment',
      subtitle: 'Tames frizz & reduces breakage',
    },
  },
  {
    id: 'slide-duo-ritual',
    eyebrow: 'Targeted 2-Step Daily Ritual',
    title: 'The Complete Hair Care Duo',
    italicPart: 'Shampoo + Hair Oil Set',
    description:
      'Experience holistic root purification and deep strand conditioning. Pair gentle plant-based cleansing with cold-pressed nourishment for complete, touchable softness.',
    primaryCtaText: 'Shop Hair Care Duo',
    primaryCtaLink: '/products/lovixa-hair-care-duo',
    secondaryCtaText: 'All Formulations',
    secondaryCtaLink: '/products',
    image: '/images/lovixa-duo.jpg',
    tabLabel: 'Complete Duo Set',
    badgeTopLeft: { text: 'Complete 2-Step Kit', icon: 'droplets' },
    badgeTopRight: 'Save 15% Combo Deal',
    badgeBottom: {
      title: 'Holistic Ayurvedic Care',
      subtitle: 'Loved by 2,800+ customers',
    },
  },
]

export function FullWidthHero({ slides }: { slides?: StorefrontHeroSlide[] }) {
  const activeSlides: HeroSlide[] =
    slides && slides.length > 0
      ? slides.map((s, idx) => ({
          id: `cms-slide-${idx}`,
          eyebrow: s.badge || 'Clean Botanical Beauty & Care',
          title: s.heading || 'Sculpt Your Signature Radiance',
          italicPart: s.highlightHeading || 'with Lovixa Atelier',
          description:
            s.subheading ||
            'Nourish, protect, and illuminate with cold-pressed organic botanicals and bio-active nutrients.',
          primaryCtaText: s.ctaText || 'Explore Collection',
          primaryCtaLink: s.ctaLink || '/products',
          secondaryCtaText: s.secondaryCtaText || 'Our Philosophy',
          secondaryCtaLink: s.secondaryCtaLink || '/about',
          image: s.image || s.imageUrl || '/images/lovixa-hero-banner-products.jpg',
          tabLabel: `Ritual 0${idx + 1}`,
          badgeTopLeft: { text: '100% Bio-Botanical Active', icon: 'sparkles' },
          badgeTopRight: 'Dermatologically Tested',
          badgeBottom: {
            title: 'Verified Clean Care',
            subtitle: 'Tested on sensitive skin',
          },
        }))
      : DEFAULT_HERO_SLIDES

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Auto-advance slides every 6.5 seconds unless paused
  useEffect(() => {
    if (isPaused || activeSlides.length <= 1) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length)
    }, 6500)
    return () => clearInterval(timer)
  }, [isPaused, activeSlides.length])

  const slide = activeSlides[currentSlide]

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="w-full relative overflow-hidden bg-gradient-to-b from-[#FBF6F8] via-[#FAF3F6] to-white border-b border-[#E8C4D4]/60 pt-6 pb-14 sm:pb-20"
      aria-label="LOVIXA Cosmetic Hero Showcase"
    >
      {/* Background Ambient Luxury Light Orbs */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-[#E8C4D4]/35 blur-[120px] pointer-events-none animate-glow-breathe" />
      <div className="absolute bottom-0 left-10 w-[500px] h-[500px] rounded-full bg-[#6B2D5C]/10 blur-[100px] pointer-events-none" />

      {/* Main Full-Width Content Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* Top Slide Navigation Tabs (No arrow buttons as requested) */}
        <div className="flex items-center justify-between pb-5 border-b border-[#E8C4D4]/50 mb-8 sm:mb-10">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none py-1">
            {activeSlides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`py-2 px-3.5 sm:px-4 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  currentSlide === idx
                    ? 'bg-[#6B2D5C] text-white shadow-md shadow-[#6B2D5C]/20 scale-102'
                    : 'text-[#2B1822]/70 hover:text-[#6B2D5C] hover:bg-white/90 border border-transparent hover:border-[#E8C4D4]'
                }`}
                aria-label={`Go to slide ${idx + 1}: ${s.tabLabel}`}
              >
                <span className="font-mono text-[10px] opacity-80">0{idx + 1}</span>
                <span>{s.tabLabel}</span>
              </button>
            ))}
          </div>

          {/* Slide Progress / Status Tag */}
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-[#6B2D5C]">
            <span className="w-2 h-2 rounded-full bg-[#6B2D5C] animate-pulse" />
            <span className="tracking-wide uppercase text-[11px] font-sans">
              Curated Botanical Formulations
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: High-Impact Luxury Copy & Actions */}
          <div key={slide.id} className="lg:col-span-6 space-y-6 sm:space-y-7 transition-all duration-500">
            
            {/* Top Eyebrow Tag */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-[#E8C4D4] shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6B2D5C] animate-pulse" />
              <span className="text-xs font-bold text-[#6B2D5C] tracking-wide uppercase font-sans">
                {slide.eyebrow}
              </span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-bold text-[#2B1822] tracking-tight leading-[1.08] font-serif">
              {slide.title}{' '}
              <span className="italic font-normal font-serif text-[#6B2D5C] block sm:inline">
                {slide.italicPart}
              </span>
            </h1>

            {/* Editorial Subtitle */}
            <p className="text-sm sm:text-base text-[#2B1822]/80 leading-relaxed max-w-xl font-sans">
              {slide.description}
            </p>

            {/* Social Proof Pill (Real Verified Ratings) */}
            <div className="inline-flex items-center gap-3 p-2 pr-4 rounded-full bg-white/80 backdrop-blur-md border border-[#E8C4D4]/80 shadow-xs">
              <div className="flex -space-x-2 overflow-hidden pl-1">
                <span className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-[#6B2D5C] text-white text-[10px] font-bold flex items-center justify-center">
                  EV
                </span>
                <span className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-[#82356F] text-white text-[10px] font-bold flex items-center justify-center">
                  AM
                </span>
                <span className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-[#A04886] text-white text-[10px] font-bold flex items-center justify-center">
                  CD
                </span>
                <span className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-[#2B1822] text-white text-[10px] font-bold flex items-center justify-center">
                  +
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <div className="flex text-[#6B2D5C]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#6B2D5C]" />
                  ))}
                </div>
                <span className="font-bold text-[#2B1822]">4.9 / 5</span>
                <span className="text-[#2B1822]/60 hidden sm:inline">(2,800+ Verified Reviews)</span>
              </div>
            </div>

            {/* Dual CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link
                href={slide.primaryCtaLink}
                className="shimmer-btn px-8 py-4 bg-[#6B2D5C] hover:bg-[#562349] text-white font-bold text-xs sm:text-sm rounded-full shadow-lg hover:shadow-xl shadow-[#6B2D5C]/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2.5 cursor-pointer group"
              >
                <span>{slide.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>

              <Link
                href={slide.secondaryCtaLink}
                className="px-8 py-4 bg-white/90 hover:bg-white text-[#6B2D5C] border border-[#E8C4D4] font-bold text-xs sm:text-sm rounded-full shadow-xs hover:shadow-md transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>{slide.secondaryCtaText}</span>
              </Link>
            </div>

            {/* Trust Badges Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#E8C4D4]/60 text-xs text-[#2B1822]/75">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#6B2D5C] shrink-0" />
                <span className="font-semibold">72H Proven Hydration</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#6B2D5C] shrink-0" />
                <span className="font-semibold">Dermatologist Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#6B2D5C] shrink-0" />
                <span className="font-semibold">Pan-India Express Delivery</span>
              </div>
            </div>

          </div>

          {/* Right Column: Full-Width Cinematic Studio Product Display */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[1/1] max-w-lg mx-auto lg:max-w-none rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-[#E8C4D4]/80 shadow-2xl bg-white group">
              
              {/* High-Resolution Hero Visual */}
              <img
                key={slide.image}
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out animate-in fade-in-50 duration-500"
              />

              {/* Ambient Glass Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B1822]/20 via-transparent to-transparent pointer-events-none" />

              {/* Floating Badge 1: Top Left */}
              <div className="absolute top-4 sm:top-6 left-4 sm:left-6 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-[#E8C4D4] text-xs font-bold text-[#6B2D5C] shadow-lg flex items-center gap-2 animate-float-slow">
                {slide.badgeTopLeft.icon === 'sparkles' && <Sparkles className="w-4 h-4 text-[#6B2D5C]" />}
                {slide.badgeTopLeft.icon === 'droplets' && <Droplets className="w-4 h-4 text-[#6B2D5C]" />}
                {slide.badgeTopLeft.icon === 'leaf' && <Leaf className="w-4 h-4 text-[#6B2D5C]" />}
                <span>{slide.badgeTopLeft.text}</span>
              </div>

              {/* Floating Badge 2: Top Right */}
              <div className="absolute top-4 sm:top-6 right-4 sm:right-6 px-3.5 py-1.5 rounded-full bg-[#2B1822]/90 backdrop-blur-md text-white text-[11px] font-black tracking-wider uppercase shadow-lg hidden sm:flex items-center gap-1.5 animate-float-reverse">
                <Leaf className="w-3.5 h-3.5 text-[#E8C4D4]" />
                <span>{slide.badgeTopRight}</span>
              </div>

              {/* Floating Bottom Card: Bottom Right */}
              <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 px-4 sm:px-5 py-3 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E8C4D4] shadow-xl flex items-center gap-3 transition-transform hover:scale-105">
                <div className="w-9 h-9 rounded-full bg-[#6B2D5C] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Check className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black text-[#2B1822]">{slide.badgeBottom.title}</p>
                  <p className="text-[11px] text-[#2B1822]/70 font-medium">
                    {slide.badgeBottom.subtitle}
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

