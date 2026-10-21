'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  productId: string
  variantId?: string
  title: string
  slug: string
  price: number
  compareAtPrice?: number
  quantity: number
  image?: string
  optionsSummary?: string
  maxStock?: number
}

export interface AppliedCoupon {
  code: string
  discountType: 'percentage' | 'fixed_amount' | 'free_shipping'
  discountValue: number
  minOrderAmount?: number
  maxDiscountAmount?: number | null
}

export interface ShippingConfig {
  flatRate: number
  freeShippingThreshold: number
  freeShippingEnabled: boolean
}

export interface TaxConfig {
  enabled: boolean
  ratePercentage: number
  pricesIncludeTax?: boolean
  taxLabel?: string
}

const DEFAULT_SHIPPING_CONFIG: ShippingConfig = {
  flatRate: Number(process.env.NEXT_PUBLIC_SHIPPING_FLAT_RATE) || 99,
  freeShippingThreshold: Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD) || 999,
  freeShippingEnabled: true,
}

const DEFAULT_TAX_CONFIG: TaxConfig = {
  enabled: true,
  ratePercentage: Number(process.env.NEXT_PUBLIC_DEFAULT_TAX_RATE) || 18,
  pricesIncludeTax: true,
  taxLabel: 'GST (Inclusive)',
}

