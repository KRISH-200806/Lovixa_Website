'use client'

import { useState, useRef, useEffect } from 'react'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { useCurrency } from '@/components/providers/StoreSettingsProvider'

export function CurrencySwitcher({ className = '' }: { className?: string }) {
  const { currentCurrency, supportedCurrencies, changeCurrency } = useCurrency()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!supportedCurrencies || supportedCurrencies.length <= 1) {
    return null
  }

  return (
    <div className={`relative inline-block text-left shrink-0 ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#2B1822] hover:text-[#6B2D5C] bg-[#FBF6F8] hover:bg-[#E8C4D4]/30 border border-[#E8C4D4] rounded-full transition-all cursor-pointer whitespace-nowrap shrink-0 font-sans"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-[#6B2D5C] shrink-0" />
        <span className="whitespace-nowrap">{currentCurrency.code} ({currentCurrency.symbol})</span>
        <ChevronDown className={`w-3 h-3 text-stone-500 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-[#E8C4D4] shadow-xl py-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-150 font-sans">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6B2D5C] border-b border-stone-200/80 mb-1">
            Select Currency
          </div>
          <div className="max-h-56 overflow-y-auto">
            {supportedCurrencies.map((curr) => {
              const isSelected = curr.code === currentCurrency.code
              return (
                <button
                  key={curr.code}
                  onClick={() => {
                    changeCurrency(curr.code)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#FBF6F8] transition-colors cursor-pointer ${
                    isSelected ? 'font-bold text-[#6B2D5C] bg-[#FBF6F8]' : 'text-[#2B1822]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 text-center font-mono font-bold text-[#2B1822] bg-white border border-stone-200 rounded py-0.5 text-[11px]">
                      {curr.symbol}
                    </span>
                    <span>{curr.name || curr.code}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#6B2D5C] shrink-0" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
