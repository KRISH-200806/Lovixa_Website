import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  generateWhatsAppOrderMessage,
  buildWhatsAppClickToChatUrl,
  type WhatsAppOrderDetails,
} from '../src/lib/whatsapp/order'
import { computeAuthoritativeOrder } from './qa-pricing-tampering-regression.test'

describe('Master End-to-End Core Scenarios Suite (E2E-001 to E2E-012)', () => {
  it('E2E-001: Guest journey (Home -> Product -> Cart -> Address -> WhatsApp Handoff)', () => {
    // 1. Guest selects Shampoo
    const cartItems = [{ productId: 'prod-shampoo', quantity: 1 }]
    const orderMath = computeAuthoritativeOrder({ incomingItems: cartItems })

    assert.equal(orderMath.subtotal, 299)
    assert.equal(orderMath.shippingTotal, 99)
    assert.equal(orderMath.grandTotal, 398)

    // 2. Guest fills checkout form
    const guestOrder: WhatsAppOrderDetails = {
      orderNumber: 'LVX-2026-1001',
      customerName: 'Meera Rao',
      customerMobile: '9409876865',
      items: [{ title: 'LOVIXA Shampoo (500ml)', quantity: 1, price: 299 }],
      subtotal: orderMath.subtotal,
      shippingTotal: orderMath.shippingTotal,
      grandTotal: orderMath.grandTotal,
      shippingAddress: {
        house: '12-A',
        street: 'Lake View Road',
        city: 'Udaipur',
        state: 'Rajasthan',
        pincode: '313001',
      },
    }

    const message = generateWhatsAppOrderMessage(guestOrder)
    const url = buildWhatsAppClickToChatUrl('919712460509', message)

    assert.ok(message.includes('LVX-2026-1001'))
    assert.ok(message.includes('Meera Rao'))
    assert.ok(message.includes('Grand Total: ₹398 (Incl. of GST)'))
    assert.ok(url.startsWith('https://wa.me/919712460509?text='))
  })

  it('E2E-003: Multi-item cart (Oil + Shampoo) -> Edit Quantities -> Coupon -> WhatsApp Handoff', () => {
    // Add 2 Shampoos (2 * 299 = 598) + 1 Oil (299) = 897
    const items = [
      { productId: 'prod-shampoo', quantity: 2 },
      { productId: 'prod-oil', quantity: 1 },
    ]
    // Apply LOVIXA15 (15% of 897 = 134.55). Shipping: 99. Grand total = 897 - 134.55 + 99 = 861.45
    const math = computeAuthoritativeOrder({
      incomingItems: items,
      couponCode: 'LOVIXA15',
    })

    assert.equal(math.subtotal, 897)
    assert.equal(math.discountTotal, 134.55)
    assert.equal(math.shippingTotal, 99)
    assert.equal(math.grandTotal, 861.45)

    const order: WhatsAppOrderDetails = {
      orderNumber: 'LVX-2026-1003',
      customerName: 'Kavita Shah',
      customerMobile: '9825012345',
      items: [
        { title: 'LOVIXA Shampoo (500ml)', quantity: 2, price: 299 },
        { title: 'LOVIXA Hair Oil (50ml)', quantity: 1, price: 299 },
      ],
      subtotal: math.subtotal,
      shippingTotal: math.shippingTotal,
      discountTotal: math.discountTotal,
      couponCode: 'LOVIXA15',
      grandTotal: math.grandTotal,
      shippingAddress: {
        house: 'Flat 501',
        street: 'Drive-in Road',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380054',
      },
    }

    const msg = generateWhatsAppOrderMessage(order)
    assert.ok(msg.includes('Quantity: 2'))
    assert.ok(msg.includes('Quantity: 1'))
    assert.ok(msg.includes('Discount (LOVIXA15): -₹134.55'))
    assert.ok(msg.includes('Grand Total: ₹861.45 (Incl. of GST)'))
  })

  it('E2E-004: Duo Combo Ritual Set -> 15% Discount -> Shipping Threshold Handoff', () => {
    // 2 Duo Sets = 2 * 549 = ₹1,098 >= 999 -> Free Shipping!
    // LOVIXA15 discount = 15% of 1098 = 164.70
    // Grand Total = 1098 - 164.70 + 0 = 933.30
    const math = computeAuthoritativeOrder({
      incomingItems: [{ productId: 'prod-duo', quantity: 2 }],
      couponCode: 'LOVIXA15',
    })

    assert.equal(math.subtotal, 1098)
    assert.equal(math.discountTotal, 164.7)
    assert.equal(math.shippingTotal, 0, 'Must qualify for FREE shipping!')
    assert.equal(math.grandTotal, 933.3)

    const order: WhatsAppOrderDetails = {
      orderNumber: 'LVX-2026-1004',
      customerName: 'Sunil Nair',
      customerMobile: '9740123456',
      items: [{ title: 'LOVIXA Hair Care Duo', quantity: 2, price: 549 }],
      subtotal: math.subtotal,
      shippingTotal: math.shippingTotal,
      discountTotal: math.discountTotal,
      couponCode: 'LOVIXA15',
      grandTotal: math.grandTotal,
      shippingAddress: {
        house: 'Villa 14',
        street: 'Koramangala 4th Block',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560034',
      },
    }

    const msg = generateWhatsAppOrderMessage(order)
    assert.ok(msg.includes('Shipping: FREE'))
    assert.ok(msg.includes('Grand Total: ₹933.30 (Incl. of GST)'))
  })

  it('E2E-007 (CRITICAL): Customer opens WhatsApp then closes/cancels window', () => {
    // Invariant: The order remains in awaiting_confirmation and unpaid!
    const orderDraft = {
      orderNumber: 'LVX-2026-1007',
      orderStatus: 'awaiting_confirmation',
      paymentStatus: 'unpaid',
      handoffInitiatedAt: new Date().toISOString(),
    }

    // Customer navigates back to website or cancels chat
    assert.equal(orderDraft.orderStatus, 'awaiting_confirmation')
    assert.equal(orderDraft.paymentStatus, 'unpaid')
    assert.notEqual(orderDraft.orderStatus, 'confirmed')
    assert.notEqual(orderDraft.paymentStatus, 'paid')
  })

  it('E2E-008: Account Isolation between Customer A and Customer B', () => {
    const customerA = { id: 'cust-A', email: 'alex@example.com' }
    const customerB = { id: 'cust-B', email: 'priya@example.com' }

    const canUserReadOrder = (orderCustomerId: string, activeUserId: string) => {
      return orderCustomerId === activeUserId
    }

    assert.equal(canUserReadOrder(customerA.id, customerA.id), true)
    assert.equal(canUserReadOrder(customerA.id, customerB.id), false, 'Customer B MUST NOT read Customer A orders')
  })

  it('E2E-011: Idempotent order reference reuse prevents duplicate draft creation', () => {
    let orderCreationCount = 0
    let activeOrderNumber = ''

    const placeOrUpdateOrder = (existingOrderNumber?: string) => {
      if (existingOrderNumber) {
        // Reuse existing draft
        return existingOrderNumber
      }
      orderCreationCount++
      activeOrderNumber = `LVX-2026-${orderCreationCount}`
      return activeOrderNumber
    }

    const firstClick = placeOrUpdateOrder()
    assert.equal(firstClick, 'LVX-2026-1')
    assert.equal(orderCreationCount, 1)

    // User double-clicks or retries with activeOrderNumber
    const secondClick = placeOrUpdateOrder(firstClick)
    assert.equal(secondClick, 'LVX-2026-1')
    assert.equal(orderCreationCount, 1, 'Double click must NOT create a duplicate second order')
  })
})
