'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useAuth } from '@/components/providers/AuthProvider'
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound,
  RotateCw,
  ShieldCheck,
} from 'lucide-react'

type ModalView =
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'verify-otp'
  | 'set-password'
  | 'reset-success'

export function AuthModal() {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    login,
    register,
    forgotPasswordSendOtp,
    forgotPasswordVerifyOtp,
    forgotPasswordReset,
  } = useAuth()

  const [view, setView] = useState<ModalView>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  // OTP & Reset state
  const [otp, setOtp] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Show/Hide password toggles
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Status & loading
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)

  // Resend cooldown timer
  const [resendCooldown, setResendCooldown] = useState(0)
  const cooldownRef = useRef<NodeJS.Timeout | null>(null)

  // Sync mode whenever opened or changed
  useEffect(() => {
    if (!isAuthModalOpen) return

    if (authModalMode === 'register') {
      setView('register')
    } else if (authModalMode === 'forgot-password') {
      setView('forgot-password')
    } else {
      setView('login')
    }

    setError('')
    setSuccessMsg('')
    setShowPassword(false)
    setShowNewPassword(false)
    setShowConfirmPassword(false)
    setOtp('')
    setResetToken('')
    setNewPassword('')
    setConfirmPassword('')
  }, [authModalMode, isAuthModalOpen])

  // Cooldown timer ticker
  useEffect(() => {
    if (resendCooldown > 0) {
      cooldownRef.current = setTimeout(() => {
        setResendCooldown((prev) => prev - 1)
      }, 1000)
    }
    return () => {
      if (cooldownRef.current) clearTimeout(cooldownRef.current)
    }
  }, [resendCooldown])

  // Background Scroll Lock
  useEffect(() => {
    if (!isAuthModalOpen) return

    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
    const prevBodyOverflow = document.body.style.overflow
    const prevHtmlOverflow = document.documentElement.style.overflow
    const prevBodyPaddingRight = document.body.style.paddingRight

    document.documentElement.classList.add('modal-open')
    document.body.classList.add('modal-open')
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAuthModal()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.documentElement.classList.remove('modal-open')
      document.body.classList.remove('modal-open')
      document.documentElement.style.overflow = prevHtmlOverflow
      document.body.style.overflow = prevBodyOverflow
      document.body.style.paddingRight = prevBodyPaddingRight
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isAuthModalOpen, closeAuthModal])

  if (!isAuthModalOpen) return null

  // 1. Handle Login & Register submission
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setIsSubmitting(true)

    try {
      if (view === 'login') {
        const res = await login(email, password)
        if (!res.success) {
          setError(res.error || 'Invalid email or password.')
        } else {
          closeAuthModal()
        }
      } else if (view === 'register') {
        const res = await register(email, password, name, phone)
        if (!res.success) {
          setError(res.error || 'Failed to create account. Please try again.')
        } else {
          closeAuthModal()
        }
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 2. Step 1: Send OTP to email
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }

    setError('')
    setSuccessMsg('')
    setIsSubmitting(true)

    try {
      const res = await forgotPasswordSendOtp(email)
      if (res.success) {
        setView('verify-otp')
        setResendCooldown(30)
        setSuccessMsg(res.message || `Verification code sent to ${email}`)
      } else {
        setError(res.error || 'Failed to send verification code.')
      }
    } catch (err: any) {
      setError(err?.message || 'Error sending verification code.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 3. Resend OTP handler
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isResending) return
    setError('')
    setSuccessMsg('')
    setIsResending(true)

    try {
      const res = await forgotPasswordSendOtp(email)
      if (res.success) {
        setResendCooldown(30)
        setOtp('')
        setSuccessMsg(`A fresh 6-digit code has been sent to ${email}`)
      } else {
        setError(res.error || 'Failed to resend code.')
      }
    } catch (err: any) {
      setError(err?.message || 'Network error while resending code.')
    } finally {
      setIsResending(false)
    }
  }

  // 4. Step 2: Verify OTP Only (does NOT ask for password yet)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    if (!otp || otp.trim().length !== 6) {
      setError('Please enter the complete 6-digit verification code.')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await forgotPasswordVerifyOtp(email, otp)
      if (res.success && res.resetToken) {
        setResetToken(res.resetToken)
        setView('set-password')
        setError('')
        setSuccessMsg('OTP verified successfully! Now please create your new password.')
      } else {
        setError(res.error || 'Invalid verification code. Please check your email.')
      }
    } catch (err: any) {
      setError(err?.message || 'Error verifying code.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 5. Step 3: Set New Password Only (after OTP is verified)
  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await forgotPasswordReset(email, resetToken, newPassword)
      if (res.success) {
        setView('reset-success')
        setTimeout(() => {
          closeAuthModal()
        }, 2500)
      } else {
        setError(res.error || 'Failed to update password. Please try again.')
      }
    } catch (err: any) {
      setError(err?.message || 'Error setting new password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={closeAuthModal}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
    >
      <div
        id="lovixa-auth-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[400px] bg-white border border-stone-100 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col my-auto"
      >
        {/* Top Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-[#2B1822] hover:bg-stone-100 rounded-full transition-all duration-150 cursor-pointer z-10"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Clean Luxury Header */}
        <div className="pt-8 pb-5 px-6 text-center border-b border-stone-100 bg-[#FCF9FA]">
          <div className="flex justify-center mb-2">
            <Image
              src="/images/lovixa-logo.png"
              alt="LOVIXA COSMETIC"
              width={130}
              height={38}
              priority
              className="h-7 w-auto object-contain"
            />
          </div>

          <h3 className="text-xl font-serif font-bold tracking-tight text-[#2B1822] mt-1">
            {view === 'login' && 'Sign In'}
            {view === 'register' && 'Create Account'}
            {view === 'forgot-password' && 'Forgot Password'}
            {view === 'verify-otp' && 'Verify OTP Code'}
            {view === 'set-password' && 'Create New Password'}
            {view === 'reset-success' && 'Password Updated'}
          </h3>

          <p className="text-xs text-stone-500 mt-1 font-sans">
            {view === 'login' && 'Welcome back to LOVIXA'}
            {view === 'register' && 'Join LOVIXA for seamless shopping'}
            {view === 'forgot-password' && 'Enter your email to receive an OTP code'}
            {view === 'verify-otp' && `Enter the 6-digit code sent to ${email}`}
            {view === 'set-password' && 'Choose a strong password with at least 6 characters'}
            {view === 'reset-success' && 'Your account has been secured'}
          </p>
        </div>

        {/* Tab Switcher (Only visible for Login / Register) */}
        {(view === 'login' || view === 'register') && (
          <div className="px-6 pt-4 pb-1">
            <div className="flex bg-stone-100/80 p-1 rounded-full">
              <button
                type="button"
                onClick={() => {
                  setView('login')
                  setError('')
                  setSuccessMsg('')
                }}
                className={`flex-1 py-2 text-xs font-bold font-sans tracking-wider uppercase rounded-full transition-all duration-200 cursor-pointer ${
                  view === 'login'
                    ? 'bg-white text-[#6B2D5C] shadow-sm'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => {
                  setView('register')
                  setError('')
                  setSuccessMsg('')
                }}
                className={`flex-1 py-2 text-xs font-bold font-sans tracking-wider uppercase rounded-full transition-all duration-200 cursor-pointer ${
                  view === 'register'
                    ? 'bg-white text-[#6B2D5C] shadow-sm'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* Modal Form Body */}
        <div className="p-6">
          {/* Error Message Alert */}
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium leading-relaxed font-sans animate-in fade-in">
              {error}
            </div>
          )}

          {/* Success Message Alert */}
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-medium leading-relaxed font-sans flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. VIEW: LOGIN & REGISTER */}
          {(view === 'login' || view === 'register') && (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {/* Full Name (Register Only) */}
              {view === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-[#2B1822] mb-1.5 font-sans">
                    Full Name <span className="text-[#6B2D5C]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/40 text-[#2B1822] text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#6B2D5C]/15 focus:border-[#6B2D5C] transition font-sans placeholder:text-stone-400"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-[#2B1822] mb-1.5 font-sans">
                  Email Address <span className="text-[#6B2D5C]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/40 text-[#2B1822] text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#6B2D5C]/15 focus:border-[#6B2D5C] transition font-sans placeholder:text-stone-400"
                  />
                </div>
              </div>

              {/* Phone (Register Only) */}
              {view === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-[#2B1822] mb-1.5 font-sans">
                    Phone Number <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/40 text-[#2B1822] text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#6B2D5C]/15 focus:border-[#6B2D5C] transition font-sans placeholder:text-stone-400"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#2B1822] font-sans">
                    Password <span className="text-[#6B2D5C]">*</span>
                  </label>
                  {view === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setView('forgot-password')
                        setError('')
                        setSuccessMsg('')
                      }}
                      className="text-xs text-[#6B2D5C] hover:text-[#562349] font-medium font-sans cursor-pointer hover:underline"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 bg-stone-50/40 text-[#2B1822] text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#6B2D5C]/15 focus:border-[#6B2D5C] transition font-sans placeholder:text-stone-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition cursor-pointer p-0.5"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Pill Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-6 bg-[#6B2D5C] hover:bg-[#562349] text-white font-sans text-xs font-bold tracking-wider uppercase rounded-full transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg shadow-[#6B2D5C]/20 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{view === 'login' ? 'Signing In...' : 'Creating Account...'}</span>
                  </>
                ) : (
                  <>
                    <span>{view === 'login' ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Bottom Switch Link */}
              <div className="text-center pt-2">
                {view === 'login' ? (
                  <p className="text-xs text-stone-500 font-sans">
                    Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setView('register')
                        setError('')
                        setSuccessMsg('')
                      }}
                      className="text-[#6B2D5C] font-semibold hover:underline cursor-pointer ml-0.5"
                    >
                      Create one
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-stone-500 font-sans">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setView('login')
                        setError('')
                        setSuccessMsg('')
                      }}
                      className="text-[#6B2D5C] font-semibold hover:underline cursor-pointer ml-0.5"
                    >
                      Sign In
                    </button>
                  </p>
                )}
              </div>
            </form>
          )}

          {/* 2. VIEW: FORGOT PASSWORD (STEP 1 - ENTER EMAIL) */}
          {view === 'forgot-password' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2B1822] mb-1.5 font-sans">
                  Your Account Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/40 text-[#2B1822] text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#6B2D5C]/15 focus:border-[#6B2D5C] transition font-sans placeholder:text-stone-400"
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1.5 font-sans">
                  We will send a 6-digit OTP verification code to this email.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 bg-[#6B2D5C] hover:bg-[#562349] text-white font-sans text-xs font-bold tracking-wider uppercase rounded-full transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg shadow-[#6B2D5C]/20 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setView('login')
                    setError('')
                    setSuccessMsg('')
                  }}
                  className="text-xs text-stone-500 hover:text-[#2B1822] font-sans inline-flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* 3. VIEW: VERIFY OTP ONLY (STEP 2 - ENTER OTP ONLY, NO PASSWORD YET) */}
          {view === 'verify-otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {/* Target Email Banner */}
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                <span className="text-stone-600 truncate font-sans">
                  Code sent to: <strong className="text-[#2B1822]">{email}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setView('forgot-password')
                    setError('')
                    setSuccessMsg('')
                  }}
                  className="text-[#6B2D5C] font-semibold hover:underline cursor-pointer ml-2 shrink-0 font-sans"
                >
                  Change
                </button>
              </div>

              {/* 6-Digit OTP Input */}
              <div>
                <label className="block text-xs font-bold text-[#2B1822] mb-1.5 font-sans">
                  Enter 6-Digit Code
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    required
                    autoFocus
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '')
                      setOtp(val)
                    }}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50/40 text-[#2B1822] text-xl font-mono font-bold tracking-[8px] text-center focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#6B2D5C]/15 focus:border-[#6B2D5C] transition placeholder:text-stone-300 placeholder:tracking-normal"
                  />
                </div>
              </div>

              {/* Verify OTP Button */}
              <button
                type="submit"
                disabled={isSubmitting || otp.length !== 6}
                className="w-full py-3 px-6 bg-[#6B2D5C] hover:bg-[#562349] text-white font-sans text-xs font-bold tracking-wider uppercase rounded-full transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg shadow-[#6B2D5C]/20 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Resend Code & Back Controls */}
              <div className="flex items-center justify-between pt-2 text-xs font-sans">
                <button
                  type="button"
                  onClick={() => {
                    setView('login')
                    setError('')
                    setSuccessMsg('')
                  }}
                  className="text-stone-500 hover:text-[#2B1822] inline-flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </button>

                <button
                  type="button"
                  disabled={resendCooldown > 0 || isResending}
                  onClick={handleResendOtp}
                  className="text-[#6B2D5C] font-semibold hover:underline disabled:text-stone-400 disabled:no-underline cursor-pointer inline-flex items-center gap-1"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                  {isResending
                    ? 'Sending...'
                    : resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : 'Resend code'}
                </button>
              </div>
            </form>
          )}

          {/* 4. VIEW: SET NEW PASSWORD ONLY (STEP 3 - ONLY AFTER OTP IS VERIFIED) */}
          {view === 'set-password' && (
            <form onSubmit={handleSetPassword} className="space-y-4">
              <div className="p-3 bg-[#FCF9FA] rounded-xl border border-stone-200/80 text-xs text-stone-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Code verified! Please choose your new password.</span>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-[#2B1822] mb-1.5 font-sans">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 bg-stone-50/40 text-[#2B1822] text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#6B2D5C]/15 focus:border-[#6B2D5C] transition font-sans placeholder:text-stone-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition cursor-pointer p-0.5"
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-[#2B1822] mb-1.5 font-sans">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Re-enter your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border bg-stone-50/40 text-[#2B1822] text-sm focus:outline-none focus:bg-white focus:ring-2 transition font-sans placeholder:text-stone-400 ${
                      confirmPassword && newPassword !== confirmPassword
                        ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-400'
                        : 'border-stone-200 focus:ring-[#6B2D5C]/15 focus:border-[#6B2D5C]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition cursor-pointer p-0.5"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-[11px] text-rose-500 mt-1 font-sans">
                    Passwords do not match.
                  </p>
                )}
              </div>

              {/* Save Password Button */}
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  newPassword.length < 6 ||
                  newPassword !== confirmPassword
                }
                className="w-full py-3 px-6 bg-[#6B2D5C] hover:bg-[#562349] text-white font-sans text-xs font-bold tracking-wider uppercase rounded-full transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg shadow-[#6B2D5C]/20 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Password...</span>
                  </>
                ) : (
                  <>
                    <span>Save Password &amp; Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setView('login')
                    setError('')
                    setSuccessMsg('')
                  }}
                  className="text-xs text-stone-500 hover:text-[#2B1822] font-sans inline-flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Cancel &amp; Return to Sign In
                </button>
              </div>
            </form>
          )}

          {/* 5. VIEW: RESET SUCCESS (STEP 4) */}
          {view === 'reset-success' && (
            <div className="text-center py-4 space-y-3 animate-in zoom-in-95">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-serif font-bold text-[#2B1822]">
                Password Updated!
              </h4>
              <p className="text-xs text-stone-600 max-w-xs mx-auto font-sans leading-relaxed">
                Your password has been reset successfully and you are now securely signed in to LOVIXA.
              </p>
              <button
                type="button"
                onClick={closeAuthModal}
                className="mt-3 w-full py-2.5 px-6 bg-[#6B2D5C] hover:bg-[#562349] text-white font-sans text-xs font-bold tracking-wider uppercase rounded-full transition cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
