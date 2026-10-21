'use client'

import React, { useState } from 'react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setIsSubscribed(true)
  }

  return (
    <section className="py-20 bg-brand-50/60 border-b border-brand-200 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-1">
        <span className="font-accent italic text-brand-600 text-body-lg font-normal block">
          Join the Lovixa VIP Circle
        </span>
        <h2 className="font-heading text-h2 uppercase tracking-wide text-foreground">
          Get 15% Off Your First Beauty Order
        </h2>
        <p className="text-neutral-500 text-body-md max-w-xl mx-auto font-sans">
          Subscribe for secret cosmetic drops, early sale access, and personalized skin routine tips delivered to your inbox.
        </p>

        {isSubscribed ? (
          <div className="mt-8 p-4 rounded-radius-lg bg-brand-100 border border-brand-200 text-brand-900 text-body-md font-semibold max-w-md mx-auto">
            🎉 Welcome to Lovixa! Use coupon code <strong className="text-brand-500 underline">LOVIXA15</strong> at checkout.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="flex-1 px-5 py-3.5 rounded-full bg-background border border-brand-200 text-foreground text-body-sm placeholder:text-neutral-400 focus:outline-none focus:border-brand-500 transition-colors shadow-elev-1"
            />
            <button
              type="submit"
              className="px-8 py-3.5 rounded-full bg-brand-500 hover:bg-brand-600 text-neutral-0 font-semibold text-body-sm tracking-wide shadow-elev-2 hover:shadow-brand-glow transition-all whitespace-nowrap cursor-pointer"
            >
              Claim 15% OFF
            </button>
          </form>
        )}

        <p className="text-[11px] text-neutral-400 mt-4">
          No spam, ever. Unsubscribe with a single click at any time.
        </p>
      </div>
    </section>
  )
}
