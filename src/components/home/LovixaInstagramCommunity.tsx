'use client'

import Image from 'next/image'
import { ArrowRight, Sparkles } from 'lucide-react'

const INSTA_POSTS = [
  {
    image: '/images/lovixa-insta-1.jpg',
    alt: 'Botanical hair oiling ritual with natural ingredients',
    label: 'Botanical Rituals',
  },
  {
    image: '/images/lovixa-insta-2.jpg',
    alt: 'Lustrous, radiant natural hair texture in morning sunlight',
    label: 'Healthy Strands',
  },
  {
    image: '/images/lovixa-insta-3.jpg',
    alt: 'LOVIXA bottles arranged on serene marble vanity shelf',
    label: 'Vanity Essentials',
  },
  {
    image: '/images/lovixa-insta-4.jpg',
    alt: 'Soft gentle botanical lather of LOVIXA shampoo',
    label: 'Gentle Cleansing',
  },
]

export function LovixaInstagramCommunity() {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-[#E8C4D4]/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FBF6F8] border border-[#E8C4D4]">
            <Sparkles className="w-3.5 h-3.5 text-[#6B2D5C]" />
            <span className="text-[11px] font-bold tracking-[0.22em] text-[#6B2D5C] uppercase font-sans">
              STAY CONNECTED
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#2B1822] tracking-tight">
            Follow the LOVIXA Journey.
          </h2>

          <p className="text-sm sm:text-base text-[#2B1822]/75 leading-relaxed font-sans">
            Discover product updates, beauty inspiration, and everyday self-care moments.
          </p>

          <div className="pt-2">
            <a
              href="https://instagram.com/lovixa_cosmetic"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FBF6F8] hover:bg-[#6B2D5C] text-[#2B1822] hover:text-white border border-[#E8C4D4] hover:border-[#6B2D5C] text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-xs group"
            >
              <svg className="w-4 h-4 text-[#6B2D5C] group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <span>@lovixa_cosmetic</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* 4-Image Instagram Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {INSTA_POSTS.map((post, idx) => (
            <a
              key={idx}
              href="https://instagram.com/lovixa_cosmetic"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-[#FBF6F8] border border-[#E8C4D4]/70 shadow-xs hover:shadow-xl transition-all duration-300 block"
            >
              <Image
                src={post.image}
                alt={post.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 640px) 50vw, 25vw"
              />

              {/* Hover overlay with Instagram icon */}
              <div className="absolute inset-0 bg-[#2B1822]/65 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center text-white">
                <svg className="w-7 h-7 text-white mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-wider">{post.label}</span>
                <span className="text-[10px] text-[#E8C4D4] mt-1">@lovixa_cosmetic</span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  )
}
