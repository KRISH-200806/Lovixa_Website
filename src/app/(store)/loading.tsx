import React from 'react'
import Image from 'next/image'

export default function StoreLoading() {
  return (
    <div
      className="relative min-h-[75vh] w-full flex flex-col items-center justify-center px-4 py-16 bg-[#FBF6F8] overflow-hidden select-none"
      aria-busy="true"
      aria-label="Loading Lovixa Cosmetic"
    >
      {/* 1. Ambient Background Glowing Orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#E8C4D4]/30 blur-3xl pointer-events-none animate-[pulse-slow_4s_ease-in-out_infinite]" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#6B2D5C]/10 blur-3xl pointer-events-none animate-[pulse-slow_4s_ease-in-out_infinite_2s]" />

      {/* 2. Top Progress Streamer */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#E8C4D4]/30 z-50 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#6B2D5C] via-[#E8C4D4] to-[#6B2D5C] animate-[streamer_1.4s_ease-in-out_infinite]" />
      </div>

      {/* 3. Central Animated Luxury Emblem Card */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Rings & Logo Container */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center mb-6">
          {/* Outer Dashed Spinning Halo */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#6B2D5C]/30 animate-[spin_12s_linear_infinite]" />

          {/* Middle Counter-Rotating Shimmer Ring */}
          <div className="absolute inset-2 rounded-full border border-t-transparent border-r-[#6B2D5C] border-b-[#E8C4D4] border-l-transparent animate-[spin-reverse_6s_linear_infinite]" />

          {/* Soft Glowing Pulsing Backdrop */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#F5EBF0] via-[#EEDAE5] to-white shadow-lg shadow-[#6B2D5C]/10 animate-[breathe_3s_ease-in-out_infinite]" />

          {/* Centered Brand Emblem / Icon */}
          <div className="relative z-10 flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 shadow-md flex items-center justify-center border border-[#E8C4D4]/60 p-2.5 animate-[float_3s_ease-in-out_infinite]">
              <Image
                src="/images/lovixa-logo.png"
                alt="LOVIXA"
                width={64}
                height={64}
                priority
                className="w-full h-auto object-contain max-h-12"
              />
            </div>
          </div>

          {/* Orbiting Satellite Sparkle */}
          <div className="absolute inset-0 animate-[spin_4s_linear_infinite]">
            <div className="w-2.5 h-2.5 rounded-full bg-[#6B2D5C] shadow-sm shadow-[#6B2D5C]/50 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Shimmering Brand Typography */}
        <div className="text-center space-y-2 max-w-sm">
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold tracking-[0.28em] text-[#6B2D5C] uppercase">
            LOVIXA
          </h2>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#E8C4D4]/60 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6B2D5C] animate-ping" />
            <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-[#6B2D5C]">
              Ayurvedic & Botanical Hair Care
            </span>
          </div>

          <p className="text-xs text-[#2B1822]/60 font-sans tracking-wide pt-1">
            Preparing your formulation...
          </p>
        </div>

        {/* Animated Fluid Progress Bar */}
        <div className="mt-6 w-48 sm:w-56 h-1.5 bg-[#E8C4D4]/40 rounded-full overflow-hidden p-0.5 border border-[#E8C4D4]/60 shadow-inner">
          <div className="h-full bg-gradient-to-r from-[#6B2D5C] via-[#D498B7] to-[#6B2D5C] rounded-full animate-[progress-fluid_1.8s_ease-in-out_infinite]" />
        </div>

        {/* Triple Sync Dots */}
        <div className="flex items-center gap-1.5 mt-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6B2D5C]/60 animate-[dot-pulse_1.4s_infinite_0ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#6B2D5C]/80 animate-[dot-pulse_1.4s_infinite_200ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#6B2D5C] animate-[dot-pulse_1.4s_infinite_400ms]" />
        </div>
      </div>

      {/* Scoped Keyframes for Silky 60fps Animation */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes streamer {
              0% { transform: translateX(-100%); width: 35%; }
              50% { transform: translateX(50%); width: 55%; }
              100% { transform: translateX(200%); width: 35%; }
            }
            @keyframes spin-reverse {
              from { transform: rotate(360deg); }
              to { transform: rotate(0deg); }
            }
            @keyframes breathe {
              0%, 100% { transform: scale(1); opacity: 0.85; }
              50% { transform: scale(1.08); opacity: 1; }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-4px); }
            }
            @keyframes progress-fluid {
              0% { transform: translateX(-100%); width: 30%; }
              50% { transform: translateX(40%); width: 60%; }
              100% { transform: translateX(220%); width: 30%; }
            }
            @keyframes pulse-slow {
              0%, 100% { opacity: 0.3; transform: scale(1); }
              50% { opacity: 0.6; transform: scale(1.15); }
            }
            @keyframes dot-pulse {
              0%, 100% { opacity: 0.3; transform: scale(0.8); }
              50% { opacity: 1; transform: scale(1.3); }
            }
          `,
        }}
      />
    </div>
  )
}
