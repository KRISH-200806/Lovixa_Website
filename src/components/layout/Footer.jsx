import React from 'react'
import { Container } from '@/components/ui'

export default function Footer({ data }) {
  const currentYear = new Date().getFullYear()
  const copyright = data?.copyright || `© ${currentYear} LOVIXA Cosmetics. All rights reserved.`

  return (
    <footer className="border-t border-brand-900 bg-brand-900 text-brand-100">
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <a href="/" className="inline-flex items-center gap-2 font-heading text-h4 font-bold tracking-widest text-neutral-0">
              <span className="text-brand-300 text-2xl">✦</span>
              <span className="tracking-[0.2em] uppercase font-extrabold bg-gradient-to-r from-neutral-0 via-brand-100 to-brand-300 bg-clip-text text-transparent">
                LOVIXA
              </span>
            </a>
            <p className="text-body-sm text-brand-200/80 font-sans max-w-sm leading-relaxed">
              Lovixa is an Indian luxury cosmetics & clean skincare atelier crafting high-pigment, 100% vegan, cruelty-free beauty essentials.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs px-2.5 py-1 rounded-radius-pill bg-brand-800 border border-brand-700 text-brand-100">
                🌱 PETA Approved Vegan
              </span>
              <span className="text-xs px-2.5 py-1 rounded-radius-pill bg-brand-800 border border-brand-700 text-brand-100">
                🇮🇳 Made in India
              </span>
            </div>
          </div>

          {/* Shop Categories */}
          <div className="space-y-3">
            <h4 className="font-heading text-body-sm font-semibold uppercase tracking-wider text-neutral-0">
              Collections
            </h4>
            <ul className="space-y-2 text-body-sm text-brand-200/80">
              <li><a href="#shop-products" className="hover:text-brand-300 transition-colors">Lip Care & Colors</a></li>
              <li><a href="#shop-products" className="hover:text-brand-300 transition-colors">Radiance Skincare</a></li>
              <li><a href="#shop-products" className="hover:text-brand-300 transition-colors">Dewy SPF 50+</a></li>
              <li><a href="#shop-products" className="hover:text-brand-300 transition-colors">Face & Base</a></li>
              <li><a href="#shop-products" className="hover:text-brand-300 transition-colors">Gift Combos</a></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="font-heading text-body-sm font-semibold uppercase tracking-wider text-neutral-0">
              Customer Care
            </h4>
            <ul className="space-y-2 text-body-sm text-brand-200/80">
              <li><a href="/track-order" className="hover:text-brand-300 transition-colors">Track Your Order</a></li>
              <li><a href="/shipping-policy" className="hover:text-brand-300 transition-colors">Shipping & Delivery</a></li>
              <li><a href="/returns" className="hover:text-brand-300 transition-colors">Returns & Refunds</a></li>
              <li><a href="/faqs" className="hover:text-brand-300 transition-colors">Beauty FAQs</a></li>
              <li><a href="/contact" className="hover:text-brand-300 transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* About & Trust */}
          <div className="space-y-3">
            <h4 className="font-heading text-body-sm font-semibold uppercase tracking-wider text-neutral-0">
              Our Promise
            </h4>
            <ul className="space-y-2 text-body-sm text-brand-200/80">
              <li><a href="/about" className="hover:text-brand-300 transition-colors">Our Clean Philosophy</a></li>
              <li><a href="/ingredients" className="hover:text-brand-300 transition-colors">Ingredient Glossary</a></li>
              <li><a href="/terms" className="hover:text-brand-300 transition-colors">Terms of Service</a></li>
              <li><a href="/privacy" className="hover:text-brand-300 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-brand-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-body-xs text-brand-200/70">
          <p>{copyright}</p>
          <div className="flex items-center gap-6">
            <span>🔒 256-Bit SSL Encrypted Checkout</span>
            <span>•</span>
            <span>💳 UPI / Cards / COD Accepted</span>
          </div>
        </div>
      </Container>
    </footer>
  )
}
