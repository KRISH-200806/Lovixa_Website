import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

interface MockInventoryItem {
  id: string
  title: string
  stock: number
  trackInventory: boolean
}

function checkStock(items: Array<{ id: string; qty: number }>, inventoryDb: Map<string, MockInventoryItem>) {
  for (const item of items) {
    const record = inventoryDb.get(item.id)
    if (!record) continue
    if (record.trackInventory && record.stock < item.qty) {
      return { valid: false, error: `Item "${record.title}" is out of stock (only ${record.stock} available)` }
    }
  }
  return { valid: true }
}

function decrementStock(items: Array<{ id: string; qty: number }>, inventoryDb: Map<string, MockInventoryItem>) {
  for (const item of items) {
    const record = inventoryDb.get(item.id)
    if (record && record.trackInventory) {
      record.stock = Math.max(0, record.stock - item.qty)
    }
  }
}

describe('Atomic Inventory Validation & Decrementing Lifecycle', () => {
  it('permits orders when stock is sufficient', () => {
    const db = new Map<string, MockInventoryItem>()
    db.set('prod_1', { id: 'prod_1', title: 'Premium Hoodie', stock: 10, trackInventory: true })

    const result = checkStock([{ id: 'prod_1', qty: 2 }], db)
    assert.equal(result.valid, true)
  })

  it('blocks checkout when requested quantity exceeds stock', () => {
    const db = new Map<string, MockInventoryItem>()
    db.set('prod_1', { id: 'prod_1', title: 'Limited Sneakers', stock: 1, trackInventory: true })

    const result = checkStock([{ id: 'prod_1', qty: 5 }], db)
    assert.equal(result.valid, false)
    assert.match(result.error || '', /only 1 available/)
  })

  it('atomically decrements stock upon order confirmation', () => {
    const db = new Map<string, MockInventoryItem>()
    db.set('prod_1', { id: 'prod_1', title: 'Leather Wallet', stock: 20, trackInventory: true })

    decrementStock([{ id: 'prod_1', qty: 3 }], db)
    assert.equal(db.get('prod_1')?.stock, 17)

    decrementStock([{ id: 'prod_1', qty: 17 }], db)
    assert.equal(db.get('prod_1')?.stock, 0)
  })
})
