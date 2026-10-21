import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

interface WishlistItem {
  productId: string
  title: string
  slug: string
  price: number
}

function createWishlistManager() {
  let items: WishlistItem[] = []

  return {
    getItems: () => [...items],
    toggleItem: (item: WishlistItem) => {
      const exists = items.some((i) => i.productId === item.productId)
      if (exists) {
        items = items.filter((i) => i.productId !== item.productId)
      } else {
        items.push(item)
      }
    },
    removeItem: (productId: string) => {
      items = items.filter((i) => i.productId !== productId)
    },
    isInWishlist: (productId: string) => {
      return items.some((i) => i.productId === productId)
    },
    clear: () => {
      items = []
    },
  }
}

describe('Wishlist State Management Engine', () => {
  it('toggles items into and out of the wishlist', () => {
    const manager = createWishlistManager()
    const item: WishlistItem = {
      productId: 'prod_123',
      title: 'Ergonomic Chair',
      slug: 'ergonomic-chair',
      price: 299,
    }

    assert.equal(manager.isInWishlist('prod_123'), false)

    // Add
    manager.toggleItem(item)
    assert.equal(manager.isInWishlist('prod_123'), true)
    assert.equal(manager.getItems().length, 1)

    // Remove via toggle
    manager.toggleItem(item)
    assert.equal(manager.isInWishlist('prod_123'), false)
    assert.equal(manager.getItems().length, 0)
  })

  it('removes specific items by ID', () => {
    const manager = createWishlistManager()
    manager.toggleItem({ productId: 'p1', title: 'Item 1', slug: 'i1', price: 10 })
    manager.toggleItem({ productId: 'p2', title: 'Item 2', slug: 'i2', price: 20 })

    assert.equal(manager.getItems().length, 2)
    manager.removeItem('p1')
    assert.equal(manager.getItems().length, 1)
    assert.equal(manager.isInWishlist('p1'), false)
    assert.equal(manager.isInWishlist('p2'), true)
  })

  it('clears all wishlist items', () => {
    const manager = createWishlistManager()
    manager.toggleItem({ productId: 'p1', title: 'Item 1', slug: 'i1', price: 10 })
    manager.toggleItem({ productId: 'p2', title: 'Item 2', slug: 'i2', price: 20 })

    manager.clear()
    assert.equal(manager.getItems().length, 0)
  })
})
