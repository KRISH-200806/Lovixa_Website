import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export async function POST(req: Request) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature')
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

    if (!webhookSecret || !signature) {
      return NextResponse.json(
        { error: 'Razorpay webhook configuration or signature missing' },
        { status: 400 }
      )
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex')

    if (expectedSignature !== signature) {
      console.error('⚠️ Razorpay webhook signature verification failed')
      return NextResponse.json({ error: 'Signature verification failed' }, { status: 400 })
    }

    const event = JSON.parse(rawBody)
    const payload = await getPayload({ config: configPromise })

    switch (event.event) {
      case 'order.paid':
      case 'payment.captured': {
        const paymentEntity = event.payload.payment.entity
        const receipt = paymentEntity.notes?.receipt || paymentEntity.notes?.orderNumber || paymentEntity.description

        if (receipt) {
          const orders = await payload.find({
            collection: 'orders',
            where: { orderNumber: { equals: receipt } },
          })

          if (orders.docs.length > 0) {
            await payload.update({
              collection: 'orders',
              id: orders.docs[0].id,
              data: {
                paymentStatus: 'paid',
                paymentIntentId: paymentEntity.id,
              },
            })
            console.log(`✅ Razorpay payment captured for order: ${receipt}`)
          }
        }
        break
      }
      case 'payment.failed': {
        const paymentEntity = event.payload.payment.entity
        const receipt = paymentEntity.notes?.receipt || paymentEntity.notes?.orderNumber
        if (receipt) {
          const orders = await payload.find({
            collection: 'orders',
            where: { orderNumber: { equals: receipt } },
          })
          if (orders.docs.length > 0) {
            await payload.update({
              collection: 'orders',
              id: orders.docs[0].id,
              data: { paymentStatus: 'failed' },
            })
          }
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Razorpay webhook processing error:', error)
    return NextResponse.json({ error: error.message || 'Internal webhook error' }, { status: 500 })
  }
}
