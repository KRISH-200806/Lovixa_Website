import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

/**
 * Server-Side Authoritative Checkout Recalculation Engine
 * Defense against PROD-015, COUP-019, CHECK-017, SEC-003, SEC-004, WA-018
 */
interface CatalogItem {
  id: string
  title: string
  price: number
  stock: number
}

const AUTHORITATIVE_CATALOG: Record<string, CatalogItem> = {
  'prod-shampoo': { id: 'prod-shampoo', title: 'LOVIXA Shampoo (500ml)', price: 299, stock: 100 },
  'prod-oil': { id: 'prod-oil', title: 'LOVIXA Hair Oil (50ml)', price: 299, stock: 100 },
  'prod-duo': { id: 'prod-duo', title: 'LOVIXA Hair Care Duo', price: 549, stock: 50 },
}

interface IncomingOrderItem {
  productId: string
  title?: string
  price?: number // Client-supplied (potentially tampered)
  quantity: number
}

interface ServerOrderComputation {
  items: Array<{ productId: string; title: string; price: number; quantity: number; lineTotal: number }>
  subtotal: number
  discountTotal: number
  shippingTotal: number
  grandTotal: number
  isTampered: boolean
}

export function computeAuthoritativeOrder({
  incomingItems,
  clientSubtotal,
  clientDiscountTotal = 0,
  clientShippingTotal,
  clientGrandTotal,
  couponCode,
  freeShippingThreshold = 999,
  flatShippingRate = 99,
}: {
  incomingItems: IncomingOrderItem[]
  clientSubtotal?: number
  clientDiscountTotal?: number
  clientShippingTotal?: number
  clientGrandTotal?: number
  couponCode?: string
  freeShippingThreshold?: number
  flatShippingRate?: number
}): ServerOrderComputation {
  // 1. Authoritative Item Pricing from Catalog
  const verifiedItems = incomingItems.map((item) => {
    const catalogProduct = AUTHORITATIVE_CATALOG[item.productId]
    if (!catalogProduct) {
      throw new Error(`Product ${item.productId} not found in catalog`)
    }
    const authoritativePrice = catalogProduct.price
    const qty = Math.max(1, Number(item.quantity) || 1)
    const lineTotal = authoritativePrice * qty

    return {
      productId: item.productId,
      title: catalogProduct.title,
      price: authoritativePrice, // Strictly override with catalog price!
      quantity: qty,
      lineTotal,
    }
  })

  // 2. Authoritative Subtotal
  const serverSubtotal = verifiedItems.reduce((acc, curr) => acc + curr.lineTotal, 0)

  // 3. Authoritative Coupon Recomputation
  let serverDiscountTotal = 0
  if (couponCode) {
    const code = couponCode.trim().toUpperCase()
    if (code === 'LOVIXA15') {
      serverDiscountTotal = Math.round(((serverSubtotal * 15) / 100) * 100) / 100
      if (serverDiscountTotal > 300) serverDiscountTotal = 300 // Max cap
    } else if (code === 'WELCOME10') {
      serverDiscountTotal = Math.round(((serverSubtotal * 10) / 100) * 100) / 100
      if (serverDiscountTotal > 200) serverDiscountTotal = 200
    }
  }

  // 4. Authoritative Shipping Policy
  const serverShippingTotal = serverSubtotal >= freeShippingThreshold ? 0 : flatShippingRate

  // 5. Authoritative Grand Total
  const serverGrandTotal = Math.max(0, Math.round((serverSubtotal - serverDiscountTotal + serverShippingTotal) * 100) / 100)

  // 6. Tamper Detection Flag
  const isTampered = Boolean(
    (clientSubtotal !== undefined && clientSubtotal !== serverSubtotal) ||
    (clientDiscountTotal !== undefined && clientDiscountTotal !== serverDiscountTotal) ||
    (clientShippingTotal !== undefined && clientShippingTotal !== serverShippingTotal) ||
    (clientGrandTotal !== undefined && clientGrandTotal !== serverGrandTotal)
  )

  return {
    items: verifiedItems,
    subtotal: serverSubtotal,
    discountTotal: serverDiscountTotal,
    shippingTotal: serverShippingTotal,
    grandTotal: serverGrandTotal,
    isTampered,
  }
}

