'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, Phone, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react'

function RegisterContent() {
  const { user, register } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/account'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      router.push(redirectUrl)
    }
  }, [user, redirectUrl, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const res = await register(email, password, name, phone)
      if (res.success) {
        router.push(redirectUrl)
      } else {
        setError(res.error || 'Failed to create account')
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 sm:py-16 bg-[#FBF6F8]">
      <div className="w-full max-w-md bg-white border border-[#E8C4D4]/60 rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#2B1822] px-6 sm:px-8 pt-8 pb-7 text-white text-center border-b border-[#2B1822]">
          <div className="w-10 h-10 rounded-full bg-[#6B2D5C] text-white flex items-center justify-center font-serif font-bold text-sm mx-auto mb-2.5 shadow-sm border border-[#E8C4D4]/40">
            L
          </div>
          <span className="text-[10px] font-bold tracking-[0.24em] uppercase text-[#E8C4D4] block font-sans mb-1">
            LOVIXA COSMETIC
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
            Create Account
          </h1>
          <p className="text-xs text-[#FBF6F8]/80 mt-1 font-sans">
            Track orders, save rituals &amp; enjoy member perks
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold leading-relaxed font-sans animate-in fade-in">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#2B1822] mb-1.5 font-sans uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Priya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 bg-[#FBF6F8]/50 text-[#2B1822] text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#6B2D5C]/20 focus:border-[#6B2D5C] transition font-sans placeholder:text-stone-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B1822] mb-1.5 font-sans uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 bg-[#FBF6F8]/50 text-[#2B1822] text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#6B2D5C]/20 focus:border-[#6B2D5C] transition font-sans placeholder:text-stone-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B1822] mb-1.5 font-sans uppercase tracking-wider">
              Phone Number <span className="text-stone-400 font-normal normal-case">(For order updates)</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 bg-[#FBF6F8]/50 text-[#2B1822] text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#6B2D5C]/20 focus:border-[#6B2D5C] transition font-sans placeholder:text-stone-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B1822] mb-1.5 font-sans uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-3 rounded-xl border border-stone-300 bg-[#FBF6F8]/50 text-[#2B1822] text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#6B2D5C]/20 focus:border-[#6B2D5C] transition font-sans placeholder:text-stone-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition cursor-pointer p-1 rounded-md"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 px-4 bg-[#6B2D5C] hover:bg-[#562349] text-white font-bold text-xs sm:text-sm tracking-wider uppercase rounded-full transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer font-sans"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-xs text-stone-500 pt-2 font-sans">
            Already have an account?{' '}
            <Link
              href={`/login${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
              className="font-bold text-[#6B2D5C] underline hover:text-[#562349]"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-[75vh] flex items-center justify-center text-xs text-stone-500 font-sans">Loading registration...</div>}>
      <RegisterContent />
    </Suspense>
  )
}
