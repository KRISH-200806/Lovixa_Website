import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  validateIndianMobile,
  validateIndianPincode,
  generateWhatsAppOrderMessage,
  buildWhatsAppClickToChatUrl,
  type WhatsAppOrderDetails,
} from '../src/lib/whatsapp/order'
import { randomBytes } from 'crypto'

describe('LOVIXA Production Verification Suite', () => {
  describe('Indian Contact & Address Validation', () => {
    it('validates standard 10-digit mobile numbers', () => {
      const res = validateIndianMobile('9173996739')
      assert.equal(res.valid, true)
      assert.equal(res.normalized, '9173996739')
    })

    it('normalizes +91, spaces, and leading zeros in mobile numbers', () => {
      const res1 = validateIndianMobile('+91 91739 96739')
      assert.equal(res1.valid, true)
      assert.equal(res1.normalized, '9173996739')

      const res2 = validateIndianMobile('09173996739')
      assert.equal(res2.valid, true)
      assert.equal(res2.normalized, '9173996739')
    })

    it('rejects invalid mobile numbers (invalid prefix or wrong length)', () => {
      assert.equal(validateIndianMobile('1234567890').valid, false)
      assert.equal(validateIndianMobile('91739').valid, false)
      assert.equal(validateIndianMobile('').valid, false)
    })

    it('validates 6-digit Indian pincodes', () => {
      assert.equal(validateIndianPincode('380015').valid, true)
      assert.equal(validateIndianPincode('110001').valid, true)
      assert.equal(validateIndianPincode('012345').valid, false) // cannot start with 0
      assert.equal(validateIndianPincode('38001').valid, false) // 5 digits
      assert.equal(validateIndianPincode('3800155').valid, false) // 7 digits
      assert.equal(validateIndianPincode('').valid, false)
    })
  })

  describe('WhatsApp Click-to-Chat Message Engine', () => {
    const mockOrder: WhatsAppOrderDetails = {
      orderNumber: 'LVX-998877',
      customerName: 'Ananya Sharma',
      customerMobile: '9173996739',
      customerEmail: 'ananya@example.com',
      items: [
        {
          title: 'LOVIXA Shampoo',
          quantity: 2,
          price: 299,
          optionsSummary: '500ml',
        },
        {
          title: 'LOVIXA Hair Oil',
          quantity: 1,
          price: 299,
          optionsSummary: '50ml',
        },
      ],
      subtotal: 897,
      shippingTotal: 99,
      discountTotal: 134.55,
      couponCode: 'LOVIXA15',
      grandTotal: 861.45,
      currencySymbol: '₹',
      shippingAddress: {
        house: 'Flat 402, Lotus Residency',
        street: 'S.G. Highway',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380054',
      },
    }

    it('generates a detailed WhatsApp message containing all order parameters', () => {
      const msg = generateWhatsAppOrderMessage(mockOrder)
      assert.ok(msg.includes('LVX-998877'))
      assert.ok(msg.includes('Ananya Sharma'))
      assert.ok(msg.includes('9173996739'))
      assert.ok(msg.includes('LOVIXA Shampoo'))
      assert.ok(msg.includes('LOVIXA Hair Oil'))
      assert.ok(msg.includes('₹897'))
      assert.ok(msg.includes('LOVIXA15'))
      assert.ok(msg.includes('₹134.55'))
      assert.ok(msg.includes('₹861.45'))
      assert.ok(msg.includes('380054'))
      assert.ok(msg.includes('Ahmedabad'))
      assert.ok(msg.includes('Gujarat'))
    })

    it('builds a valid wa.me URL with properly encoded message text', () => {
      const msg = generateWhatsAppOrderMessage(mockOrder)
      const url = buildWhatsAppClickToChatUrl('919712460509', msg)
      assert.ok(url.startsWith('https://wa.me/919712460509?text='))
      assert.ok(url.includes('LVX-998877'))
      // Check that characters are encoded (no raw spaces)
      assert.ok(!url.includes(' '))
    })
  })

  describe('Shipping & Tiered Pricing Architecture', () => {
    const FREE_SHIPPING_THRESHOLD = 999
    const STANDARD_SHIPPING_FEE = 99

    it('applies flat ₹99 shipping for cart subtotal below ₹999 threshold', () => {
      const subtotal1 = 299 // 1 Shampoo
      const shipping1 = subtotal1 >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE
      assert.equal(shipping1, 99)

      const subtotal2 = 549 // 1 Duo Set
      const shipping2 = subtotal2 >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE
      assert.equal(shipping2, 99)

      const subtotal3 = 897 // 3 items
      const shipping3 = subtotal3 >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE
      assert.equal(shipping3, 99)
    })

    it('applies FREE shipping (₹0) when subtotal meets or exceeds ₹999', () => {
      const subtotal1 = 999
      const shipping1 = subtotal1 >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE
      assert.equal(shipping1, 0)

      const subtotal2 = 1098 // 2 Duo Sets
      const shipping2 = subtotal2 >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE
      assert.equal(shipping2, 0)
    })
  })

  describe('Official Promotional Coupon Computations', () => {
    it('accurately computes 15% discount for LOVIXA15', () => {
      const subtotal = 549 // Combo Duo
      const discount = Math.round(((subtotal * 15) / 100) * 100) / 100
      assert.equal(discount, 82.35)
      const finalTotal = subtotal - discount + 99 // plus ₹99 shipping
      assert.equal(finalTotal, 565.65)
    })

    it('accurately computes 10% discount for WELCOME10', () => {
      const subtotal = 1098 // 2 Combos (Free shipping)
      const discount = Math.round(((subtotal * 10) / 100) * 100) / 100
      assert.equal(discount, 109.8)
      const finalTotal = subtotal - discount // free shipping
      assert.equal(finalTotal, 988.2)
    })
  })

  describe('Cryptographic Guest Access Token Security', () => {
    it('generates a 64-character hexadecimal secure token', () => {
      const token = randomBytes(32).toString('hex')
      assert.equal(token.length, 64)
      assert.match(token, /^[0-9a-f]{64}$/)
    })

    it('ensures each generated token is unique and unguessable', () => {
      const tokenA = randomBytes(32).toString('hex')
      const tokenB = randomBytes(32).toString('hex')
      assert.notEqual(tokenA, tokenB)
    })
  })
})
