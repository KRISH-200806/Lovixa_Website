'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delayMs?: number
  threshold?: number
}

export function ScrollReveal({
  children,
  className = '',
  delayMs = 0,
  threshold = 0.1,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // If user prefers reduced motion, show immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delayMs > 0) {
            setTimeout(() => setIsVisible(true), delayMs)
          } else {
            setIsVisible(true)
          }
          observer.unobserve(entry.target)
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delayMs, threshold])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-7'
      } ${className}`}
    >
      {children}
    </div>
  )
}
