import React from 'react'

export default function StoreLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 bg-[#FBF6F8]/60 animate-in fade-in duration-150">
      {/* Top Loading Progress Line */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#E8C4D4]/30 z-50 overflow-hidden">
        <div className="h-full bg-[#6B2D5C] animate-[loading-bar_1.2s_ease-in-out_infinite]" />
      </div>

      <div className="flex flex-col items-center gap-3">
        {/* Brand Monogram Shimmer */}
        <div className="w-12 h-12 rounded-full bg-[#6B2D5C]/10 border border-[#E8C4D4]/60 flex items-center justify-center text-[#6B2D5C] font-serif font-bold text-lg animate-pulse">
          L
        </div>

        <span className="text-[11px] font-sans font-bold tracking-[0.24em] uppercase text-[#6B2D5C]">
          LOVIXA
        </span>

        <p className="text-xs text-stone-400 font-sans tracking-wide">
          Loading botanical formulations...
        </p>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes loading-bar {
            0% { transform: translateX(-100%); width: 40%; }
            50% { transform: translateX(50%); width: 60%; }
            100% { transform: translateX(200%); width: 40%; }
          }
        `
      }} />
    </div>
  )
}
