import Stripe from 'stripe'

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia' as any,
      typescript: true,
    })
  : null

export async function createStripePaymentIntent({
  amount,
  currency = 'usd',
  orderNumber,
  customerEmail,
  metadata = {},
}: {
  amount: number
  currency?: string
  orderNumber: string
  customerEmail: string
  metadata?: Record<string, string>
}) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Missing STRIPE_SECRET_KEY in environment.')
  }

  // Convert decimal to smallest currency unit (e.g. cents)
  const amountInCents = Math.round(amount * 100)

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: currency.toLowerCase(),
    receipt_email: customerEmail,
    metadata: {
      orderNumber,
      ...metadata,
    },
    automatic_payment_methods: {
      enabled: true,
    },
  })

  return {
    clientSecret: paymentIntent.client_secret,
    id: paymentIntent.id,
  }
}
