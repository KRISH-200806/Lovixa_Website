'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { setGlobalCurrency } from '@/lib/utils'
import { useCartStore } from '@/lib/cart/cart-store'

export interface CurrencyOption {
  code: string
  symbol: string
  name: string
  exchangeRate: number
}

export interface StoreSettingsData {
  storeName?: string
  currency?: {
    code?: string
    symbol?: string
    decimals?: number
    orderCurrencyMode?: string
  }
  supportedCurrencies?: CurrencyOption[]
  shipping?: {
    flatRate?: number
    freeShippingThreshold?: number
    freeShippingEnabled?: boolean
    serviceablePincodes?: string
    shippingPolicyNote?: string
    deliveryTimeline?: string
  }
  whatsappCheckout?: {
    enabled?: boolean
    businessNumber?: string
    upiId?: string
    bankDetails?: string
    privacyNotice?: string
  }
  tax?: {
    enabled?: boolean
    ratePercentage?: number
    pricesIncludeTax?: boolean
    taxLabel?: string
  }
  gateways?: {
    enableWhatsApp?: boolean
    enableStripe?: boolean
    enableRazorpay?: boolean
    enableCashOnDelivery?: boolean
  }
  contact?: {
    phone?: string
    supportHours?: string
    email?: string
    address?: string
  }
}

export interface StoreSettingsContextValue {
  settings: StoreSettingsData | null
  currentCurrency: CurrencyOption
  supportedCurrencies: CurrencyOption[]
  changeCurrency: (code: string) => void
  formatPrice: (amount: number, overrideSymbol?: string) => string
}

const DEFAULT_CURRENCIES: CurrencyOption[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', exchangeRate: 1 },
]

const StoreSettingsContext = createContext<StoreSettingsContextValue | null>(null)

