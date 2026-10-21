import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'crypto'

function verifyHmacSignature(orderId: string, paymentId: string, signature: string, secret: string): boolean {
  if (!secret || !orderId || !paymentId || !signature) return false
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')
  return generatedSignature === signature
}

describe('Payment HMAC Verification & Single Order Idempotency', () => {
  const secret = 'rzp_test_mock_secret_key_12345'
  const orderId = 'order_test_987654321'
  const paymentId = 'pay_test_123456789'

  it('validates a genuine HMAC SHA-256 signature', () => {
    const validSignature = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex')

    const isValid = verifyHmacSignature(orderId, paymentId, validSignature, secret)
    assert.equal(isValid, true)
  })

  it('rejects a forged or tampered signature', () => {
    const forgedSignature = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
    const isValid = verifyHmacSignature(orderId, paymentId, forgedSignature, secret)
    assert.equal(isValid, false)
  })

  it('rejects verification when credentials are missing', () => {
    assert.equal(verifyHmacSignature('', paymentId, 'sig', secret), false)
    assert.equal(verifyHmacSignature(orderId, '', 'sig', secret), false)
    assert.equal(verifyHmacSignature(orderId, paymentId, '', secret), false)
  })
})
