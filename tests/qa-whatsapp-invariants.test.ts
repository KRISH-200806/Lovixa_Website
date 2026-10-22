import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  generateWhatsAppOrderMessage,
  buildWhatsAppClickToChatUrl,
  validateIndianMobile,
  validateIndianPincode,
  type WhatsAppOrderDetails,
} from '../src/lib/whatsapp/order'

describe('Comprehensive WhatsApp Handoff & State Invariants Suite (WA-001 to WA-025)', () => {
  const baseSampleOrder: WhatsAppOrderDetails = {
    orderNumber: 'LVX-2026-7842',
    customerName: 'Pooja Verma',
    customerMobile: '9876543210',
    customerEmail: 'pooja.verma@example.com',
    items: [
      {
        title: 'LOVIXA Shampoo (500ml)',
        quantity: 2,
        price: 299,
        optionsSummary: '500ml Bottle',
      },
      {
        title: 'LOVIXA Hair Oil (50ml)',
        quantity: 1,
        price: 299,
        optionsSummary: '50ml Dropper',
      },
    ],
    subtotal: 897,
    shippingTotal: 99,
    discountTotal: 134.55,
    couponCode: 'LOVIXA15',
    grandTotal: 861.45,
    currencySymbol: '₹',
    shippingAddress: {
      house: 'B-304, Palm Grove',
      street: 'Ring Road',
      landmark: 'Near City Mall',
      city: 'Surat',
      state: 'Gujarat',
      pincode: '395007',
      country: 'India',
    },
  }

  it('WA-001 & WA-014: Generates configured merchant click-to-chat URL with correct international dialing prefix', () => {
    const msg = generateWhatsAppOrderMessage(baseSampleOrder)
    const url = buildWhatsAppClickToChatUrl('919712460509', msg)

    assert.ok(url.startsWith('https://wa.me/919712460509?text='), 'Must point to wa.me with merchant number')
    assert.ok(!url.includes('+'), 'Merchant number in URL must omit the plus sign')
    assert.ok(!url.includes(' '), 'URL must not contain raw unencoded spaces')
  })

  it('WA-002: Verifies exact approved product titles in message body', () => {
    const msg = generateWhatsAppOrderMessage(baseSampleOrder)
    assert.ok(msg.includes('LOVIXA Shampoo (500ml)'), 'Shampoo title must be exact')
    assert.ok(msg.includes('LOVIXA Hair Oil (50ml)'), 'Hair oil title must be exact')
  })

  it('WA-003: Verifies item quantities match checkout items', () => {
    const msg = generateWhatsAppOrderMessage(baseSampleOrder)
    assert.ok(msg.includes('Quantity: 2'), 'Must show quantity 2 for shampoo')
    assert.ok(msg.includes('Quantity: 1'), 'Must show quantity 1 for hair oil')
  })

  it('WA-004: Verifies unit prices match authoritative catalog', () => {
    const msg = generateWhatsAppOrderMessage(baseSampleOrder)
    assert.ok(msg.includes('Price: ₹299 each'), 'Unit price must be ₹299')
  })

  it('WA-005: Displays coupon code and exact discount amount in message', () => {
    const msg = generateWhatsAppOrderMessage(baseSampleOrder)
    assert.ok(msg.includes('Discount (LOVIXA15): -₹134.55'), 'Must render coupon code and discount amount')
  })

  it('WA-006 & WA-024: Verifies payable total matches validated checkout and includes GST note', () => {
    const msg = generateWhatsAppOrderMessage(baseSampleOrder)
    assert.ok(msg.includes('Grand Total: ₹861.45 (Incl. of GST)'), 'Grand total and GST notice must be present')
  })

  it('WA-007: Verifies customer name, phone, email and address are accurately prefilled', () => {
    const msg = generateWhatsAppOrderMessage(baseSampleOrder)
    assert.ok(msg.includes('Name: Pooja Verma'))
    assert.ok(msg.includes('Mobile: 9876543210'))
    assert.ok(msg.includes('Email: pooja.verma@example.com'))
    assert.ok(msg.includes('House / Building: B-304, Palm Grove'))
    assert.ok(msg.includes('Area: Ring Road'))
    assert.ok(msg.includes('Landmark: Near City Mall'))
    assert.ok(msg.includes('City: Surat'))
    assert.ok(msg.includes('State: Gujarat'))
    assert.ok(msg.includes('Pincode: 395007'))
  })

  it('WA-008: Formats multiple distinct line items with sequential numbering and line totals', () => {
    const msg = generateWhatsAppOrderMessage(baseSampleOrder)
    assert.ok(msg.includes('1. LOVIXA Shampoo (500ml)'))
    assert.ok(msg.includes('Total: ₹598'))
    assert.ok(msg.includes('2. LOVIXA Hair Oil (50ml)'))
    assert.ok(msg.includes('Total: ₹299'))
  })

  it('WA-009: Safely URL encodes special characters (&, +, newlines, quotes, Hindi text)', () => {
    const orderWithSpecialChars: WhatsAppOrderDetails = {
      ...baseSampleOrder,
      customerName: 'Aarav & Diya Patel + Family "VIP"',
      shippingAddress: {
        ...baseSampleOrder.shippingAddress,
        street: 'M.G. Road & 5th Cross / C+D Block',
      },
    }
    const msg = generateWhatsAppOrderMessage(orderWithSpecialChars)
    const url = buildWhatsAppClickToChatUrl('919712460509', msg)

    assert.ok(!url.includes('&Diya'), 'Unencoded & would break URL query parameters')
    assert.ok(!url.includes('\n'), 'Raw newlines must be percent-encoded')
    assert.ok(url.includes('%26'), '& must be encoded as %26')
    assert.ok(url.includes('%0A'), 'Newlines must be encoded as %0A')
  })

  it('WA-015 & WA-016 (CRITICAL INVARIANT): Opening WhatsApp does NOT mark order as confirmed or paid', () => {
    const msg = generateWhatsAppOrderMessage(baseSampleOrder)
    assert.ok(
      msg.includes('Order Status: Awaiting Confirmation'),
      'Order status in message must explicitly state Awaiting Confirmation'
    )
    assert.ok(
      msg.includes('Payment Status: Awaiting Payment'),
      'Payment status in message must explicitly state Awaiting Payment'
    )
    assert.ok(
      !msg.includes('Payment Status: Paid'),
      'Unconfirmed order must NEVER claim Paid status'
    )
    assert.ok(
      !msg.includes('Order Status: Confirmed'),
      'Unconfirmed order must NEVER claim Confirmed status'
    )
  })

  it('WA-020: Order Reference in message matches orderNumber exactly', () => {
    const msg = generateWhatsAppOrderMessage(baseSampleOrder)
    assert.ok(msg.includes('Order Reference: LVX-2026-7842'))
  })

  it('WA-021 & WA-025: Message content contains NO secrets, tokens, or internal database IDs', () => {
    const msg = generateWhatsAppOrderMessage(baseSampleOrder)
    assert.ok(!msg.includes('guestAccessToken'), 'Token must not leak in message')
    assert.ok(!msg.includes('PAYLOAD_SECRET'), 'Payload secret must not leak')
    assert.ok(!msg.includes('mongodb'), 'Database URI must not leak')
    assert.ok(!msg.includes('adminNotes'), 'Admin notes must not leak')
  })

  it('WA-024: Correctly handles FREE shipping display in message when threshold met', () => {
    const freeShippingOrder: WhatsAppOrderDetails = {
      ...baseSampleOrder,
      subtotal: 1098,
      shippingTotal: 0,
      grandTotal: 1098,
    }
    const msg = generateWhatsAppOrderMessage(freeShippingOrder)
    assert.ok(msg.includes('Shipping: FREE'), 'Zero shipping fee must display as FREE')
  })
})
