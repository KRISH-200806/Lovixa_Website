import { create } from 'zustand'
import type { StorefrontProduct } from '@/lib/cms/products'

interface QuickViewState {
  isOpen: boolean
  product: StorefrontProduct | null
  openQuickView: (product: StorefrontProduct) => void
  closeQuickView: () => void
}

export const useQuickViewStore = create<QuickViewState>((set) => ({
  isOpen: false,
  product: null,
  openQuickView: (product) => set({ isOpen: true, product }),
  closeQuickView: () => set({ isOpen: false, product: null }),
}))
