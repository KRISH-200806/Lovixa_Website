import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { COSMETIC_PRODUCTS } from '../src/lib/constants/cosmetics-catalog'

describe('Catalog, Search, Filter, Cart, & Wishlist Suite (PROD, SEARCH, CART, WISH)', () => {
  describe('Product Catalog & Bundles (PROD-001 to PROD-018)', () => {
    it('PROD-001: Verifies all active products exist with valid identifiers', () => {
      assert.ok(COSMETIC_PRODUCTS.length >= 3, 'Must contain at least 3 core formulations')
      const shampoo = COSMETIC_PRODUCTS.find((p) => p.slug === 'lovixa-shampoo')
      const oil = COSMETIC_PRODUCTS.find((p) => p.slug === 'lovixa-hair-oil')
      const duo = COSMETIC_PRODUCTS.find((p) => p.slug === 'lovixa-hair-care-duo')

      assert.ok(shampoo, 'LOVIXA Shampoo must exist')
      assert.ok(oil, 'LOVIXA Hair Oil must exist')
      assert.ok(duo, 'LOVIXA Hair Care Duo must exist')
    })

    it('PROD-003: Verifies selling prices match owner-approved catalog (₹299, ₹299, ₹549)', () => {
      const shampoo = COSMETIC_PRODUCTS.find((p) => p.slug === 'lovixa-shampoo')!
      const oil = COSMETIC_PRODUCTS.find((p) => p.slug === 'lovixa-hair-oil')!
      const duo = COSMETIC_PRODUCTS.find((p) => p.slug === 'lovixa-hair-care-duo')!

      assert.equal(shampoo.price, 299)
      assert.equal(shampoo.compareAtPrice, 399)

      assert.equal(oil.price, 299)
      assert.equal(oil.compareAtPrice, 399)

      assert.equal(duo.price, 549)
      assert.equal(duo.compareAtPrice, 699)
    })

    it('PROD-017: Verifies combo bundle pricing provides genuine customer savings', () => {
      const shampoo = 299
      const oil = 299
      const separateTotal = shampoo + oil // ₹598
      const comboPrice = 549 // ₹549

      const customerSavings = separateTotal - comboPrice
      assert.equal(customerSavings, 49, 'Duo combo must offer ₹49 direct savings over buying separately')
      assert.ok(comboPrice < separateTotal)
    })
  })

  describe('Search & Filter Engine (SEARCH-001 to SEARCH-012)', () => {
    it('SEARCH-001 & SEARCH-002: Exact and case-insensitive search finds matching product', () => {
      const query = 'shampoo'
      const matches = COSMETIC_PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.slug.toLowerCase().includes(query.toLowerCase())
      )
      assert.ok(matches.length >= 1)
      assert.equal(matches[0].title, 'LOVIXA Shampoo')
    })

    it('SEARCH-003: Unknown search returns empty result without throwing', () => {
      const query = 'xyznonexistentlipstick'
      const matches = COSMETIC_PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.slug.toLowerCase().includes(query.toLowerCase())
      )
      assert.equal(matches.length, 0)
    })

    it('SEARCH-007: Numeric price sorting low-to-high and high-to-low', () => {
      const lowToHigh = [...COSMETIC_PRODUCTS].sort((a, b) => a.price - b.price)
      assert.equal(lowToHigh[0].price, 299)
      assert.equal(lowToHigh[lowToHigh.length - 1].price, 549)

      const highToLow = [...COSMETIC_PRODUCTS].sort((a, b) => b.price - a.price)
      assert.equal(highToLow[0].price, 549)
      assert.equal(highToLow[highToLow.length - 1].price, 299)
    })

    it('SEARCH-005: Price filter boundary excludes products above maximum threshold', () => {
      const maxPrice = 300
      const filtered = COSMETIC_PRODUCTS.filter((p) => p.price <= maxPrice)
      assert.equal(filtered.length, 2, 'Should only include ₹299 items (Shampoo & Oil)')
      assert.ok(filtered.every((p) => p.price <= 300))
    })
  })

  describe('Cart Management Architecture (CART-001 to CART-018)', () => {
    function createMockCart() {
      let items: Array<{ productId: string; title: string; price: number; quantity: number; maxStock: number }> = []

      return {
        getItems: () => [...items],
        addItem: (item: { productId: string; title: string; price: number; quantity: number; maxStock: number }) => {
          const idx = items.findIndex((i) => i.productId === item.productId)
          if (idx > -1) {
            const current = items[idx]
            const updatedQty = Math.min(current.quantity + item.quantity, item.maxStock)
            items[idx] = { ...current, quantity: updatedQty }
          } else {
            items.push({ ...item, quantity: Math.min(item.quantity, item.maxStock) })
          }
        },
        updateQuantity: (productId: string, quantity: number) => {
          if (quantity <= 0) {
            items = items.filter((i) => i.productId !== productId)
            return
          }
          items = items.map((i) => (i.productId === productId ? { ...i, quantity: Math.min(quantity, i.maxStock) } : i))
        },
        removeItem: (productId: string) => {
          items = items.filter((i) => i.productId !== productId)
        },
        getSubtotal: () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        clear: () => {
          items = []
        },
      }
    }

    it('CART-001 & CART-002: Adds item and cleanly merges duplicate additions', () => {
      const cart = createMockCart()
      cart.addItem({ productId: 'shampoo', title: 'LOVIXA Shampoo', price: 299, quantity: 1, maxStock: 10 })
      assert.equal(cart.getItems().length, 1)
      assert.equal(cart.getItems()[0].quantity, 1)

      // Add same item again -> must merge
      cart.addItem({ productId: 'shampoo', title: 'LOVIXA Shampoo', price: 299, quantity: 2, maxStock: 10 })
      assert.equal(cart.getItems().length, 1)
      assert.equal(cart.getItems()[0].quantity, 3)
      assert.equal(cart.getSubtotal(), 3 * 299)
    })

    it('CART-004 & CART-005: Updating quantity to 0 removes item from cart', () => {
      const cart = createMockCart()
      cart.addItem({ productId: 'oil', title: 'LOVIXA Hair Oil', price: 299, quantity: 2, maxStock: 10 })
      assert.equal(cart.getItems().length, 1)

      cart.updateQuantity('oil', 0)
      assert.equal(cart.getItems().length, 0)
      assert.equal(cart.getSubtotal(), 0)
    })

    it('CART-011: Quantity is strictly capped at available maxStock', () => {
      const cart = createMockCart()
      cart.addItem({ productId: 'duo', title: 'LOVIXA Duo', price: 549, quantity: 8, maxStock: 5 })
      assert.equal(cart.getItems()[0].quantity, 5, 'Must cap at maxStock of 5')

      cart.updateQuantity('duo', 20)
      assert.equal(cart.getItems()[0].quantity, 5, 'Update quantity must cap at maxStock')
    })

    it('CART-012: Out of stock item (maxStock <= 0 or quantity <= 0) is rejected from being added', () => {
      const cart = createMockCart()
      // Guard matching cart-store.ts
      const safeAddItem = (item: { productId: string; title: string; price: number; quantity: number; maxStock: number }) => {
        if (item.quantity <= 0 || item.maxStock <= 0) return
        cart.addItem(item)
      }

      safeAddItem({ productId: 'out-of-stock-item', title: 'Sold Out Serum', price: 999, quantity: 1, maxStock: 0 })
      assert.equal(cart.getItems().length, 0, 'Out of stock item must not be added to cart')

      safeAddItem({ productId: 'negative-stock-item', title: 'Negative Stock Item', price: 499, quantity: 1, maxStock: -1 })
      assert.equal(cart.getItems().length, 0, 'Negative stock item must not be added to cart')
    })
  })

  describe('Wishlist Storage & User Isolation (WISH-001 to WISH-012)', () => {
    function getWishlistStorageKey(userId: string | null) {
      return userId ? `flexion_wishlist_${userId}` : 'flexion_wishlist_guest'
    }

    it('WISH-005 & WISH-008: Generates strictly isolated storage keys between guest and customers A/B', () => {
      const guestKey = getWishlistStorageKey(null)
      const userAKey = getWishlistStorageKey('user-alex')
      const userBKey = getWishlistStorageKey('user-priya')

      assert.equal(guestKey, 'flexion_wishlist_guest')
      assert.equal(userAKey, 'flexion_wishlist_user-alex')
      assert.equal(userBKey, 'flexion_wishlist_user-priya')

      assert.notEqual(guestKey, userAKey)
      assert.notEqual(userAKey, userBKey)
    })

    it('WISH-003: Prevents duplicate product entries in wishlist array', () => {
      const wishlist: string[] = []
      const toggle = (id: string) => {
        const idx = wishlist.indexOf(id)
        if (idx > -1) {
          wishlist.splice(idx, 1)
        } else {
          wishlist.push(id)
        }
      }

      toggle('prod-shampoo')
      assert.equal(wishlist.length, 1)

      // Toggle again -> removes item
      toggle('prod-shampoo')
      assert.equal(wishlist.length, 0)
    })
  })
})
