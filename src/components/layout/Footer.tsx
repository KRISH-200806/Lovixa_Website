'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useCartStore } from '@/lib/cart/cart-store'
import { useAuth } from '@/components/providers/AuthProvider'
import { useStoreSettings } from '@/components/providers/StoreSettingsProvider'

// Social Icons matching Tezvi
function FacebookIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  )
}

function InstagramIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function YouTubeIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

// Trust Badge Icons matching Tezvi's exact stroke aesthetic
function FreeShippingIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.24-4.05A1 1 0 0 0 17.76 8H14v10" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  )
}

function EasyReturnIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}

function CodIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  )
}

// Payment Badges matching Tezvi bottom bar
function PhonePeBadge() {
  return (
    <div className="h-6 px-2 py-0.5 bg-white border border-stone-200 rounded flex items-center justify-center shadow-xs">
      <span className="font-sans font-black text-[9px] text-[#5f259f] tracking-tight">
        PhonePe
      </span>
    </div>
  )
}

function BankTransferBadge() {
  return (
    <div className="h-6 px-2 py-0.5 bg-white border border-stone-200 rounded flex items-center justify-center shadow-xs">
      <span className="font-sans font-bold text-[9px] text-[#2B1822] tracking-tight">
        Bank Transfer
      </span>
    </div>
  )
}

function WhatsAppVerifiedIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function RuPayBadge() {
  return (
    <div className="h-6 px-2 py-0.5 bg-white border border-stone-200 rounded flex items-center justify-center gap-0.5 shadow-xs">
      <span className="font-sans font-extrabold text-[10px] text-[#097939] tracking-tight">Ru</span>
      <span className="font-sans font-extrabold text-[10px] text-[#EF4123] tracking-tight">Pay</span>
    </div>
  )
}

function PaytmBadge() {
  return (
    <div className="h-6 px-2 py-0.5 bg-white border border-stone-200 rounded flex items-center justify-center shadow-xs">
      <span className="font-sans font-extrabold text-[10px] text-[#002E6E] tracking-tight">Pay</span>
      <span className="font-sans font-extrabold text-[10px] text-[#00BAF2] tracking-tight">tm</span>
    </div>
  )
}

function GPayBadge() {
  return (
    <div className="h-6 px-2 py-0.5 bg-white border border-stone-200 rounded flex items-center justify-center shadow-xs">
      <span className="font-sans font-bold text-[10px] text-[#5F6368] tracking-tight flex items-center gap-0.5">
        <span className="text-[#4285F4] font-black">G</span>Pay
      </span>
    </div>
  )
}

function UpiBadge() {
  return (
    <div className="h-6 px-2 py-0.5 bg-white border border-stone-200 rounded flex items-center justify-center shadow-xs">
      <div className="flex items-center gap-1">
        <div className="w-2 h-2.5 bg-gradient-to-tr from-[#097939] to-[#EF7E24] transform skew-x-[-12deg]" />
        <span className="font-sans font-black text-[9px] text-[#1E1E1E] tracking-tight">UPI</span>
      </div>
    </div>
  )
}

