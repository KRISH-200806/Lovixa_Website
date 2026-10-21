'use client'

import { create } from 'zustand'

export interface WishlistItem {
  productId: string
  title: string
  slug: string
  price: number
  compareAtPrice?: number
  image?: string
  brand?: string
}

export interface WishlistState {
  userId: string | null
  items: WishlistItem[]
  toggleItem: (item: WishlistItem | string) => void
  addItem: (item: WishlistItem) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
  getTotalItems: () => number
  setUser: (userId: string | null) => void
}

function getStorageKey(userId: string | null) {
  return userId ? `flexion_wishlist_${userId}` : 'flexion_wishlist_guest'
}

function loadInitialItems(userId: string | null): WishlistItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(getStorageKey(userId))
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

function saveItems(userId: string | null, items: WishlistItem[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(items))
  } catch (e) {
    console.error('Failed to persist wishlist:', e)
  }
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  userId: null,
  items: loadInitialItems(null),

  setUser: (userId) => {
    const currentUserId = get().userId
    if (currentUserId === userId) return
    const loadedItems = loadInitialItems(userId)
    set({ userId, items: loadedItems })
  },

  toggleItem: (item) => {
    const { items, userId } = get()
    const productId = typeof item === 'string' ? item : item.productId
    const exists = items.some((i) => i.productId === productId)
    const nextItems = exists
      ? items.filter((i) => i.productId !== productId)
      : [
          ...items,
          typeof item === 'string'
            ? {
                productId,
                title: 'LOVIXA Formulation',
                slug: productId.replace('prod_', 'lovixa-'),
                price: 24,
              }
            : item,
        ]

    set({ items: nextItems })
    saveItems(userId, nextItems)
  },

  addItem: (item) => {
    const { items, userId } = get()
    if (!items.some((i) => i.productId === item.productId)) {
      const nextItems = [...items, item]
      set({ items: nextItems })
      saveItems(userId, nextItems)
    }
  },

  removeItem: (productId) => {
    const { items, userId } = get()
    const nextItems = items.filter((i) => i.productId !== productId)
    set({ items: nextItems })
    saveItems(userId, nextItems)
  },

  isInWishlist: (productId) => {
    return get().items.some((i) => i.productId === productId)
  },

  clearWishlist: () => {
    const { userId } = get()
    set({ items: [] })
    saveItems(userId, [])
  },

  getTotalItems: () => get().items.length,
}))
