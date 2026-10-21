'use client'

import React, { useState } from 'react'
import { TurnstileWidget } from '@/components/security/TurnstileWidget'

export interface ContactFormProps {
  formType?: 'contact' | 'quote' | 'newsletter' | 'demo' | 'custom'
  title?: string
  subtitle?: string
  buttonText?: string
  className?: string
  showPhone?: boolean
  showSubject?: boolean
  onSuccess?: () => void
}

export function ContactForm({
  formType = 'contact',
  title,
  subtitle,
  buttonText = 'Send Message',
  className = '',
  showPhone = true,
  showSubject = false,
  onSuccess,
}: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [turnstileToken, setTurnstileToken] = useState<string>('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const sourcePage = typeof window !== 'undefined' ? window.location.pathname : '/'
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          formType,
          sourcePage,
          turnstileToken,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit form.')
      }

      setStatus('success')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      if (onSuccess) onSuccess()
    } catch (err: any) {
      setStatus('error')
      setErrorMessage(err?.message || 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className={`p-8 text-center rounded-2xl bg-surface border border-theme-border ${className}`}>
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xl font-bold">
          ✓
        </div>
        <h3 className="text-xl font-bold mb-2 text-theme-text">Message Received!</h3>
        <p className="text-theme-muted mb-6 text-sm">
          Thank you for reaching out. We will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="text-xs font-semibold uppercase tracking-wider text-brand hover:underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {title && <h3 className="text-2xl font-bold text-theme-text">{title}</h3>}
      {subtitle && <p className="text-sm text-theme-muted mb-4">{subtitle}</p>}

      {status === 'error' && (
        <div className="p-3 text-sm rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1 text-theme-text">
            Full Name <span className="text-brand">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Jane Doe"
            className="w-full px-4 py-2.5 rounded-lg border border-theme-border bg-theme-bg text-theme-text text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1 text-theme-text">
            Email Address <span className="text-brand">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="jane@example.com"
            className="w-full px-4 py-2.5 rounded-lg border border-theme-border bg-theme-bg text-theme-text text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      </div>

      {showPhone && (
        <div>
          <label className="block text-xs font-semibold mb-1 text-theme-text">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            className="w-full px-4 py-2.5 rounded-lg border border-theme-border bg-theme-bg text-theme-text text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      )}

      {showSubject && (
        <div>
          <label className="block text-xs font-semibold mb-1 text-theme-text">Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Inquiry about services"
            className="w-full px-4 py-2.5 rounded-lg border border-theme-border bg-theme-bg text-theme-text text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold mb-1 text-theme-text">
          Message <span className="text-brand">*</span>
        </label>
        <textarea
          name="message"
          required
          rows={4}
          value={formData.message}
          onChange={handleChange}
          placeholder="How can we help you?"
          className="w-full px-4 py-2.5 rounded-lg border border-theme-border bg-theme-bg text-theme-text text-sm focus:outline-none focus:ring-2 focus:ring-brand resize-y"
        />
      </div>

      <TurnstileWidget onVerify={setTurnstileToken} />

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full py-3.5 px-6 rounded-full bg-brand text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed shadow-sm"
      >
        {status === 'submitting' ? 'Sending...' : buttonText}
      </button>
    </form>
  )
}