export function StoreSettingsProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode
  initialSettings?: StoreSettingsData | null
}) {
  const [settings, setSettings] = useState<StoreSettingsData | null>(initialSettings || null)

  const baseSymbol =
    settings?.currency?.symbol ||
    initialSettings?.currency?.symbol ||
    process.env.NEXT_PUBLIC_CURRENCY_SYMBOL ||
    '₹'
  const baseCode =
    settings?.currency?.code ||
    initialSettings?.currency?.code ||
    process.env.NEXT_PUBLIC_DEFAULT_CURRENCY ||
    'INR'

  const activeCurrencies: CurrencyOption[] =
    settings?.supportedCurrencies && settings.supportedCurrencies.length > 0
      ? settings.supportedCurrencies
      : DEFAULT_CURRENCIES

  const [currentCurrency, setCurrentCurrency] = useState<CurrencyOption>(() => {
    return (
      activeCurrencies.find((c) => c.code.toUpperCase() === baseCode.toUpperCase()) ||
      activeCurrencies[0] || {
        code: baseCode,
        symbol: baseSymbol,
        name: baseCode,
        exchangeRate: 1,
      }
    )
  })

  // Sync saved currency from localStorage on client mount (avoids SSR hydration mismatch)
  useEffect(() => {
    try {
      const savedCode = localStorage.getItem('flexion_selected_currency')
      if (savedCode) {
        const match = activeCurrencies.find((c) => c.code.toUpperCase() === savedCode.toUpperCase())
        if (match && match.code === 'INR') {
          setCurrentCurrency(match)
        } else {
          const inrMatch = activeCurrencies.find((c) => c.code.toUpperCase() === 'INR') || activeCurrencies[0]
          if (inrMatch) {
            setCurrentCurrency(inrMatch)
            localStorage.setItem('flexion_selected_currency', 'INR')
          }
        }
      }
    } catch (e) {}
  }, [activeCurrencies])

  // Apply initial dynamic shipping/tax rules to cart store
  useEffect(() => {
    if (initialSettings) {
      if (initialSettings.shipping) {
        useCartStore.getState().setShippingConfig({
          flatRate: typeof initialSettings.shipping.flatRate === 'number' ? initialSettings.shipping.flatRate : (Number(process.env.NEXT_PUBLIC_SHIPPING_FLAT_RATE) || 99),
          freeShippingThreshold: typeof initialSettings.shipping.freeShippingThreshold === 'number' ? initialSettings.shipping.freeShippingThreshold : (Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD) || 999),
          freeShippingEnabled: initialSettings.shipping.freeShippingEnabled !== false,
        })
      }
      if (initialSettings.tax) {
        useCartStore.getState().setTaxConfig({
          enabled: initialSettings.tax.enabled !== false,
          ratePercentage: typeof initialSettings.tax.ratePercentage === 'number' ? initialSettings.tax.ratePercentage : 18,
          pricesIncludeTax: Boolean(initialSettings.tax.pricesIncludeTax),
          taxLabel: initialSettings.tax.taxLabel || 'GST (Inclusive)',
        })
      }
    }
  }, [initialSettings])

  // Keep global helper in sync
  setGlobalCurrency(currentCurrency.symbol, currentCurrency.code, currentCurrency.exchangeRate)

  useEffect(() => {
    // Fetch live settings from Payload CMS Admin to ensure real-time synchronization
    fetch('/api/globals/store-settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setSettings(data)

          // Dynamically synchronize live Admin Shipping & Tax configuration into the Cart Store
          if (data.shipping) {
            useCartStore.getState().setShippingConfig({
              flatRate: typeof data.shipping.flatRate === 'number' ? data.shipping.flatRate : (Number(process.env.NEXT_PUBLIC_SHIPPING_FLAT_RATE) || 99),
              freeShippingThreshold: typeof data.shipping.freeShippingThreshold === 'number' ? data.shipping.freeShippingThreshold : (Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD) || 999),
              freeShippingEnabled: data.shipping.freeShippingEnabled !== false,
            })
          }

          if (data.tax) {
            useCartStore.getState().setTaxConfig({
              enabled: data.tax.enabled !== false,
              ratePercentage: typeof data.tax.ratePercentage === 'number' ? data.tax.ratePercentage : 18,
              pricesIncludeTax: Boolean(data.tax.pricesIncludeTax),
              taxLabel: data.tax.taxLabel || 'GST (Inclusive)',
            })
          }

          const liveCurrencies: CurrencyOption[] =
            data.supportedCurrencies && data.supportedCurrencies.length > 0
              ? data.supportedCurrencies
              : DEFAULT_CURRENCIES

          let targetCode: string | null = null
          try {
            targetCode = localStorage.getItem('flexion_selected_currency')
          } catch (e) {}

          if (!targetCode && data.currency?.code) {
            targetCode = data.currency.code
          }

          if (targetCode) {
            const match = liveCurrencies.find((c) => c.code.toUpperCase() === targetCode?.toUpperCase())
            if (match) {
              setCurrentCurrency(match)
              setGlobalCurrency(match.symbol, match.code, match.exchangeRate)
            }
          }
        }
      })
      .catch((err) => console.warn('Could not sync store settings:', err))
  }, [baseCode])

  const changeCurrency = useCallback(
    (code: string) => {
      const match = activeCurrencies.find((c) => c.code.toUpperCase() === code.toUpperCase())
      if (match) {
        setCurrentCurrency(match)
        setGlobalCurrency(match.symbol, match.code, match.exchangeRate)
        try {
          localStorage.setItem('flexion_selected_currency', match.code)
        } catch (e) {}
      }
    },
    [activeCurrencies]
  )

  const formatPrice = useCallback(
    (amount: number, overrideSymbol?: string): string => {
      const num = typeof amount === 'number' && !isNaN(amount) ? amount : 0
      const rate = currentCurrency.exchangeRate || 1
      const symbol = overrideSymbol || currentCurrency.symbol || '₹'
      const converted = num * rate
      return `${symbol}${converted.toLocaleString('en-IN', {
        minimumFractionDigits: converted % 1 !== 0 ? 2 : 0,
        maximumFractionDigits: 2,
      })}`
    },
    [currentCurrency]
  )

  return (
    <StoreSettingsContext.Provider
      value={{
        settings: settings || initialSettings || null,
        currentCurrency,
        supportedCurrencies: activeCurrencies,
        changeCurrency,
        formatPrice,
      }}
    >
      {children}
    </StoreSettingsContext.Provider>
  )
}

export function useStoreSettings() {
  const ctx = useContext(StoreSettingsContext)
  return ctx?.settings || null
}

export function useCurrency() {
  const ctx = useContext(StoreSettingsContext)
  if (!ctx) {
    return {
      currentCurrency: { code: 'INR', symbol: '₹', name: 'Indian Rupee', exchangeRate: 1 },
      supportedCurrencies: DEFAULT_CURRENCIES,
      changeCurrency: () => {},
      formatPrice: (amount: number) => `₹${(Number(amount) || 0).toLocaleString('en-IN')}`,
    }
  }
  return {
    currentCurrency: ctx.currentCurrency,
    supportedCurrencies: ctx.supportedCurrencies,
    changeCurrency: ctx.changeCurrency,
    formatPrice: ctx.formatPrice,
  }
}