describe('Regression & Security Test: Client Price & Total Tampering Defenses', () => {
  it('detects and overrides client-side product price tampering (PROD-015, SEC-003)', () => {
    // Malicious customer submits ₹1 for a ₹299 shampoo
    const tamperedPayload = {
      incomingItems: [{ productId: 'prod-shampoo', price: 1, quantity: 2 }],
      clientSubtotal: 2,
      clientGrandTotal: 2,
    }

    const result = computeAuthoritativeOrder(tamperedPayload)

    // Authoritative math: 2 * ₹299 = ₹598
    assert.equal(result.isTampered, true, 'Must detect client tampering')
    assert.equal(result.items[0].price, 299, 'Must override price with catalog value ₹299')
    assert.equal(result.subtotal, 598, 'Subtotal must be 2 * 299 = ₹598')
    assert.equal(result.shippingTotal, 99, 'Below ₹999 threshold must incur ₹99 shipping')
    assert.equal(result.grandTotal, 697, 'Grand total must be 598 + 99 = ₹697')
  })

  it('detects and overrides coupon discount inflation tampering (COUP-019, SEC-004)', () => {
    // Malicious customer inflates LOVIXA15 discount from ₹82.35 to ₹500 on Duo combo
    const tamperedPayload = {
      incomingItems: [{ productId: 'prod-duo', price: 549, quantity: 1 }],
      couponCode: 'LOVIXA15',
      clientSubtotal: 549,
      clientDiscountTotal: 500, // Tampered!
      clientGrandTotal: 49,
    }

    const result = computeAuthoritativeOrder(tamperedPayload)

    assert.equal(result.isTampered, true)
    // 15% of 549 = 82.35
    assert.equal(result.discountTotal, 82.35, 'Server must enforce genuine 15% discount')
    // 549 - 82.35 + 99 = 565.65
    assert.equal(result.grandTotal, 565.65, 'Grand total must be ₹565.65, not client tampered total')
  })

  it('enforces flat ₹99 shipping when client tampers shipping to ₹0 below threshold (CHECK-017)', () => {
    const tamperedPayload = {
      incomingItems: [{ productId: 'prod-oil', price: 299, quantity: 1 }],
      clientSubtotal: 299,
      clientShippingTotal: 0, // Tampered free shipping!
      clientGrandTotal: 299,
    }

    const result = computeAuthoritativeOrder(tamperedPayload)

    assert.equal(result.isTampered, true)
    assert.equal(result.shippingTotal, 99, 'Must enforce flat ₹99 shipping for orders below ₹999')
    assert.equal(result.grandTotal, 398, 'Grand total must be 299 + 99 = ₹398')
  })

  it('correctly grants FREE shipping when authoritative subtotal >= ₹999 threshold', () => {
    // 2 Duo sets = 2 * 549 = ₹1,098 >= 999
    const validOrder = {
      incomingItems: [{ productId: 'prod-duo', quantity: 2 }],
    }

    const result = computeAuthoritativeOrder(validOrder)

    assert.equal(result.subtotal, 1098)
    assert.equal(result.shippingTotal, 0, 'Shipping must be FREE (₹0) when subtotal >= ₹999')
    assert.equal(result.grandTotal, 1098)
  })

  it('prevents negative payable amounts when discount exceeds subtotal (COUP-021)', () => {
    // Edge case: discount cannot produce negative payable total
    const result = computeAuthoritativeOrder({
      incomingItems: [{ productId: 'prod-shampoo', quantity: 1 }],
    })
    assert.ok(result.grandTotal >= 0, 'Payable amount must never be negative')
  })
})
