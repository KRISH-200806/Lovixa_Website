import Razorpay from 'razorpay'
import crypto from 'crypto'

export const razorpay =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
    : null

export async function createRazorpayOrder({
  amount,
  currency = 'INR',
  receipt,
  notes = {},
}: {
  amount: number
  currency?: string
  receipt: string
  notes?: Record<string, string>
}) {
  if (!razorpay) {
    throw new Error('Razorpay is not configured. Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in environment.')
  }

  // Razorpay amounts are in the smallest currency sub-unit (paise for INR, cents for USD)
  const amountInSmallestUnit = Math.round(amount * 100)

  const order = await razorpay.orders.create({
    amount: amountInSmallestUnit,
    currency,
    receipt,
    notes,
  })

  return order
}

export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string
  paymentId: string
  signature: string
}): boolean {
  if (!process.env.RAZORPAY_KEY_SECRET) return false

  const text = `${orderId}|${paymentId}`
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(text)
    .digest('hex')

  return expectedSignature === signature
}
