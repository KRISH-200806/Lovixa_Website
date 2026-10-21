import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface PageHeaderBannerProps {
  breadcrumbs: BreadcrumbItem[]
  title: string
  highlightTitle?: string
  subtitle?: string
  badge?: string
  imageSrc?: string
  imageAlt?: string
  priority?: boolean
  className?: string
  bannerHeightClass?: string
}

export function PageHeaderBanner({
  breadcrumbs,
  title,
  highlightTitle,
  subtitle,
  badge,
  imageSrc = '/images/lovixa-hero-banner-model.jpg',
  imageAlt,
  priority = false,
  className = '',
  bannerHeightClass = 'h-48 sm:h-60 lg:h-64',
}: PageHeaderBannerProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center flex-wrap gap-2 text-xs text-stone-500 font-sans">
        <Link href="/" className="hover:text-[#6B2D5C] transition-colors">
          Home
        </Link>
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1
          return (
            <span key={idx} className="flex items-center gap-2">
              <span className="text-stone-300">/</span>
              {crumb.href && !isLast ? (
                <Link href={crumb.href} className="hover:text-[#6B2D5C] transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-[#2B1822] font-semibold' : 'text-stone-400'}>
                  {crumb.label}
                </span>
              )}
            </span>
          )
        })}
      </nav>

      {/* Top Hero Banner */}
      <div
        className={`relative w-full ${bannerHeightClass} bg-[#E8C4D4]/25 rounded-2xl sm:rounded-3xl border border-[#E8C4D4] mb-6 sm:mb-8 overflow-hidden flex items-center shadow-2xs`}
      >
        <div className="absolute inset-0 z-0">
          <Image
            src={imageSrc}
            alt={imageAlt || title}
            fill
            className="object-cover object-right md:object-center opacity-90"
            priority={priority}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FBF6F8] via-[#FBF6F8]/90 to-transparent sm:w-3/4" />
        </div>

        <div className="relative z-10 max-w-xl px-6 sm:px-10 py-5 sm:py-6">
          {badge && (
            <span className="inline-block text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B2D5C] mb-2 font-sans">
              {badge}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-bold text-[#2B1822] tracking-tight leading-tight">
            {title}
            {highlightTitle && (
              <>
                <br />
                <span className="text-[#6B2D5C] italic font-normal">{highlightTitle}</span>
              </>
            )}
          </h1>
          {subtitle && (
            <p className="mt-2 text-xs sm:text-sm text-[#2B1822]/75 font-sans leading-relaxed line-clamp-2">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
