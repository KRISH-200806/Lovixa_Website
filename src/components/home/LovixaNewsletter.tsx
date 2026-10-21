'use client'

import { useState } from 'react'
import { ArrowRight, Check, Loader2, Mail } from 'lucide-react'

export function LovixaNewsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setStatus('error')
      setFeedbackMessage('Please enter a valid email address.')
      return
    }

    setStatus('loading')
    setFeedbackMessage('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setStatus('success')
        setFeedbackMessage(data.message || 'Thank you for joining the LOVIXA community!')
        setEmail('')
      } else {
        setStatus('error')
        setFeedbackMessage(data.error || 'Unable to subscribe. Please try again.')
      }
    } catch {
      setStatus('error')
      setFeedbackMessage('Something went wrong. Please try again later.')
    }
  }

  return (
    <section aria-labelledby="newsletter-heading" className="py-16 sm:py-24 bg-[#FBF6F8] relative border-b border-[#E8C4D4]/50 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white rounded-3xl border border-[#E8C4D4]/70 p-8 sm:p-12 lg:p-16 text-center shadow-xs space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8C4D4]/25 border border-[#E8C4D4]/70">
            <Mail className="w-3.5 h-3.5 text-[#6B2D5C]" />
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] text-[#6B2D5C] uppercase font-sans">
              Stay in Touch
            </span>
          </div>

          <h2
            id="newsletter-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-[#2B1822] tracking-tight"
          >
            A Little Beauty in Your Inbox
          </h2>

          <p className="text-xs sm:text-sm text-[#2B1822]/70 leading-relaxed font-sans max-w-lg mx-auto">
            Receive thoughtful beauty rituals, new product announcements, and a 15% welcome voucher code for your first ritual order.
          </p>

          {/* Form */}
          {status === 'success' ? (
            <div className="max-w-md mx-auto p-4 rounded-xl bg-[#E8C4D4]/25 border border-[#6B2D5C]/30 text-[#6B2D5C] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-[#6B2D5C] shrink-0" />
              <span>{feedbackMessage}</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto space-y-3">
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-5 pr-32 py-3 rounded-full bg-[#FBF6F8] border border-[#E8C4D4]/70 text-xs sm:text-sm text-[#2B1822] placeholder:text-[#2B1822]/40 focus:outline-none focus:bg-white focus:border-[#6B2D5C] focus:ring-1 focus:ring-[#6B2D5C] transition-all font-sans"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="absolute right-1 px-5 py-2 rounded-full bg-[#6B2D5C] hover:bg-[#562349] text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <span>Join</span>
                      <ArrowRight className="w-3 h-3 text-[#E8C4D4]" />
                    </>
                  )}
                </button>
              </div>

              {status === 'error' && (
                <p className="text-xs text-rose-600 font-medium font-sans">{feedbackMessage}</p>
              )}
            </form>
          )}

          {/* Privacy messaging */}
          <p className="text-[11px] text-[#2B1822]/60 font-sans max-w-sm mx-auto">
            We value your privacy. Your information is safe and you may unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  )
}
