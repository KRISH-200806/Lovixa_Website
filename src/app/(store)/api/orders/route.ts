import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { headers } from 'next/headers'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const orderNumber = searchParams.get('orderNumber')?.trim()
    const guestToken = searchParams.get('token')?.trim()
    const emailParam = searchParams.get('email')?.trim()?.toLowerCase()
    const phoneParam = searchParams.get('phone')?.trim()

    const payload = await getPayload({ config: configPromise })
    const requestHeaders = await headers()
    const { user } = await payload.auth({ headers: requestHeaders })

    let where: any = null

    if (user) {
      // 1. Authenticated User Request
      const isAdminOrStaff = (user as any).role === 'admin' || (user as any).role === 'staff'

      if (isAdminOrStaff) {
        // Staff/Admin can search or list orders
        const conditions: any[] = []
        if (orderNumber) {
          conditions.push({ orderNumber: { equals: orderNumber } })
        }
        if (emailParam) {
          conditions.push({ customerEmail: { equals: emailParam } })
        }
        if (phoneParam) {
          conditions.push({ customerPhone: { equals: phoneParam } })
        }
        where = conditions.length > 1 ? { and: conditions } : conditions[0] || {}
      } else {
        // Customer is strictly restricted to their own orders (IDOR protection)
        const customerIdentifier = user.email?.toLowerCase().trim()
        const userConditions: any[] = [
          { customer: { equals: user.id } },
        ]
        if (customerIdentifier) {
          userConditions.push({ customerEmail: { equals: customerIdentifier } })
        }

        const baseOwnershipFilter = { or: userConditions }

        if (orderNumber) {
          where = {
            and: [
              baseOwnershipFilter,
              { orderNumber: { equals: orderNumber } },
            ],
          }
        } else {
          where = baseOwnershipFilter
        }
      }
    } else {
      // 2. Unauthenticated / Guest Request
      // Strict rule: Anonymous users CANNOT list orders.
      if (!orderNumber) {
        return NextResponse.json(
          { error: 'Authentication required to view order history.' },
          { status: 401 }
        )
      }

      // Guest order lookup: Requires either unguessable guestAccessToken OR verified phone + email combo
      if (guestToken) {
        where = {
          and: [
            { orderNumber: { equals: orderNumber } },
            { guestAccessToken: { equals: guestToken } },
          ],
        }
      } else if (emailParam && phoneParam) {
        where = {
          and: [
            { orderNumber: { equals: orderNumber } },
            { customerEmail: { equals: emailParam } },
            { customerPhone: { equals: phoneParam } },
          ],
        }
      } else {
        return NextResponse.json(
          {
            error:
              'Unauthorized. A valid guest access token or matching contact credentials are required to view this order.',
          },
          { status: 403 }
        )
      }
    }

    const result = await payload.find({
      collection: 'orders',
      where,
      sort: '-createdAt',
      limit: user && ((user as any).role === 'admin' || (user as any).role === 'staff') ? 50 : 20,
    })

    const orders = (result.docs || []).map((doc: any) => {
      const items = Array.isArray(doc.items) ? doc.items : []
      const itemsCount = items.reduce(
        (sum: number, item: any) => sum + (Number(item.quantity) || 1),
        0
      )
      const titleSummary =
        items.length > 0 ? items.map((i: any) => i.title).join(', ') : 'Order Items'

      return {
        id: doc.orderNumber || String(doc.id),
        orderNumber: doc.orderNumber || String(doc.id),
        customerName: doc.customerName || 'Valued Customer',
        customerEmail: doc.customerEmail || null,
        customerPhone: doc.customerPhone || null,
        date: doc.createdAt
          ? new Date(doc.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            })
          : 'Recent',
        createdAt: doc.createdAt,
        total: Number(doc.grandTotal || 0),
        grandTotal: Number(doc.grandTotal || 0),
        subtotal: Number(doc.subtotal || 0),
        discountTotal: Number(doc.discountTotal || 0),
        couponCode: doc.couponCode || null,
        shippingTotal: Number(doc.shippingTotal || 0),
        taxTotal: Number(doc.taxTotal || 0),
        currency: doc.currency || 'INR',
        orderStatus:
          doc.orderStatus ||
          (doc.fulfillmentStatus === 'shipped'
            ? 'shipped'
            : doc.fulfillmentStatus === 'delivered'
            ? 'delivered'
            : 'awaiting_confirmation'),
        paymentStatus: doc.paymentStatus || 'unpaid',
        paymentProvider: doc.paymentProvider || 'whatsapp_manual',
        paymentIntentId: doc.paymentIntentId || null,
        fulfillmentStatus: doc.fulfillmentStatus || 'unfulfilled',
        trackingNumber: doc.trackingNumber || null,
        trackingUrl: doc.trackingUrl || null,
        itemsCount,
        title: titleSummary,
        items,
        shippingAddress: doc.shippingAddress || null,
      }
    })

    return NextResponse.json({ orders, order: orders[0] || null })
  } catch (err: any) {
    console.error('Orders GET error:', err)
    return NextResponse.json(
      { error: 'An error occurred while fetching order information.' },
      { status: 500 }
    )
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method Not Allowed. Use /api/checkout to place an order.' },
    { status: 405 }
  )
}

export async function PATCH() {
  return NextResponse.json(
    { error: 'Method Not Allowed. Orders can only be updated by authorized administrators in Payload Admin.' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method Not Allowed. Orders cannot be deleted via the public storefront API.' },
    { status: 405 }
  )
}
