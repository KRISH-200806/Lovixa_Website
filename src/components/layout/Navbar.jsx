'use client'

import React, { useState } from 'react'
import { Container, SafeImage } from '@/components/ui'
import { useCart } from '@/context/CartContext'
import AnnouncementBar from '@/components/layout/AnnouncementBar'

export default function Navbar({ data }) {
  const siteName = data?.siteName && data.siteName !== 'Your Site Name' ? data.siteName : 'LOVIXA'
  const logo = data?.logo
  const { totalCount, openCart } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Shop All', href: '#shop-products' },
    { label: 'Lip Colors', href: '#shop-products' },
    { label: 'Skincare', href: '#shop-products' },
    { label: 'Sun Protection', href: '#shop-products' },
    { label: 'By Concern', href: '#categories' },
  ]

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-brand-200 transition-all">
      <AnnouncementBar />

      <Container className="flex items-center justify-between py-4">
        {/* Mobile menu trigger */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-foreground hover:bg-brand-50 rounded-radius-md"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Brand Logo */}
        <a href="/" className="flex items-center gap-2 font-serif text-h4 font-bold tracking-widest text-foreground">
          {logo ? (
            <SafeImage media={logo} alt={siteName} width={140} height={32} className="h-8 w-auto" />
          ) : (
            <>
              <span className="text-brand-500 text-2xl leading-none">✦</span>
              <span className="tracking-[0.25em] font-bold uppercase font-serif bg-gradient-to-r from-brand-900 via-brand-700 to-brand-500 bg-clip-text text-transparent">
                {siteName}
              </span>
            </>
          )}
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-sans text-body-sm font-semibold text-foreground/80 hover:text-brand-500 transition-colors tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions: Search & Cart */}
        <div className="flex items-center gap-3">
          <a
            href="#shop-products"
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-radius-pill bg-brand-50 hover:bg-brand-100 border border-brand-200 text-neutral-500 text-body-xs transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search Beauty...</span>
          </a>

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={openCart}
            className="relative p-2.5 rounded-radius-pill bg-brand-50 hover:bg-brand-100 border border-brand-200 text-foreground transition-all hover:border-brand-500 flex items-center justify-center shadow-elev-1"
            aria-label="Open Cart Drawer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>

            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 text-neutral-0 text-[11px] font-bold rounded-full flex items-center justify-center shadow-elev-1 animate-pulse">
                {totalCount}
              </span>
            )}
          </button>
        </div>
      </Container>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-brand-200 bg-background px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-body-sm font-semibold text-foreground hover:text-brand-500 border-b border-brand-100"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2">
            <a
              href="#shop-products"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full block text-center py-2.5 rounded-radius-pill bg-brand-500 text-neutral-0 text-body-xs font-semibold"
            >
              Shop All Best Sellers
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
