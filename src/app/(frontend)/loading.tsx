import React from 'react'
import Image from 'next/image'

export default function Loading() {
  return (
    <div className="relative min-h-[60vh] w-full flex flex-col items-center justify-center px-4 py-16 bg-[#FBF6F8]">
      <div className="relative w-24 h-24 flex items-center justify-center mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#6B2D5C]/30 animate-spin" />
        <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center border border-[#E8C4D4]/60 p-2 animate-pulse">
          <Image
            src="/images/lovixa-logo.png"
            alt="LOVIXA"
            width={48}
            height={48}
            priority
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
      <p className="text-xs text-[#2B1822]/60 font-sans tracking-widest uppercase">
        Loading...
      </p>
    </div>
  )
}
