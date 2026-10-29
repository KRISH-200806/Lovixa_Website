import React from 'react'

export default function StoreLoading() {
  return (
    <div
      className="w-full min-h-screen bg-[#FBF6F8] pb-16 animate-in fade-in duration-200"
      aria-busy="true"
      aria-label="Loading page content"
    >
      {/* 1. Top Ambient Progress Line */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#E8C4D4]/30 z-50 overflow-hidden">
        <div className="h-full bg-[#6B2D5C] animate-[loading-bar_1.2s_ease-in-out_infinite]" />
      </div>

      {/* 2. Hero Section Skeleton */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F7EDF2] via-[#FBF6F8] to-[#FBF6F8] pt-6 sm:pt-10 pb-12 sm:pb-16 border-b border-[#E8C4D4]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-5">
              {/* Eyebrow Badge Skeleton */}
              <div className="h-7 w-48 sm:w-56 rounded-full bg-[#E8C4D4]/60 animate-pulse" />

              {/* Headline Skeletons */}
              <div className="space-y-3 mt-1">
                <div className="h-9 sm:h-12 w-full max-w-xl rounded-2xl bg-stone-200/80 animate-pulse" />
                <div className="h-9 sm:h-12 w-4/5 max-w-lg rounded-2xl bg-[#E8C4D4]/50 animate-pulse" />
              </div>

              {/* Subtitle Lines */}
              <div className="space-y-2 mt-2">
                <div className="h-4 w-full max-w-lg rounded-lg bg-stone-200/70 animate-pulse" />
                <div className="h-4 w-5/6 max-w-md rounded-lg bg-stone-200/60 animate-pulse" />
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="h-12 w-40 sm:w-44 rounded-full bg-[#6B2D5C]/25 animate-pulse" />
                <div className="h-12 w-32 sm:w-36 rounded-full bg-stone-200/80 animate-pulse" />
              </div>

              {/* Trust Bullet Strip */}
              <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 border-t border-[#E8C4D4]/40">
                <div className="h-4 w-36 rounded-md bg-stone-200/70 animate-pulse" />
                <div className="h-4 w-32 rounded-md bg-stone-200/70 animate-pulse" />
                <div className="h-4 w-40 rounded-md bg-stone-200/70 animate-pulse" />
              </div>
            </div>

            {/* Right Media / Bottle Skeleton Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md aspect-[4/5] rounded-3xl bg-gradient-to-br from-[#F0DFE8] via-[#E8D4DF] to-[#F5EBF0] border border-[#E8C4D4]/60 p-6 flex flex-col justify-between shadow-sm animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="h-6 w-24 rounded-full bg-white/70" />
                  <div className="h-8 w-8 rounded-full bg-white/70" />
                </div>
                <div className="my-auto mx-auto w-36 h-56 rounded-2xl bg-white/40" />
                <div className="space-y-2">
                  <div className="h-5 w-3/4 rounded-lg bg-white/70" />
                  <div className="h-4 w-1/2 rounded-md bg-white/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Value Props / Trust Badges Strip Skeleton */}
      <section className="py-6 bg-white border-b border-[#E8C4D4]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#FBF6F8] border border-[#E8C4D4]/40 animate-pulse"
              >
                <div className="w-10 h-10 rounded-full bg-[#E8C4D4]/50 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-4/5 rounded bg-stone-200" />
                  <div className="h-2.5 w-3/5 rounded bg-stone-200/60" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Products Grid Skeleton */}
      <section className="py-12 sm:py-16 bg-[#FBF6F8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 flex flex-col items-center gap-2.5">
            <div className="h-5 w-36 rounded-full bg-[#E8C4D4]/60 animate-pulse" />
            <div className="h-8 sm:h-9 w-64 sm:w-80 rounded-xl bg-stone-300/70 animate-pulse" />
            <div className="h-4 w-80 max-w-full rounded-md bg-stone-200/70 animate-pulse" />
          </div>

          {/* Product Cards Grid (3 cards matching Lovixa's core catalog) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((card) => (
              <div
                key={card}
                className="bg-white rounded-2xl border border-[#E8C4D4]/50 p-4 shadow-xs flex flex-col gap-3 animate-pulse"
              >
                {/* Product Image Area */}
                <div className="w-full aspect-[4/5] rounded-xl bg-gradient-to-br from-[#F5EBF0] via-[#EEDAE5] to-[#F7EEF3] relative overflow-hidden">
                  <div className="absolute top-3 left-3 h-5 w-24 rounded-full bg-white/70" />
                  <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/70" />
                </div>

                {/* Rating & Size Line */}
                <div className="flex items-center justify-between pt-1">
                  <div className="h-4 w-24 rounded bg-amber-100/80" />
                  <div className="h-4 w-14 rounded-full bg-[#E8C4D4]/40" />
                </div>

                {/* Title Lines */}
                <div className="space-y-2">
                  <div className="h-4 w-11/12 rounded bg-stone-200" />
                  <div className="h-4 w-3/4 rounded bg-stone-200/70" />
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-3 mt-auto border-t border-[#E8C4D4]/30">
                  <div className="space-y-1">
                    <div className="h-5 w-16 rounded bg-stone-300" />
                    <div className="h-3 w-10 rounded bg-stone-200" />
                  </div>
                  <div className="h-10 w-28 rounded-full bg-[#6B2D5C]/30" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes loading-bar {
              0% { transform: translateX(-100%); width: 40%; }
              50% { transform: translateX(50%); width: 60%; }
              100% { transform: translateX(200%); width: 40%; }
            }
          `,
        }}
      />
    </div>
  )
}
