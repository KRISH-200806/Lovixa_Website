import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { sendOrderConfirmationEmail } from '@/lib/email/send-email'
import { validateItemsStock, decrementItemsStock } from '@/lib/inventory/inventory'
import { randomBytes } from 'crypto'
import {
  generateWhatsAppOrderMessage,
  buildWhatsAppClickToChatUrl,
  validateIndianMobile,
  validateIndianPincode,
} from '@/lib/whatsapp/order'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req)
    if (!checkRateLimit(`checkout_${clientIp}`, { limit: 15, windowMs: 10 * 60 * 1000 })) {
      return NextResponse.json(
        { error: 'Too many order requests in a short period. Please try again in a few minutes.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const {
      existingOrderId,
      customerEmail,
      customerName = 'Valued Customer',
      customerPhone,
      shippingAddress,
      currency = 'INR',
      currencySymbol = '₹',
      items,
      subtotal,
      discountTotal = 0,
      couponCode,
      shippingTotal = 0,
      taxTotal = 0,
      grandTotal,
      paymentProvider = 'whatsapp_manual',
    } = body

    // 1. Mandatory customer validation (Name, Phone, Items)
    const phone = (customerPhone || shippingAddress?.phone || '').trim()
    const name = (customerName || '').trim()

    if (!name || !phone || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required order fields. Customer name, mobile number, and at least one item are required.' },
        { status: 400 }
      )
    }

    // Validate Indian Mobile Number
    const phoneCheck = validateIndianMobile(phone)
    if (!phoneCheck.valid) {
      return NextResponse.json({ error: phoneCheck.error || 'Invalid mobile number' }, { status: 400 })
    }
    const cleanPhone = phoneCheck.normalized

    const payload = await getPayload({ config: configPromise })

    // Determine effective currency & store settings
    let baseCurrencyCode = 'INR'
    let storeSettings: any = null
    try {
      storeSettings = await payload.findGlobal({ slug: 'store-settings' })
      baseCurrencyCode = storeSettings?.currency?.code || 'INR'
    } catch (settingsErr) {
      console.warn('Notice: Could not load store-settings global:', settingsErr)
    }

    // Validate Pincode if provided in shipping address
    const rawPincode = shippingAddress?.postalCode || shippingAddress?.pincode || ''
    if (rawPincode) {
      const serviceable = storeSettings?.shipping?.serviceablePincodes
      const pinCheck = validateIndianPincode(rawPincode, serviceable)
      if (!pinCheck.valid) {
        return NextResponse.json({ error: pinCheck.error }, { status: 400 })
      }
    }

    let finalCurrency = currency || 'INR'
    let finalGrandTotal = Number(grandTotal)
    let finalSubtotal = Number(subtotal)
    let finalDiscountTotal = Number(discountTotal)
    let finalShippingTotal = Number(shippingTotal)
    let finalTaxTotal = Number(taxTotal)
    let finalItems = items

    let customerAppliedRate = 1
    let storeBaseTotal = Number(grandTotal)
    let currencyBreakdown: any[] = []

    try {
      const supported = storeSettings?.supportedCurrencies || []
      const defaultCurrencies = [
        { code: 'INR', symbol: '₹', exchangeRate: 1 },
        { code: 'USD', symbol: '$', exchangeRate: 0.012 },
        { code: 'EUR', symbol: '€', exchangeRate: 0.011 },
        { code: 'GBP', symbol: '£', exchangeRate: 0.0095 },
      ]
      const currenciesList = supported && supported.length > 0 ? supported : defaultCurrencies

      const currentCurrOpt = currenciesList.find(
        (c: any) => c.code.toUpperCase() === (currency || 'INR').toUpperCase()
      )
      customerAppliedRate = currentCurrOpt?.exchangeRate || 1
      storeBaseTotal = Number((Number(grandTotal) / customerAppliedRate).toFixed(2))

      currencyBreakdown = currenciesList.map((c: any) => ({
        code: c.code,
        symbol: c.symbol,
        total: Number((storeBaseTotal * (c.exchangeRate || 1)).toFixed(2)),
        exchangeRate: Number(c.exchangeRate || 1),
      }))
    } catch (e) {
      console.warn('Currency breakdown warning:', e)
    }

    // Check if we should reuse an existing order (prevent duplicate records on retry/back)
    let existingOrder: any = null
    if (existingOrderId) {
      try {
        const found = await payload.findByID({
          collection: 'orders',
          id: existingOrderId,
        })
        if (found && (found.paymentStatus === 'unpaid' || found.paymentStatus === 'pending' || found.orderStatus === 'awaiting_confirmation')) {
          existingOrder = found
        }
      } catch (e) {
        // Fallback to creating a new order
      }
    }

    // Generate unique human-readable order number (LVX-YYYY-XXXX) or reuse existing
    const orderNumber =
      existingOrder?.orderNumber ||
      `LVX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`

    const isFree = Number(finalGrandTotal) <= 0
    let paymentData: any = {}

    // Validate Stock Inventory before creating order
    const stockCheck = await validateItemsStock(payload, finalItems)
    if (!stockCheck.valid) {
      return NextResponse.json({ error: stockCheck.message || 'Item is out of stock' }, { status: 400 })
    }

    // Format delivery address cleanly
    const house = shippingAddress?.house || ''
    const street = shippingAddress?.street || shippingAddress?.address || ''
    const landmark = shippingAddress?.landmark || ''
    const fullStreetAddress = [house, street, landmark].filter(Boolean).join(', ') || 'Standard Delivery'

    const formattedAddress = {
      firstName: shippingAddress?.firstName || name.split(' ')[0] || '',
      lastName: shippingAddress?.lastName || name.split(' ').slice(1).join(' ') || '',
      house,
      street,
      landmark,
      address: fullStreetAddress,
      city: shippingAddress?.city || 'City',
      state: shippingAddress?.state || '',
      postalCode: rawPincode || '00000',
      country: shippingAddress?.country || 'India',
    }

    // Associate order with customer user account if signed in or match by email
    let customerUserId = body.customerId
    if (!customerUserId && customerEmail) {
      try {
        const userMatches = await payload.find({
          collection: 'users',
          where: { email: { equals: customerEmail.toLowerCase().trim() } },
          limit: 1,
        })
        if (userMatches.docs.length > 0) {
          customerUserId = userMatches.docs[0].id
        }
      } catch (e) { }
    }

    // Generate WhatsApp Message & Click-to-Chat Deep Link
    const businessWhatsAppNumber =
      storeSettings?.whatsappCheckout?.businessNumber ||
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
      '919712460509'

    const whatsappMessage = generateWhatsAppOrderMessage({
      orderNumber,
      customerName: name,
      customerMobile: cleanPhone,
      customerEmail: customerEmail?.trim() || undefined,
      items: finalItems.map((item: any) => ({
        title: item.title,
        optionsSummary: item.optionsSummary,
        variantTitle: item.variantTitle,
        quantity: Number(item.quantity) || 1,
        price: Number(item.price) || 0,
      })),
      subtotal: finalSubtotal,
      shippingTotal: finalShippingTotal,
      discountTotal: finalDiscountTotal,
      couponCode,
      grandTotal: finalGrandTotal,
      currencySymbol,
      shippingAddress: {
        house: formattedAddress.house,
        street: formattedAddress.street,
        landmark: formattedAddress.landmark,
        city: formattedAddress.city,
        state: formattedAddress.state,
        pincode: formattedAddress.postalCode,
        country: formattedAddress.country,
      },
    })

    const whatsappUrl = buildWhatsAppClickToChatUrl(businessWhatsAppNumber, whatsappMessage)

    // Generate cryptographic guest access token for secure receipt and tracking
    const guestAccessToken = existingOrder?.guestAccessToken || randomBytes(32).toString('hex')

    // Assemble complete order document
    const orderData = {
      orderNumber,
      guestAccessToken,
      customer: customerUserId || undefined,
      customerEmail: customerEmail?.trim() || undefined,
      customerName: name,
      customerPhone: cleanPhone,
      items: finalItems.map((item: any) => ({
        productId: String(item.productId),
        variantId: item.variantId ? String(item.variantId) : undefined,
        title: item.title,
        price: Number(item.price),
        quantity: Number(item.quantity),
        image: item.image,
        optionsSummary: item.optionsSummary,
      })),
      subtotal: Number(finalSubtotal),
      discountTotal: Number(finalDiscountTotal),
      couponCode: couponCode || undefined,
      shippingTotal: Number(finalShippingTotal),
      taxTotal: Number(finalTaxTotal),
      grandTotal: Number(finalGrandTotal),
      currency: finalCurrency,
      baseCurrency: baseCurrencyCode,
      baseGrandTotal: storeBaseTotal,
      exchangeRate: customerAppliedRate,
      currencyBreakdown,
      orderStatus: isFree
        ? ('confirmed' as const)
        : ('awaiting_confirmation' as const),
      paymentStatus: (isFree ? 'paid' : 'unpaid') as 'unpaid' | 'paid',
      paymentProvider: isFree ? ('free' as const) : (paymentProvider as 'whatsapp_manual' | 'cod' | 'razorpay' | 'stripe'),
      paymentIntentId: paymentData.id || undefined,
      fulfillmentStatus: isFree ? ('processing' as const) : ('unfulfilled' as const),
      shippingAddress: formattedAddress,
      adminNotes: `Order placed via WhatsApp Click-to-Chat. Awaiting customer confirmation and manual UPI payment. Official WhatsApp: +${businessWhatsAppNumber}`,
    }

    // Validate coupon code limits before creating order record
    let matchedCouponDoc: any = null
    if (couponCode) {
      try {
        const coupons = await payload.find({
          collection: 'coupons',
          where: { code: { equals: String(couponCode).trim().toUpperCase() } },
          limit: 1,
        })
        if (coupons.docs.length > 0) {
          matchedCouponDoc = coupons.docs[0]
          if (matchedCouponDoc.isActive === false) {
            return NextResponse.json({ error: 'This coupon is no longer active.' }, { status: 400 })
          }
          if (matchedCouponDoc.expiresAt && new Date(matchedCouponDoc.expiresAt).getTime() < Date.now()) {
            return NextResponse.json({ error: 'This coupon has expired.' }, { status: 400 })
          }
          if (matchedCouponDoc.usageLimit && (matchedCouponDoc.usedCount || 0) >= matchedCouponDoc.usageLimit) {
            return NextResponse.json(
              { error: 'This coupon has already been redeemed and has reached its maximum usage limit.' },
              { status: 400 }
            )
          }
          const perUserLimit = matchedCouponDoc.perUserLimit || 1
          const usedByList = matchedCouponDoc.usedBy || []
          const userRedemptions = usedByList.filter((entry: any) => {
            const entryPhone = entry.phone ? String(entry.phone).replace(/[^0-9]/g, '').slice(-10) : ''
            const entryEmail = entry.email ? String(entry.email).trim().toLowerCase() : ''
            return (
              (cleanPhone && entryPhone && entryPhone === cleanPhone.slice(-10)) ||
              (customerEmail && entryEmail && entryEmail === customerEmail.trim().toLowerCase())
            )
          }).length

          if (userRedemptions >= perUserLimit) {
            return NextResponse.json(
              { error: 'You have already redeemed this coupon code on a previous order.' },
              { status: 400 }
            )
          }
        }
      } catch (couponErr) {
        console.warn('Coupon pre-order check notice:', couponErr)
      }
    }

    let orderRecord: any
    if (existingOrder) {
      orderRecord = await payload.update({
        collection: 'orders',
        id: existingOrder.id,
        data: orderData,
      })
    } else {
      orderRecord = await payload.create({
        collection: 'orders',
        data: orderData,
      })
    }

    // Atomically increment coupon usedCount and record customer usage log
    if (matchedCouponDoc && (!existingOrder || !existingOrder.couponCode)) {
      try {
        const updatedUsedBy = [
          ...(matchedCouponDoc.usedBy || []),
          {
            phone: cleanPhone,
            email: customerEmail?.trim() || undefined,
            orderNumber,
            usedAt: new Date().toISOString(),
          },
        ]
        await payload.update({
          collection: 'coupons',
          id: matchedCouponDoc.id,
          data: {
            usedCount: (matchedCouponDoc.usedCount || 0) + 1,
            usedBy: updatedUsedBy,
          },
        })
      } catch (couponUpdateErr) {
        console.warn('Coupon counter increment notice:', couponUpdateErr)
      }
    }

    // For Free Orders: immediately decrement stock & dispatch email if email provided
    if (isFree) {
      await decrementItemsStock(payload, items)

      if (customerEmail) {
        try {
          await sendOrderConfirmationEmail({
            to: customerEmail,
            orderNumber,
            customerName: name,
            grandTotal: finalGrandTotal,
            items,
          })
        } catch (e) {
          console.warn('Email send notice:', e)
        }
      }
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: orderRecord.id,
      guestAccessToken,
      whatsappUrl,
      whatsappMessage,
      businessNumber: businessWhatsAppNumber,
      orderStatus: orderData.orderStatus,
      paymentStatus: orderData.paymentStatus,
    })
  } catch (error: any) {
    console.error('Checkout API error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
