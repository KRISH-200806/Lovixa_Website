'use client'

import { useState, useRef, MouseEvent } from 'react'
import Image from 'next/image'
import { ZoomIn } from 'lucide-react'

export function ProductGallery({
  images = [],
  title,
}: {
  images: Array<{ url: string; alt?: string }>
  title: string
}) {
  const validImages = images.filter((img) => Boolean(img?.url && img.url.trim() !== ''))
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const currentImage = validImages[selectedIndex]

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100))
    setZoomPos({ x, y })
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 sm:gap-6">
      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="flex md:flex-col gap-2.5 sm:gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-none shrink-0">
          {validImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all duration-200 cursor-pointer ${
                selectedIndex === idx
                  ? 'border-[#6B2D5C] shadow-sm ring-2 ring-[#6B2D5C]/20'
                  : 'border-[#E8C4D4]/70 opacity-70 hover:opacity-100 hover:border-[#6B2D5C]/40 bg-white'
              }`}
              aria-label={`View ${title} image ${idx + 1}`}
            >
              <Image
                src={img.url}
                alt={img.alt || `${title} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Showcase Image with Interactive Magnifier / Zoom */}
      <div
        ref={imageContainerRef}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        className="flex-1 aspect-square rounded-3xl overflow-hidden bg-[#FBF6F8] border border-[#E8C4D4]/70 relative group cursor-crosshair select-none shadow-sm"
      >
        {currentImage?.url ? (
          <>
            <Image
              src={currentImage.url}
              alt={currentImage.alt || title}
              fill
              priority
              className={`object-cover transition-transform duration-200 pointer-events-none ${
                isZoomed ? 'scale-175' : 'scale-100'
              }`}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    }
                  : undefined
              }
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 45vw"
            />

            {/* Subtle Zoom Hint Overlay */}
            <div
              className={`absolute bottom-3.5 right-3.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E8C4D4]/60 text-[10px] font-bold text-[#2B1822] uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-opacity duration-200 pointer-events-none ${
                isZoomed ? 'opacity-0' : 'opacity-80 group-hover:opacity-100'
              }`}
            >
              <ZoomIn className="w-3.5 h-3.5 text-[#6B2D5C]" />
              <span className="hidden sm:inline">Hover to Zoom</span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300 font-serif font-bold text-3xl">
            {title.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  )
}
