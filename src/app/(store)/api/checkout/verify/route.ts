import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { verifyRazorpaySignature } from '@/lib/payments/razorpay'
import { sendOrderConfirmationEmail } from '@/lib/email/send-email'
import { decrementItemsStock } from '@/lib/inventory/inventory'

export async function POST(req: Request) {
  try {
    const {
      orderId,
      orderNumber,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = await req.json()

    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return NextResponse.json(
        { error: 'Missing payment verification credentials' },
        { status: 400 }
      )
    }

    // 1. Verify HMAC Signature
    const isValid = verifyRazorpaySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    })

    if (!isValid) {
      console.error('⚠️ Razorpay signature verification failed for order:', orderNumber)
      return NextResponse.json(
        { error: 'Payment signature verification failed' },
        { status: 400 }
      )
    }

    // 2. Find and update the existing order record in Payload Database
    const payload = await getPayload({ config: configPromise })

    let existingOrder: any = null
    if (orderId) {
      try {
        existingOrder = await payload.findByID({
          collection: 'orders',
          id: orderId,
        })
      } catch (e) {
        // Fallback to orderNumber lookup
      }
    }

    if (!existingOrder && orderNumber) {
      const orders = await payload.find({
        collection: 'orders',
        where: { orderNumber: { equals: orderNumber } },
        limit: 1,
      })
      if (orders.docs.length > 0) {
        existingOrder = orders.docs[0]
      }
    }

    if (!existingOrder) {
      const orders = await payload.find({
        collection: 'orders',
        where: { paymentIntentId: { equals: razorpayOrderId } },
        limit: 1,
      })
      if (orders.docs.length > 0) {
        existingOrder = orders.docs[0]
      }
    }

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found for verification' }, { status: 404 })
    }

    // 3. Update existing order to 'paid' (Idempotent single order record)
    const updatedOrder = await payload.update({
      collection: 'orders',
      id: existingOrder.id,
      data: {
        paymentStatus: 'paid',
        paymentIntentId: razorpayPaymentId,
      },
    })

    // 4. Atomically decrement product stock and variant inventory
    if (existingOrder.items && existingOrder.items.length > 0) {
      await decrementItemsStock(payload, existingOrder.items)
    }

    // 5. Increment coupon usage if not already counted
    if (existingOrder.couponCode) {
      try {
        const coupons = await payload.find({
          collection: 'coupons',
          where: { code: { equals: existingOrder.couponCode.toUpperCase() } },
          limit: 1,
        })
        if (coupons.docs.length > 0) {
          const couponDoc = coupons.docs[0] as any
          const alreadyLogged = (couponDoc.usedBy || []).some(
            (entry: any) => entry.orderNumber === existingOrder.orderNumber
          )
          if (!alreadyLogged) {
            const updatedUsedBy = [
              ...(couponDoc.usedBy || []),
              {
                phone: existingOrder.customerPhone,
                email: existingOrder.customerEmail,
                orderNumber: existingOrder.orderNumber,
                usedAt: new Date().toISOString(),
              },
            ]
            await payload.update({
              collection: 'coupons',
              id: couponDoc.id,
              data: {
                usedCount: (couponDoc.usedCount || 0) + 1,
                usedBy: updatedUsedBy,
              },
            })
          }
        }
      } catch (e) {
        console.warn('Coupon counter update notice:', e)
      }
    }

    // 5. Send Confirmation Email now that payment is verified
    await sendOrderConfirmationEmail({
      to: existingOrder.customerEmail,
      orderNumber: existingOrder.orderNumber,
      customerName: existingOrder.customerName || 'Valued Customer',
      grandTotal: existingOrder.grandTotal,
      items: existingOrder.items || [],
    })

    // 6. Automatically purge any previous stale abandoned pending online orders for this email
    if (existingOrder.customerEmail) {
      try {
        await payload.delete({
          collection: 'orders',
          where: {
            and: [
              { customerEmail: { equals: existingOrder.customerEmail.toLowerCase() } },
              { paymentStatus: { equals: 'pending' } },
              { id: { not_equals: existingOrder.id } },
            ],
          },
        })
      } catch (cleanupErr) {
        console.warn('Orphan pending orders cleanup notice:', cleanupErr)
      }
    }

    return NextResponse.json({
      success: true,
      orderNumber: existingOrder.orderNumber,
      orderId: existingOrder.id,
      paymentStatus: 'paid',
    })
  } catch (error: any) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal payment verification error' },
      { status: 500 }
    )
  }
}
