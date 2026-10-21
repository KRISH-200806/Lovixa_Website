import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

interface CartItem {
  productId: string
  variantId?: string
  title: string
  price: number
  quantity: number
  maxStock: number
}

interface ShippingConfig {
  flatRate: number
  freeShippingThreshold: number
  freeShippingEnabled: boolean
}

function createCartManager() {
  let items: CartItem[] = []
  let shippingConfig: ShippingConfig = {
    flatRate: 9.99,
    freeShippingThreshold: 100,
    freeShippingEnabled: true,
  }

  return {
    getItems: () => [...items],
    setShippingConfig: (cfg: Partial<ShippingConfig>) => {
      shippingConfig = { ...shippingConfig, ...cfg }
    },
    addItem: (newItem: CartItem) => {
      const idx = items.findIndex(
        (i) => i.productId === newItem.productId && i.variantId === newItem.variantId
      )
      if (idx > -1) {
        const cur = items[idx]
        items[idx] = {
          ...cur,
          quantity: Math.min(cur.quantity + newItem.quantity, newItem.maxStock),
        }
      } else {
        items.push(newItem)
      }
    },
    removeItem: (productId: string, variantId?: string) => {
      items = items.filter(
        (i) => !(i.productId === productId && i.variantId === variantId)
      )
    },
    getSubtotal: () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    getShippingFee: () => {
      const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      if (subtotal === 0) return 0
      if (shippingConfig.freeShippingEnabled && subtotal >= shippingConfig.freeShippingThreshold) {
        return 0
      }
      return shippingConfig.flatRate
    },
    clear: () => {
      items = []
    },
  }
}

describe('Cart Persistence & Dynamic Shipping Engine', () => {
  it('adds items, updates quantities respecting maxStock', () => {
    const cart = createCartManager()
    cart.addItem({ productId: 'p1', title: 'Product 1', price: 20, quantity: 2, maxStock: 5 })
    assert.equal(cart.getItems().length, 1)
    assert.equal(cart.getItems()[0].quantity, 2)
    assert.equal(cart.getSubtotal(), 40)

    cart.addItem({ productId: 'p1', title: 'Product 1', price: 20, quantity: 4, maxStock: 5 })
    assert.equal(cart.getItems()[0].quantity, 5) // Capped at maxStock 5
    assert.equal(cart.getSubtotal(), 100)
  })

  it('dynamically adapts shipping fee to admin flatRate settings', () => {
    const cart = createCartManager()
    cart.addItem({ productId: 'p1', title: 'Item', price: 20, quantity: 1, maxStock: 10 })

    // Default flat rate $9.99
    assert.equal(cart.getShippingFee(), 9.99)

    // Admin changes flatRate to $2.00
    cart.setShippingConfig({ flatRate: 2.0 })
    assert.equal(cart.getShippingFee(), 2.0)
  })

  it('applies free shipping when subtotal reaches threshold', () => {
    const cart = createCartManager()
    cart.setShippingConfig({ flatRate: 2.0, freeShippingThreshold: 100, freeShippingEnabled: true })

    cart.addItem({ productId: 'p1', title: 'Item', price: 50, quantity: 1, maxStock: 10 })
    assert.equal(cart.getShippingFee(), 2.0) // $50 < $100

    cart.addItem({ productId: 'p2', title: 'Item 2', price: 60, quantity: 1, maxStock: 10 })
    assert.equal(cart.getSubtotal(), 110)
    assert.equal(cart.getShippingFee(), 0) // $110 >= $100 -> Free Shipping
  })
})
