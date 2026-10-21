'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export interface CartItem {
  id: string
  title: string
  slug: string
  price: number
  compareAtPrice?: number
  image: string
  selectedShade?: {
    shadeName: string
    colorHex: string
    sku?: string
  }
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (itemId: string, shadeName?: string) => void
  updateQuantity: (itemId: string, quantity: number, shadeName?: string) => void
  clearCart: () => void
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  appliedCoupon: string | null
  discountAmount: number
  applyCoupon: (code: string) => { success: boolean; message: string }
  removeCoupon: () => void
  subtotal: number
  total: number
  totalCount: number
  freeShippingThreshold: number
  freeShippingRemaining: number
  hasFreeShipping: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'lovixa_cart_v1'
const FREE_SHIPPING_THRESHOLD = 499

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [discountPercent, setDiscountPercent] = useState<number>(0)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setItems(parsed)
        }
      }
    } catch {
      // Ignore localStorage read errors
    } finally {
      setIsInitialized(true)
    }
  }, [])

  // Save cart to localStorage on change
  useEffect(() => {
    if (!isInitialized) return
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Ignore localStorage write errors
    }
  }, [items, isInitialized])

  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)
  const toggleCart = () => setIsCartOpen((prev) => !prev)

  const addItem = (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (i) =>
          i.id === item.id &&
          (i.selectedShade?.shadeName || '') === (item.selectedShade?.shadeName || '')
      )

      if (existingIndex > -1) {
        const updated = [...prevItems]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        }
        return updated
      }

      return [...prevItems, { ...item, quantity }]
    })

    // Automatically open cart drawer to give immediate feedback
    setIsCartOpen(true)
  }

  const removeItem = (itemId: string, shadeName?: string) => {
    setItems((prevItems) =>
      prevItems.filter(
        (i) =>
          !(i.id === itemId && (i.selectedShade?.shadeName || '') === (shadeName || ''))
      )
    )
  }

  const updateQuantity = (itemId: string, quantity: number, shadeName?: string) => {
    if (quantity <= 0) {
      removeItem(itemId, shadeName)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (
          item.id === itemId &&
          (item.selectedShade?.shadeName || '') === (shadeName || '')
        ) {
          return { ...item, quantity }
        }
        return item
      })
    )
  }

  const clearCart = () => {
    setItems([])
    setAppliedCoupon(null)
    setDiscountPercent(0)
  }

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase()
    if (cleanCode === 'LOVIXA15' || cleanCode === 'WELCOME15') {
      setAppliedCoupon(cleanCode)
      setDiscountPercent(15)
      return { success: true, message: '🎉 15% Launch discount applied!' }
    }
    if (cleanCode === 'LOVIXA10') {
      setAppliedCoupon(cleanCode)
      setDiscountPercent(10)
      return { success: true, message: '🎉 10% Cosmetic discount applied!' }
    }
    return { success: false, message: 'Invalid coupon code. Try LOVIXA15' }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setDiscountPercent(0)
  }

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [items])

  const totalCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }, [items])

  const discountAmount = useMemo(() => {
    if (!discountPercent) return 0
    return Math.round((subtotal * discountPercent) / 100)
  }, [subtotal, discountPercent])

  const total = useMemo(() => {
    return Math.max(0, subtotal - discountAmount)
  }, [subtotal, discountAmount])

  const freeShippingRemaining = useMemo(() => {
    return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  }, [subtotal])

  const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        appliedCoupon,
        discountAmount,
        applyCoupon,
        removeCoupon,
        subtotal,
        total,
        totalCount,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeShippingRemaining,
        hasFreeShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