export interface CartStore {
  items: CartItem[]
  isOpen: boolean
  coupon: AppliedCoupon | undefined
  shippingConfig: ShippingConfig
  taxConfig: TaxConfig
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addItem: (item: CartItem) => void
  removeItem: (productId: string, variantId?: string) => void
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void
  clearCart: () => void
  applyCoupon: (coupon: AppliedCoupon) => void
  removeCoupon: () => void
  setShippingConfig: (config: Partial<ShippingConfig>) => void
  setTaxConfig: (config: Partial<TaxConfig>) => void
  getSubtotal: () => number
  getDiscountAmount: () => number
  getShippingFee: () => number
  getTaxAmount: () => number
  getGrandTotal: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [] as CartItem[],
      isOpen: false,
      coupon: undefined,
      shippingConfig: DEFAULT_SHIPPING_CONFIG,
      taxConfig: DEFAULT_TAX_CONFIG,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state: CartStore) => ({ isOpen: !state.isOpen })),

      addItem: (newItem: CartItem) =>
        set((state: CartStore) => {
          const existingIndex = state.items.findIndex(
            (i: CartItem) => i.productId === newItem.productId && i.variantId === newItem.variantId
          )

          if (existingIndex > -1) {
            const updated = [...state.items]
            const current = updated[existingIndex]
            const maxStock = newItem.maxStock || 999
            const newQty = Math.min(current.quantity + newItem.quantity, maxStock)
            updated[existingIndex] = { ...current, quantity: newQty }
            return { items: updated, isOpen: true }
          }

          return { items: [...state.items, newItem], isOpen: true }
        }),

      removeItem: (productId: string, variantId?: string) =>
        set((state: CartStore) => ({
          items: state.items.filter(
            (i: CartItem) => !(i.productId === productId && i.variantId === variantId)
          ),
        })),

      updateQuantity: (productId: string, quantity: number, variantId?: string) =>
        set((state: CartStore) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (i: CartItem) => !(i.productId === productId && i.variantId === variantId)
              ),
            }
          }
          return {
            items: state.items.map((i: CartItem) => {
              if (i.productId === productId && i.variantId === variantId) {
                const maxStock = i.maxStock || 999
                return { ...i, quantity: Math.min(quantity, maxStock) }
              }
              return i
            }),
          }
        }),

      clearCart: () => set({ items: [], coupon: undefined }),

      applyCoupon: (coupon: AppliedCoupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: undefined }),

      setShippingConfig: (config: Partial<ShippingConfig>) =>
        set((state: CartStore) => ({
          shippingConfig: { ...(state.shippingConfig || DEFAULT_SHIPPING_CONFIG), ...config },
        })),

      setTaxConfig: (config: Partial<TaxConfig>) =>
        set((state: CartStore) => ({
          taxConfig: { ...(state.taxConfig || DEFAULT_TAX_CONFIG), ...config },
        })),

      getSubtotal: () => {
        const { items } = get()
        return items.reduce((total: number, item: CartItem) => total + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0)
      },

      getDiscountAmount: () => {
        const { coupon, getSubtotal } = get()
        if (!coupon) return 0
        const subtotal = getSubtotal()

        // If subtotal is below coupon minimum order requirement
        if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
          return 0
        }

        if (coupon.discountType === 'percentage') {
          const calculated = (subtotal * coupon.discountValue) / 100
          let discount = calculated
          if (coupon.maxDiscountAmount && coupon.maxDiscountAmount > 0) {
            discount = Math.min(calculated, coupon.maxDiscountAmount)
          }
          discount = Math.min(discount, subtotal)
          return Math.round(discount * 100) / 100
        }

        if (coupon.discountType === 'fixed_amount') {
          return Math.min(coupon.discountValue, subtotal)
        }

        return 0
      },

      getShippingFee: () => {
        const { coupon, getSubtotal, shippingConfig = DEFAULT_SHIPPING_CONFIG } = get()
        const subtotal = getSubtotal()
        if (subtotal === 0) return 0

        // Free shipping coupon check
        if (coupon?.discountType === 'free_shipping') {
          if (!coupon.minOrderAmount || subtotal >= coupon.minOrderAmount) {
            return 0
          }
        }

        const cfg = shippingConfig || DEFAULT_SHIPPING_CONFIG
        const isFreeEnabled = cfg.freeShippingEnabled !== false
        const threshold = typeof cfg.freeShippingThreshold === 'number'
          ? cfg.freeShippingThreshold
          : (DEFAULT_SHIPPING_CONFIG.freeShippingThreshold || 999)

        if (isFreeEnabled && subtotal >= threshold) {
          return 0
        }

        return typeof cfg.flatRate === 'number'
          ? cfg.flatRate
          : (DEFAULT_SHIPPING_CONFIG.flatRate || 99)
      },

      getTaxAmount: () => {
        const { getSubtotal, getDiscountAmount, taxConfig = DEFAULT_TAX_CONFIG } = get()
        const cfg = taxConfig || DEFAULT_TAX_CONFIG
        if (cfg.enabled === false) return 0
        const taxableAmount = Math.max(0, getSubtotal() - getDiscountAmount())
        const taxRate = (typeof cfg.ratePercentage === 'number' ? cfg.ratePercentage : 18) / 100

        // If prices include tax (e.g. GST in India):
        if (cfg.pricesIncludeTax) {
          // Included tax portion = amount - (amount / (1 + rate))
          return Math.round((taxableAmount - taxableAmount / (1 + taxRate)) * 100) / 100
        }

        return Math.round((taxableAmount * taxRate) * 100) / 100
      },

      getGrandTotal: () => {
        const { getSubtotal, getDiscountAmount, getShippingFee, getTaxAmount, taxConfig = DEFAULT_TAX_CONFIG } = get()
        const cfg = taxConfig || DEFAULT_TAX_CONFIG
        // Only add tax on top if prices DO NOT already include tax!
        const taxOnTop = cfg.enabled !== false && !cfg.pricesIncludeTax ? getTaxAmount() : 0
        const total = getSubtotal() - getDiscountAmount() + getShippingFee() + taxOnTop
        return Math.max(0, Math.round(total * 100) / 100)
      },

      getTotalItems: () => {
        const { items } = get()
        return items.reduce((total: number, item: CartItem) => total + (Number(item.quantity) || 1), 0)
      },
    }),
    {
      name: 'flexion_cart_storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      }),
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
      }),
      merge: (persistedState: any, currentState: CartStore) => {
        return {
          ...currentState,
          items: Array.isArray(persistedState?.items) ? persistedState.items : [],
          coupon: persistedState?.coupon || undefined,
          shippingConfig: currentState.shippingConfig || DEFAULT_SHIPPING_CONFIG,
          taxConfig: currentState.taxConfig || DEFAULT_TAX_CONFIG,
        }
      },
    }
  )
)
