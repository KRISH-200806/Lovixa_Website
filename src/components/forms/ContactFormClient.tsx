'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  PhoneCall,
  Mail,
  MapPin,
  CheckCircle2,
  Loader2,
  MessageCircle,
} from 'lucide-react'
import { JoinLovixaFamily } from '@/components/common/JoinLovixaFamily'
import { PageHeaderBanner } from '@/components/common/PageHeaderBanner'
import type { PageDocument } from '@/lib/cms/pages'

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

function LinkedInIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  )
}

interface ContactFormClientProps {
  page: PageDocument | null
}

export function ContactFormClient({ page }: ContactFormClientProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const info = page?.contactInfo

  const phone = info?.phone || '+91 97124 60509'
  const supportHours = info?.supportHours || 'Mon - Sat: 10:00 AM – 6:00 PM'
  const email = info?.email || 'lovixacosmetic@gmail.com'
  const emailNote = info?.emailNote || 'Dedicated support within 24 business hours'
  const address = info?.address || 'Yogi Chowk Rd, Jai Bhawani Society, Punagam, Varachha, Surat, Gujarat 395011'
  const whatsappNumber = info?.whatsappNumber || '919712460509'
  const introSubtitle = info?.introSubtitle || 'Fill the form below and one of our concierge team members will respond within 24 business hours to assist you with your routine or order inquiries.'

  const headerImg =
    (typeof page?.headerImage === 'object' && page?.headerImage?.url) ||
    page?.headerImageUrl ||
    '/images/lovixa-panoramic-hero.jpg'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.name) return

    setSubmitting(true)
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (res.ok) {
        setSubmitted(true)
      } else {
        setErrorMessage(data.error || 'Failed to submit form. Please try again.')
      }
    } catch {
      setErrorMessage('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-[#FBF6F8] min-h-screen text-[#2B1822]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <PageHeaderBanner
          breadcrumbs={[
            { label: 'Help & Support', href: '/faq' },
            { label: 'Contact Us' },
          ]}
          badge={page?.badge || 'GET IN TOUCH'}
          title={page?.title || "We're Here For You,"}
          highlightTitle={page?.highlightTitle || 'Connect with LOVIXA Concierge'}
          subtitle={
            page?.subtitle ||
            'Have questions regarding your order, formulations, or rituals? Our dedicated beauty team is ready to assist.'
          }
          imageSrc={headerImg}
          imageAlt={page?.title || 'Contact LOVIXA Support'}
          priority
        />
      </div>

      {/* SUBHEADING & 3 CONTACT INFO CARDS */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
        {/* Intro Subtitle */}
        <p className="text-sm sm:text-base text-center text-[#2B1822]/70 max-w-2xl mx-auto leading-relaxed font-sans">
          {introSubtitle}
        </p>

        {/* 3 Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Customer Care */}
          <div className="bg-white rounded-2xl border border-[#E8C4D4]/60 p-6 flex items-start gap-4 hover:shadow-sm transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#E8C4D4]/30 text-[#6B2D5C] flex items-center justify-center shrink-0 group-hover:bg-[#6B2D5C] group-hover:text-white transition-colors">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-sans font-bold text-base sm:text-lg text-[#2B1822]">
                Customer Care
              </h3>
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="text-xs sm:text-sm text-stone-600 hover:text-[#6B2D5C] transition-colors mt-1 block font-medium font-sans"
              >
                {phone}
              </a>
              <p className="text-[11px] text-stone-400 mt-0.5 font-sans">
                {supportHours}
              </p>
            </div>
          </div>

          {/* Card 2: Email */}
          <div className="bg-white rounded-2xl border border-[#E8C4D4]/60 p-6 flex items-start gap-4 hover:shadow-sm transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#E8C4D4]/30 text-[#6B2D5C] flex items-center justify-center shrink-0 group-hover:bg-[#6B2D5C] group-hover:text-white transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-sans font-bold text-base sm:text-lg text-[#2B1822]">
                Email Concierge
              </h3>
              <a
                href={`mailto:${email}`}
                className="text-xs sm:text-sm text-stone-600 hover:text-[#6B2D5C] transition-colors mt-1 block font-medium truncate font-sans"
              >
                {email}
              </a>
              <p className="text-[11px] text-stone-400 mt-0.5 font-sans">
                {emailNote}
              </p>
            </div>
          </div>

          {/* Card 3: Address */}
          <div className="bg-white rounded-2xl border border-[#E8C4D4]/60 p-6 flex items-start gap-4 hover:shadow-sm transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#E8C4D4]/30 text-[#6B2D5C] flex items-center justify-center shrink-0 group-hover:bg-[#6B2D5C] group-hover:text-white transition-colors">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-sans font-bold text-base sm:text-lg text-[#2B1822]">
                Office &amp; Presence
              </h3>
              <p className="text-xs sm:text-[13px] text-stone-600 leading-snug mt-1 font-sans">
                {address}
              </p>
            </div>
          </div>
        </div>

        {/* Social Bar */}
        <div className="flex items-center justify-center gap-4 pt-2">
          {info?.socialLinks && info.socialLinks.length > 0 ? (
            info.socialLinks.map((s) => {
              let Icon = InstagramIcon
              if (s.platform === 'facebook') Icon = FacebookIcon
              if (s.platform === 'youtube') Icon = YouTubeIcon
              if (s.platform === 'linkedin') Icon = LinkedInIcon
              return (
                <a
                  key={s.platform + s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.platform}
                  className="w-10 h-10 rounded-full border border-[#E8C4D4]/60 flex items-center justify-center text-[#2B1822] hover:bg-[#6B2D5C] hover:text-white hover:border-[#6B2D5C] transition-colors bg-white shadow-2xs"
                >
                  <Icon className="w-4 h-4" />
                </a>
              )
            })
          ) : (
            <>
              <a
                href="https://www.facebook.com/p/Lovixa-Harbel-Care-61574511437687/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full border border-[#E8C4D4]/60 flex items-center justify-center text-[#2B1822] hover:bg-[#6B2D5C] hover:text-white hover:border-[#6B2D5C] transition-colors bg-white shadow-2xs"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/lovixa_cosmetic"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full border border-[#E8C4D4]/60 flex items-center justify-center text-[#2B1822] hover:bg-[#6B2D5C] hover:text-white hover:border-[#6B2D5C] transition-colors bg-white shadow-2xs"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            </>
          )}
        </div>

        {/* SEND US A MESSAGE FORM & RIGHT SHOWCASE IMAGE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start pt-4">
          {/* Form Box (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl sm:rounded-3xl border border-[#E8C4D4]/60 p-6 sm:p-8 lg:p-10 shadow-xs">
            <h2 className="font-sans font-bold text-2xl sm:text-3xl text-[#2B1822] mb-6">
              Send Us A Message
            </h2>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-sans font-bold text-lg sm:text-xl text-[#2B1822]">
                  Thank You for Reaching Out
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto font-sans">
                  We have received your message. Our customer concierge team will respond back to you within 24 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false)
                    setFormData({ name: '', phone: '', email: '', message: '' })
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#6B2D5C] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#562349] transition-colors cursor-pointer font-sans"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-[#2B1822] mb-1.5 font-sans">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email Address"
                    disabled={submitting}
                    className="w-full px-4 py-3 rounded-xl bg-[#FBF6F8] border border-[#E8C4D4]/60 text-xs sm:text-sm text-[#2B1822] placeholder:text-[#2B1822]/40 focus:outline-none focus:bg-white focus:border-[#6B2D5C] transition-all font-sans"
                  />
                </div>

                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-[#2B1822] mb-1.5 font-sans">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your Name"
                    disabled={submitting}
                    className="w-full px-4 py-3 rounded-xl bg-[#FBF6F8] border border-[#E8C4D4]/60 text-xs sm:text-sm text-[#2B1822] placeholder:text-[#2B1822]/40 focus:outline-none focus:bg-white focus:border-[#6B2D5C] transition-all font-sans"
                  />
                </div>

                <div>
                  <label htmlFor="contact-phone" className="block text-xs font-semibold text-[#2B1822] mb-1.5 font-sans">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone Number"
                    disabled={submitting}
                    className="w-full px-4 py-3 rounded-xl bg-[#FBF6F8] border border-[#E8C4D4]/60 text-xs sm:text-sm text-[#2B1822] placeholder:text-[#2B1822]/40 focus:outline-none focus:bg-white focus:border-[#6B2D5C] transition-all font-sans"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-[#2B1822] mb-1.5 font-sans">
                    Comment
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write Your Message"
                    disabled={submitting}
                    className="w-full px-4 py-3 rounded-xl bg-[#FBF6F8] border border-[#E8C4D4]/60 text-xs sm:text-sm text-[#2B1822] placeholder:text-[#2B1822]/40 focus:outline-none focus:bg-white focus:border-[#6B2D5C] transition-all font-sans resize-none"
                  />
                </div>

                {errorMessage && (
                  <p className="text-xs text-red-600 font-semibold">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-full bg-[#6B2D5C] hover:bg-[#562349] text-white font-sans font-bold text-sm tracking-wide transition-all cursor-pointer shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Submit Message</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Image Showcase (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative aspect-[1.1/1] sm:aspect-[1.2/1] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-[#E8C4D4]/60">
              <Image
                src="/images/contact-us-image.webp"
                alt="LOVIXA Customer Concierge & Assistance"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Direct WhatsApp Concierge Card */}
            <div className="bg-[#E8C4D4]/25 rounded-2xl border border-[#E8C4D4]/60 p-5 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#6B2D5C] flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Direct WhatsApp Concierge</span>
                </h4>
                <p className="text-xs text-[#2B1822]/70 mt-1 font-sans">
                  Quick assistance with order status, product routines, or dispatch inquiries.
                </p>
              </div>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold tracking-wide transition-colors shrink-0 shadow-xs font-sans"
              >
                Chat Now
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* JOIN THE LOVIXA FAMILY NEWSLETTER BANNER */}
      <JoinLovixaFamily />
    </div>
  )
}
