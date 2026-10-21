'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'

export function JoinLovixaFamily() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return

    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage(data.message || 'Thank you for joining the LOVIXA community!')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  return (
    <section className="bg-gradient-to-b from-[#FBF6F8] to-[#E8C4D4]/30 py-14 sm:py-18 border-t border-[#E8C4D4]/40">
      <div className="max-w-2xl mx-auto px-4 text-center space-y-3.5">
        <h2 className="font-sans font-black text-xl sm:text-2xl tracking-wider uppercase text-[#6B2D5C]">
          JOIN THE LOVIXA FAMILY
        </h2>
        <p className="text-xs sm:text-sm text-[#2B1822]/70 font-sans max-w-lg mx-auto leading-relaxed">
          Get 10% off your first order + exclusive offers, beauty tips, and early access to new launches
        </p>

        <form onSubmit={handleSubscribe} className="pt-3 max-w-md mx-auto">
          <div className="bg-white rounded-full p-1.5 sm:p-2 shadow-sm border border-[#E8C4D4]/70 flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-5 py-2.5 text-xs sm:text-sm text-[#2B1822] placeholder:text-[#2B1822]/40 focus:outline-none font-sans bg-transparent"
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary !py-2.5 !px-7 shrink-0 disabled:opacity-70"
            >
              {status === 'loading' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>SUBSCRIBE</span>
            </button>
          </div>

          {status === 'success' && (
            <p className="text-xs text-emerald-700 font-semibold mt-3 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{message}</span>
            </p>
          )}

          {status === 'error' && (
            <p className="text-xs text-red-600 font-semibold mt-3">
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
