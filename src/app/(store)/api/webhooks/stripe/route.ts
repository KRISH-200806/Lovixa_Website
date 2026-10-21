import { NextResponse } from 'next/server'
import { stripe } from '@/lib/payments/stripe'

export async function POST(req: Request) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('stripe-signature')
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!stripe || !signature || !webhookSecret) {
      return NextResponse.json(
        { error: 'Stripe webhook configuration missing' },
        { status: 400 }
      )
    }

    let event: any
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
    } catch (err: any) {
      console.error(`⚠️ Webhook signature verification failed:`, err.message)
      return NextResponse.json({ error: 'Signature verification failed' }, { status: 400 })
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object
        const orderNumber = paymentIntent.metadata?.orderNumber
        console.log(`✅ Payment succeeded for order: ${orderNumber}`)
        // Transition order status to 'paid' and decrement inventory atomically
        break
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object
        console.warn(`❌ Payment failed for intent: ${paymentIntent.id}`)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Stripe webhook processing error:', error)
    return NextResponse.json({ error: 'Internal webhook error' }, { status: 500 })
  }
}
