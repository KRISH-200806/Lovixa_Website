'use client'

import Image from 'next/image'
import { Check, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { BrushStroke } from '@/components/ui/BrushStroke'
import type { StorefrontCommunityData } from '@/lib/cms/products'

function InstagramIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

const DEFAULT_POSTS = [
  {
    image: '/images/lovixa-insta-1.jpg',
    handle: '@lovixa_cosmetic',
    caption: 'Ayurvedic Sunday scalp oiling ritual 🌿',
  },
  {
    image: '/images/lovixa-insta-2.jpg',
    handle: '@lovixa_cosmetic',
    caption: 'Clean, glossy bounce without heavy residue ✨',
  },
  {
    image: '/images/lovixa-insta-3.jpg',
    handle: '@lovixa_cosmetic',
    caption: 'Bathroom shelf essentials for healthy roots 🧴',
  },
  {
    image: '/images/lovixa-insta-4.jpg',
    handle: '@lovixa_cosmetic',
    caption: 'Gentle plant lather that respects scalp pH 🫧',
  },
]

interface Props {
  data?: StorefrontCommunityData
}

export function LovixaCommunity({ data }: Props) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const heading = data?.heading || 'Moments of Botanical Self-Care'
  const subtitle =
    data?.subtitle ||
    'Share your daily hair ceremonies and tag @lovixa_cosmetic to be featured in our botanical gallery'
  const vipBadge = data?.vipBadge || 'THE LOVIXA PRIVILEGE CIRCLE'
  const vipTitle = data?.vipTitle || 'Join Our Community for Exclusive Offers'
  const vipSubtitle =
    data?.vipSubtitle ||
    'Connect with our official WhatsApp community to receive your personal welcome discount voucher directly on your phone.'
  const vipCode = data?.vipCode || ''
  const posts =
    data?.galleryImages && data.galleryImages.length > 0
      ? data.galleryImages.map((g) => ({
          image: g.image,
          handle: '@lovixa_cosmetic',
          caption: g.caption || '@lovixa_cosmetic ritual',
        }))
      : DEFAULT_POSTS

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) return

    setIsLoading(true)
    setErrorMessage('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const result = await res.json()
      if (res.ok) {
        setSubscribed(true)
      } else {
        setErrorMessage(result.error || 'Failed to subscribe')
      }
    } catch {
      setErrorMessage('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-14 sm:py-20 bg-[#FBF6F8] relative border-b border-[#E8C4D4]/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Heading with Signature Brush Stroke */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-block relative">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-bold text-[#2B1822] tracking-tight">
              {heading}
            </h2>
            <BrushStroke className="text-[#6B2D5C]" />
          </div>
          <p className="text-xs sm:text-sm text-[#2B1822]/70 mt-2 max-w-md mx-auto">
            {subtitle}
          </p>
        </div>

        {/* 4 Square Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-14">
          {posts.map((post, idx) => (
            <a
              key={idx}
              href="https://www.instagram.com/lovixa_cosmetic"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-xl overflow-hidden bg-stone-100 shadow-xs block"
            >
              <Image
                src={post.image}
                alt={post.caption}
                fill
                className="object-cover group-hover:scale-106 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center text-white">
                <InstagramIcon className="w-6 h-6 mb-1 text-white" />
                <span className="text-[11px] font-bold">{post.handle}</span>
                <p className="text-[10px] text-white/90 line-clamp-2 mt-1">
                  {post.caption}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* VIP Club Newsletter Banner */}
        <div className="bg-[#FBF6F8] rounded-2xl sm:rounded-3xl border border-[#E8C4D4]/60 p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-xs">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#6B2D5C] block mb-1">
            {vipBadge}
          </span>

          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold font-sans text-[#2B1822] tracking-tight mb-2">
            {vipTitle}
          </h3>

          <p className="text-xs sm:text-sm text-[#2B1822]/70 max-w-md mx-auto mb-6 leading-relaxed">
            {vipSubtitle}
          </p>

          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              disabled={isLoading || subscribed}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-4 py-3 rounded-none sm:rounded-sm bg-white border border-[#E8C4D4]/60 text-xs text-[#2B1822] placeholder:text-[#2B1822]/40 focus:outline-none focus:border-[#6B2D5C]"
            />
            <button
              type="submit"
              disabled={isLoading || subscribed}
              className="px-6 py-3 bg-[#6B2D5C] hover:bg-[#562349] disabled:opacity-85 text-white text-xs font-bold uppercase tracking-wider transition-all rounded-none sm:rounded-sm flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              {subscribed ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>SUBSCRIBED!</span>
                </>
              ) : isLoading ? (
                <span>JOINING...</span>
              ) : (
                <>
                  <span>JOIN VIP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
          {errorMessage && (
            <p className="text-xs text-rose-600 mt-2 font-medium">{errorMessage}</p>
          )}
          {subscribed && (
            <p className="text-xs text-emerald-700 mt-3 font-medium">
              Welcome to the LOVIXA Privilege Circle! Message our WhatsApp support at <strong>+91 97124 60509</strong> with your email to claim your exclusive personal coupon code.
            </p>
          )}

          <div className="mt-6 pt-5 border-t border-[#E8C4D4]/40 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-[#2B1822]/75">
            <span>Prefer instant WhatsApp assistance?</span>
            <a
              href="https://wa.me/919712460509?text=Hello%20Lovixa%2C%20I%20would%20like%20to%20receive%20my%20VIP%20welcome%20discount%20coupon"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-[#6B2D5C] hover:underline"
            >
              <span>Chat on WhatsApp &rarr;</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