export function Footer({ data }: { data?: any } = {}) {
  const router = useRouter()
  const { openCart } = useCartStore()
  const { user, openAuthModal } = useAuth()
  const storeSettings = useStoreSettings()

  const phone = storeSettings?.contact?.phone || '+91 97124 60509'
  const email = storeSettings?.contact?.email || 'lovixacosmetic@gmail.com'
  const address = storeSettings?.contact?.address || 'Yogi Chowk Rd, Jai Bhawani Society, Punagam, Varachha, Surat, Gujarat 395011'

  // Mobile Accordion States
  const [linksOpen, setLinksOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  const topCategories = [
    { name: 'Everyday Hair Care', href: '/products?category=hair-care' },
    { name: 'Refreshing Shampoos', href: '/products?category=shampoo' },
    { name: 'Nourishing Hair Oils', href: '/products?category=hair-oil' },
    { name: 'Hair Care Ritual Combos', href: '/products?category=bundles' },
    { name: 'Hair Fall & Breakage', href: '/products?concern=hair-fall' },
    { name: 'Dandruff & Scalp Flakes', href: '/products?concern=dandruff' },
    { name: 'Dry & Frizzy Hair', href: '/products?concern=frizzy' },
    { name: 'Damaged & Split Ends', href: '/products?concern=split-ends' },
    { name: 'All Botanical Essentials', href: '/products' },
  ]

  const usefulLinks = [
    { name: 'Our Story', href: '/about' },
    { name: 'Return & Refund Policy', href: '/return-refund-policy' },
    { name: 'Terms & Conditions', href: '/terms-conditions' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Shipping Policy', href: '/shipping-policy' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQs & Guidance', href: '/faq' },
  ]

  const handleAccountClick = (action: 'account' | 'orders' | 'addresses') => {
    if (!user) {
      openAuthModal('login')
    } else {
      router.push(`/account?tab=${action}`)
    }
  }

  return (
    <footer id="footer" className="bg-[#2B1822] text-[#FBF6F8] border-t border-[#3D2633] select-none">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">

        {/* ========================================================== */}
        {/* DESKTOP 5-COLUMN GRID (Hidden on mobile < md)               */}
        {/* ========================================================== */}
        <div className="hidden md:grid md:grid-cols-12 gap-8 lg:gap-10 pb-12">

          {/* Column 1: Brand Logo & Tagline (3.2 cols) */}
          <div className="col-span-3 space-y-4">
            <Link href="/" prefetch={true} scroll={true} className="inline-block" aria-label="LOVIXA COSMETIC - Home">
              <div className="flex flex-col">
                <div className="relative h-8 sm:h-9 w-32 sm:w-36 transition-transform ">
                  <Image
                    src="/images/lovixa-logo-white.webp"
                    alt="LOVIXA COSMETIC"
                    fill
                    className="object-contain object-left"
                    sizes="144px"
                  />
                </div>
              </div>
            </Link>

            <p className="text-[13px] font-bold text-[#FBF6F8]/80 leading-snug max-w-[210px] pt-1 font-sans">
              Get exclusive offers and updates from Lovixa
            </p>

            <div className="pt-2 space-y-1.5 text-xs text-[#FBF6F8]/75 font-sans leading-relaxed">
              <p className="text-[11px] leading-snug">
                {address}
              </p>
              <p className="pt-0.5">
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-[#E8C4D4] transition-colors font-medium">
                  {phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${email}`} className="hover:text-[#E8C4D4] transition-colors">
                  {email}
                </a>
              </p>
            </div>
          </div>

          {/* Column 2: Useful Links (2.2 cols) */}
          <div className="col-span-2 space-y-3.5">
            <h4 className="font-sans font-bold text-sm text-[#FBF6F8] tracking-tight">
              Useful Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#FBF6F8]/80 font-sans">
              {usefulLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    prefetch={true}
                    scroll={true}
                    className="hover:text-[#E8C4D4] transition-colors block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Top Categories (2 cols) */}
          <div className="col-span-2 space-y-3.5">
            <h4 className="font-sans font-bold text-sm text-[#FBF6F8] tracking-tight">
              Top Categories
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-[#FBF6F8]/80 font-sans">
              {topCategories.map((cat) => (
                <li key={cat.name}>
                  <Link
                    href={cat.href}
                    prefetch={true}
                    scroll={true}
                    className="hover:text-[#E8C4D4] transition-colors block"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: My Account (2 cols) */}
          <div className="col-span-2 space-y-3.5">
            <h4 className="font-sans font-bold text-sm text-[#FBF6F8] tracking-tight">
              My Account
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#FBF6F8]/80 font-sans">
              <li>
                <button
                  type="button"
                  onClick={() => handleAccountClick('account')}
                  className="hover:text-[#E8C4D4] transition-colors block text-left cursor-pointer"
                >
                  Account
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleAccountClick('orders')}
                  className="hover:text-[#E8C4D4] transition-colors block text-left cursor-pointer"
                >
                  Orders
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleAccountClick('addresses')}
                  className="hover:text-[#E8C4D4] transition-colors block text-left cursor-pointer"
                >
                  Addresses
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openCart}
                  className="hover:text-[#E8C4D4] transition-colors block text-left cursor-pointer"
                >
                  My Cart
                </button>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  prefetch={true}
                  scroll={true}
                  className="hover:text-[#E8C4D4] transition-colors block text-left cursor-pointer"
                >
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Follow Our Beauty Journey & Trust Badges (3 cols) */}
          <div className="col-span-3 space-y-4">
            <h4 className="font-sans font-bold text-sm text-[#FBF6F8] tracking-tight">
              Follow Our Beauty Journey
            </h4>

            {/* Social Icons */}
            <div className="flex items-center gap-4 text-[#FBF6F8]">
              <a
                href="https://www.facebook.com/p/Lovixa-Harbel-Care-61574511437687/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-[#E8C4D4] transition-colors"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/lovixa_cosmetic"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-[#E8C4D4] transition-colors"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
            </div>

            {/* Divider line */}
            <div className="w-full h-px bg-[#3D2633] my-4" />

            {/* 3 Trust Badges in a single row */}
            <div className="grid grid-cols-3 gap-2.5 items-start pt-1">
              <div className="flex flex-col items-center text-center">
                <FreeShippingIcon className="w-6 h-6 sm:w-7 sm:h-7 text-[#E8C4D4] mb-1.5 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-bold text-[#FBF6F8] leading-tight">
                  Free Shipping
                </span>
              </div>
              <div className="flex flex-col items-center text-center">
                <EasyReturnIcon className="w-6 h-6 sm:w-7 sm:h-7 text-[#E8C4D4] mb-1.5 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-bold text-[#FBF6F8] leading-tight">
                  Easy Return
                </span>
              </div>
              <div className="flex flex-col items-center text-center">
                <WhatsAppVerifiedIcon className="w-6 h-6 sm:w-7 sm:h-7 text-[#E8C4D4] mb-1.5 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-bold text-[#FBF6F8] leading-tight">
                  WhatsApp Verified
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================== */}
        {/* MOBILE VIEW (Screens < md) - ACCORDION & CLEAN STACK       */}
        {/* ========================================================== */}
        <div className="md:hidden space-y-6 pb-8">

          {/* Logo & Headline */}
          <div className="space-y-3 pt-2">
            <Link href="/" className="inline-block group" aria-label="LOVIXA COSMETIC - Home">
              <div className="flex flex-col">
                <div className="relative h-7 w-28 transition-transform group-hover:scale-[1.02]">
                  <Image
                    src="/images/lovixa-logo-white.webp"
                    alt="LOVIXA COSMETIC"
                    fill
                    className="object-contain object-left"
                    sizes="112px"
                  />
                </div>
              </div>
            </Link>

            <p className="text-xs font-bold text-[#FBF6F8]/80 font-sans">
              Get exclusive offers and updates from Lovixa
            </p>

            <div className="pt-1 space-y-1 text-xs text-[#FBF6F8]/70 font-sans">
              <p className="text-[11px] leading-snug">
                {address}
              </p>
              <p>
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-[#E8C4D4] transition-colors font-medium">
                  {phone}
                </a>
                {' • '}
                <a href={`mailto:${email}`} className="hover:text-[#E8C4D4] transition-colors">
                  {email}
                </a>
              </p>
            </div>
          </div>

          {/* Accordion 1: Useful Links */}
          <div className="border-t border-[#3D2633] pt-3">
            <button
              type="button"
              onClick={() => setLinksOpen(!linksOpen)}
              className="w-full flex items-center justify-between py-2 text-sm font-bold text-[#FBF6F8] font-sans cursor-pointer"
            >
              <span>Useful Links</span>
              <ChevronDown className={`w-4 h-4 text-[#E8C4D4] transition-transform duration-200 ${linksOpen ? 'rotate-180' : ''}`} />
            </button>
            {linksOpen && (
              <ul className="py-2 space-y-2 text-xs text-[#FBF6F8]/80 font-sans pl-1">
                {usefulLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      prefetch={true}
                      scroll={true}
                      className="hover:text-[#E8C4D4] transition-colors block py-1"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Accordion 2: Top Categories */}
          <div className="border-t border-[#3D2633] pt-3">
            <button
              type="button"
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="w-full flex items-center justify-between py-2 text-sm font-bold text-[#FBF6F8] font-sans cursor-pointer"
            >
              <span>Top Categories</span>
              <ChevronDown className={`w-4 h-4 text-[#E8C4D4] transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
            </button>
            {categoriesOpen && (
              <ul className="py-2 space-y-2 text-xs text-[#FBF6F8]/80 font-sans pl-1">
                {topCategories.map((cat) => (
                  <li key={cat.name}>
                    <Link
                      href={cat.href}
                      prefetch={true}
                      scroll={true}
                      className="hover:text-[#E8C4D4] transition-colors block py-1"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Accordion 3: My Account */}
          <div className="border-t border-[#3D2633] pt-3">
            <button
              type="button"
              onClick={() => setAccountOpen(!accountOpen)}
              className="w-full flex items-center justify-between py-2 text-sm font-bold text-[#FBF6F8] font-sans cursor-pointer"
            >
              <span>My Account</span>
              <ChevronDown className={`w-4 h-4 text-[#E8C4D4] transition-transform duration-200 ${accountOpen ? 'rotate-180' : ''}`} />
            </button>
            {accountOpen && (
              <ul className="py-2 space-y-2 text-xs text-[#FBF6F8]/80 font-sans pl-1">
                <li>
                  <button
                    type="button"
                    onClick={() => handleAccountClick('account')}
                    className="hover:text-[#E8C4D4] transition-colors block py-1 text-left w-full cursor-pointer"
                  >
                    Account
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleAccountClick('orders')}
                    className="hover:text-[#E8C4D4] transition-colors block py-1 text-left w-full cursor-pointer"
                  >
                    Orders
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleAccountClick('addresses')}
                    className="hover:text-[#E8C4D4] transition-colors block py-1 text-left w-full cursor-pointer"
                  >
                    Addresses
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={openCart}
                    className="hover:text-[#E8C4D4] transition-colors block py-1 text-left w-full cursor-pointer"
                  >
                    My Cart
                  </button>
                </li>
                <li>
                  <Link
                    href="/wishlist"
                    prefetch={true}
                    scroll={true}
                    className="hover:text-[#E8C4D4] transition-colors block py-1 text-left w-full cursor-pointer"
                  >
                    Wishlist
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Socials & Trust Pillars */}
          <div className="border-t border-[#3D2633] pt-5 space-y-5 text-center">
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#FBF6F8]">
              Follow Our Beauty Journey
            </h4>

            <div className="flex items-center justify-center gap-5 text-[#FBF6F8]">
              <a href="https://www.facebook.com/p/Lovixa-Harbel-Care-61574511437687/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FacebookIcon className="w-5 h-5 hover:text-[#E8C4D4] transition-colors" />
              </a>
              <a href="https://www.instagram.com/lovixa_cosmetic" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <InstagramIcon className="w-5 h-5 hover:text-[#E8C4D4] transition-colors" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <YouTubeIcon className="w-5 h-5 hover:text-[#E8C4D4] transition-colors" />
              </a>
            </div>

            {/* 3 Trust Badges in a single row */}
            <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto pt-2 items-start">
              <div className="flex flex-col items-center text-center">
                <FreeShippingIcon className="w-6 h-6 sm:w-7 sm:h-7 text-[#E8C4D4] mb-1.5 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-bold text-[#FBF6F8] leading-tight">
                  Free Shipping
                </span>
              </div>
              <div className="flex flex-col items-center text-center">
                <EasyReturnIcon className="w-6 h-6 sm:w-7 sm:h-7 text-[#E8C4D4] mb-1.5 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-bold text-[#FBF6F8] leading-tight">
                  Easy Return
                </span>
              </div>
              <div className="flex flex-col items-center text-center">
                <WhatsAppVerifiedIcon className="w-6 h-6 sm:w-7 sm:h-7 text-[#E8C4D4] mb-1.5 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-bold text-[#FBF6F8] leading-tight">
                  WhatsApp Verified
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================== */}
        {/* BOTTOM COPYRIGHT BAR & PAYMENT ICONS STRIP                 */}
        {/* ========================================================== */}
        <div className="border-t border-[#3D2633] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#FBF6F8]/70">
          <p className="text-[11px] sm:text-xs text-center sm:text-left text-[#FBF6F8]/70">
            &copy; 2026 Lovixa Cosmetics. All rights reserved.
          </p>

          {/* Authentic Payment Badges for UPI & Bank Transfer */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 opacity-90">
            <UpiBadge />
            <GPayBadge />
            <PhonePeBadge />
            <PaytmBadge />
            <RuPayBadge />
            <BankTransferBadge />
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer

