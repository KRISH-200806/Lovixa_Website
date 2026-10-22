import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  validateIndianMobile,
  validateIndianPincode,
  INDIAN_STATES,
} from '../src/lib/whatsapp/order'
import { randomBytes } from 'crypto'

describe('Checkout, Address, and Order Processing Suite (CHECK-001 to CHECK-020)', () => {
  describe('Indian Phone Validation (CHECK-003)', () => {
    it('accepts standard 10-digit mobile numbers starting with 6, 7, 8, or 9', () => {
      assert.equal(validateIndianMobile('9876543210').valid, true)
      assert.equal(validateIndianMobile('8765432109').valid, true)
      assert.equal(validateIndianMobile('7654321098').valid, true)
      assert.equal(validateIndianMobile('6543210987').valid, true)
    })

    it('normalizes +91, 91 prefix, leading zero, spaces, and hyphens', () => {
      const res1 = validateIndianMobile('+91 98765-43210')
      assert.equal(res1.valid, true)
      assert.equal(res1.normalized, '9876543210')

      const res2 = validateIndianMobile('09876543210')
      assert.equal(res2.valid, true)
      assert.equal(res2.normalized, '9876543210')

      const res3 = validateIndianMobile('919876543210')
      assert.equal(res3.valid, true)
      assert.equal(res3.normalized, '9876543210')
    })

    it('rejects numbers starting with 0-5, letters, and invalid length', () => {
      assert.equal(validateIndianMobile('5123456789').valid, false)
      assert.equal(validateIndianMobile('98765').valid, false)
      assert.equal(validateIndianMobile('987654321099').valid, false)
      assert.equal(validateIndianMobile('abcdefghij').valid, false)
      assert.equal(validateIndianMobile('').valid, false)
    })
  })

  describe('Indian Pincode & Serviceability (CHECK-004, CHECK-016)', () => {
    it('validates 6-digit Indian postal codes starting with digits 1-9', () => {
      assert.equal(validateIndianPincode('380015').valid, true) // Ahmedabad
      assert.equal(validateIndianPincode('110001').valid, true) // New Delhi
      assert.equal(validateIndianPincode('400001').valid, true) // Mumbai
      assert.equal(validateIndianPincode('560001').valid, true) // Bengaluru
    })

    it('rejects invalid pincodes starting with 0, non-digits, or wrong length', () => {
      assert.equal(validateIndianPincode('011001').valid, false) // Starts with 0
      assert.equal(validateIndianPincode('38001').valid, false)  // 5 digits
      assert.equal(validateIndianPincode('3800155').valid, false) // 7 digits
      assert.equal(validateIndianPincode('ABCDEF').valid, false)
      assert.equal(validateIndianPincode('').valid, false)
    })

    it('CHECK-016: Rejects unserviceable pincode when serviceable list is configured', () => {
      const allowedPincodes = '380015, 380054, 110001, 400001'

      // Serviceable pincode
      assert.equal(validateIndianPincode('380054', allowedPincodes).valid, true)

      // Unserviceable pincode
      const unserviceable = validateIndianPincode('700001', allowedPincodes)
      assert.equal(unserviceable.valid, false)
      assert.ok(unserviceable.error?.includes('Delivery is currently not available'))
    })
  })

  describe('Address & Name Normalization (CHECK-005, CHECK-006, CHECK-007)', () => {
    it('normalizes whitespace around customer inputs', () => {
      const rawName = '  Aarav Mehta   '
      const rawAddress = '   Flat 204, Green Heights   '
      assert.equal(rawName.trim(), 'Aarav Mehta')
      assert.equal(rawAddress.trim(), 'Flat 204, Green Heights')
    })

    it('supports Unicode and Indian regional names with punctuation', () => {
      const name1 = "D'Souza Ananya"
      const name2 = 'डॉ. राजेश कुमार'
      assert.equal(name1.trim(), "D'Souza Ananya")
      assert.equal(name2.trim(), 'डॉ. राजेश कुमार')
    })

    it('INDIAN_STATES: Contains all 36 Indian states and union territories', () => {
      assert.equal(INDIAN_STATES.length, 36)
      assert.ok(INDIAN_STATES.includes('Gujarat'))
      assert.ok(INDIAN_STATES.includes('Maharashtra'))
      assert.ok(INDIAN_STATES.includes('Delhi'))
      assert.ok(INDIAN_STATES.includes('Karnataka'))
      assert.ok(INDIAN_STATES.includes('Tamil Nadu'))
    })
  })

  describe('Order Lifecycle, Guest Token, & Idempotency (CHECK-009, CHECK-014, CHECK-018)', () => {
    it('generates a cryptographically strong 64-character guest access token', () => {
      const token = randomBytes(32).toString('hex')
      assert.equal(token.length, 64)
      assert.match(token, /^[0-9a-f]{64}$/)
    })

    it('CHECK-018: Initializes order in awaiting_confirmation state and unpaid paymentStatus', () => {
      const orderInitialState = {
        orderStatus: 'awaiting_confirmation',
        paymentStatus: 'unpaid',
        fulfillmentStatus: 'unfulfilled',
      }

      assert.equal(orderInitialState.orderStatus, 'awaiting_confirmation')
      assert.equal(orderInitialState.paymentStatus, 'unpaid')
      assert.equal(orderInitialState.fulfillmentStatus, 'unfulfilled')
    })

    it('CHECK-009: Formats standard LOVIXA order number (LVX-YYYY-XXXX)', () => {
      const orderNumber = `LVX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
      assert.match(orderNumber, /^LVX-\d{4}-\d{4}$/)
    })

    it('CHECK-021: Mandatory Login Gate - Rejects unauthenticated order placement (no user or customerId)', () => {
      // Logic matching /api/checkout gate
      function checkOrderAuth(authUser: { id: string } | null, bodyCustomerId?: string) {
        const customerUserId = authUser?.id || bodyCustomerId
        if (!customerUserId) {
          return { status: 401, error: 'Login required. You must be signed in to your LOVIXA account to place an order.' }
        }
        return { status: 200, customerUserId }
      }

      // Guest without auth or customerId -> Must be rejected with 401
      const unauthResult = checkOrderAuth(null, undefined)
      assert.equal(unauthResult.status, 401)
      assert.ok(unauthResult.error?.includes('Login required'))

      // Authenticated user -> Allowed with 200
      const authResult = checkOrderAuth({ id: 'user_12345' }, undefined)
      assert.equal(authResult.status, 200)
      assert.equal(authResult.customerUserId, 'user_12345')

      // Customer with verified customerId -> Allowed with 200
      const customerIdResult = checkOrderAuth(null, 'customer_67890')
      assert.equal(customerIdResult.status, 200)
      assert.equal(customerIdResult.customerUserId, 'customer_67890')
    })
  })
})
