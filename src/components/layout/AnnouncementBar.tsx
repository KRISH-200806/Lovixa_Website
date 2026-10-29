'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Truck, Tag, ShieldCheck, Copy, Check } from 'lucide-react'

const MARQUEE_ITEMS = [
  {
    icon: Tag,
    text: 'CONNECT ON WHATSAPP FOR EXCLUSIVE VIP OFFERS & PERSONAL VOUCHERS',
    link: 'https://wa.me/919712460509?text=Hello%20Lovixa%2C%20I%20would%20like%20to%20receive%20an%20exclusive%20VIP%20discount%20code',
  },
  {
    icon: Truck,
    text: 'EXPRESS PAN-INDIA DELIVERY WITH REAL-TIME TRACKING',
    link: '/shipping-policy',
  },
  {
    icon: Sparkles,
    text: '100% AYURVEDIC COLD-PRESSED BOTANICAL HAIR CARE',
    link: '/#why-choose',
  },
  {
    icon: ShieldCheck,
    text: 'DERMATOLOGICALLY TESTED • ZERO HARSH SULFATES • CRUELTY-FREE',
    link: '/#why-choose',
  },
]

export function AnnouncementBar() {
  return (
    <aside
      aria-label="Announcement Offers & Shipping Marquee"
      className="bg-[#6B2D5C] text-white text-[11px] sm:text-xs font-semibold h-9 sm:h-10 flex items-center border-b border-[#562349] relative z-50 overflow-hidden select-none"
    >
      <div className="w-full flex items-center overflow-hidden">
        {/* Continuous looping marquee */}
        <div className="flex animate-marquee whitespace-nowrap items-center hover:[animation-play-state:paused]">
          {[...Array(2)].map((_, loopIdx) => (
            <div key={loopIdx} className="flex items-center">
              {MARQUEE_ITEMS.map((item, idx) => {
                const Icon = item.icon
                return (
                  <div key={idx} className="inline-flex items-center gap-2.5 mx-6 sm:mx-8">
                    <Icon className="w-3.5 h-3.5 text-white/90 shrink-0" />
                    <Link
                      href={item.link}
                      className="hover:text-white/80 transition-colors tracking-wider uppercase font-sans flex items-center gap-2"
                    >
                      <span>{item.text}</span>
                    </Link>
                    <span className="text-[#E8C4D4]/60 ml-4">•</span>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default AnnouncementBar

