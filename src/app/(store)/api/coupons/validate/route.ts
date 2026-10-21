import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req)
    if (!checkRateLimit(`coupon_${clientIp}`, { limit: 20, windowMs: 60 * 1000 })) {
      return NextResponse.json(
        { error: 'Too many coupon attempts. Please try again shortly.' },
        { status: 429 }
      )
    }

    const { code, subtotal = 0, phone = '', email = '' } = await req.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 })
    }

    const cleanCode = code.trim().toUpperCase()
    const numericSubtotal = Number(subtotal) || 0
    const cleanCustomerPhone = phone ? String(phone).replace(/[^0-9]/g, '').slice(-10) : ''
    const cleanCustomerEmail = email ? String(email).trim().toLowerCase() : ''

    // 1. Primary Source: Query Payload CMS Coupons collection
    try {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection: 'coupons',
        where: {
          code: {
            equals: cleanCode,
          },
        },
        limit: 1,
      })

      if (result.docs.length > 0) {
        const coupon = result.docs[0] as any

        if (coupon.isActive === false) {
          return NextResponse.json({ error: 'This coupon is no longer active.' }, { status: 400 })
        }

        if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
          return NextResponse.json({ error: 'This coupon has expired.' }, { status: 400 })
        }

        // Global usage limit check (e.g. usageLimit: 1 means only 1 customer can use it)
        if (coupon.usageLimit && (coupon.usedCount || 0) >= coupon.usageLimit) {
          return NextResponse.json(
            { error: 'This coupon has already been redeemed and has reached its usage limit.' },
            { status: 400 }
          )
        }

        // Per-customer usage limit check (phone or email)
        const perUserLimit = coupon.perUserLimit || 1
        const usedByList = coupon.usedBy || []
        if (cleanCustomerPhone || cleanCustomerEmail) {
          const redemptionsByCustomer = usedByList.filter((entry: any) => {
            const entryPhone = entry.phone ? String(entry.phone).replace(/[^0-9]/g, '').slice(-10) : ''
            const entryEmail = entry.email ? String(entry.email).trim().toLowerCase() : ''
            return (
              (cleanCustomerPhone && entryPhone && entryPhone === cleanCustomerPhone) ||
              (cleanCustomerEmail && entryEmail && entryEmail === cleanCustomerEmail)
            )
          }).length

          if (redemptionsByCustomer >= perUserLimit) {
            return NextResponse.json(
              { error: 'You have already redeemed this coupon code on a previous order.' },
              { status: 400 }
            )
          }
        }

        if (coupon.minOrderAmount && numericSubtotal < coupon.minOrderAmount) {
          return NextResponse.json(
            { error: `Minimum order amount of ₹${coupon.minOrderAmount} is required for coupon ${cleanCode}.` },
            { status: 400 }
          )
        }

        let message = ''
        if (coupon.discountType === 'percentage') {
          message = `${coupon.discountValue}% discount applied successfully!`
        } else if (coupon.discountType === 'fixed_amount') {
          message = `₹${coupon.discountValue} flat discount applied successfully!`
        } else if (coupon.discountType === 'free_shipping') {
          message = 'Free Express Shipping voucher applied!'
        }

        let calculatedDiscount = 0
        if (coupon.discountType === 'percentage') {
          calculatedDiscount = (numericSubtotal * coupon.discountValue) / 100
          if (coupon.maxDiscountAmount && calculatedDiscount > coupon.maxDiscountAmount) {
            calculatedDiscount = coupon.maxDiscountAmount
          }
        } else if (coupon.discountType === 'fixed_amount') {
          calculatedDiscount = Math.min(coupon.discountValue, numericSubtotal)
        }
        calculatedDiscount = Math.round(calculatedDiscount * 100) / 100

        return NextResponse.json({
          valid: true,
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          discount: calculatedDiscount,
          minOrderAmount: coupon.minOrderAmount || 0,
          maxDiscountAmount: coupon.maxDiscountAmount || null,
          message,
        })
      }
    } catch (cmsErr) {
      console.warn('Coupon CMS query notice:', cmsErr)
    }

    // 2. Approved Campaign Fallbacks (Ensures zero customer checkout friction)
    if (cleanCode === 'LOVIXA15') {
      const discount = Math.round(((numericSubtotal * 15) / 100) * 100) / 100
      return NextResponse.json({
        valid: true,
        code: 'LOVIXA15',
        discountType: 'percentage',
        discountValue: 15,
        discount,
        minOrderAmount: 0,
        maxDiscountAmount: 300,
        message: '15% LOVIXA VIP Welcome discount applied!',
      })
    }

    if (cleanCode === 'WELCOME10') {
      const discount = Math.round(((numericSubtotal * 10) / 100) * 100) / 100
      return NextResponse.json({
        valid: true,
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        discount,
        minOrderAmount: 0,
        maxDiscountAmount: 200,
        message: '10% Welcome discount applied!',
      })
    }

    if (cleanCode === 'GLOW15') {
      return NextResponse.json({
        valid: true,
        code: 'GLOW15',
        discountType: 'percentage',
        discountValue: 15,
        minOrderAmount: 0,
        maxDiscountAmount: 300,
        message: '15% Seasonal Glow discount applied!',
      })
    }

    if (cleanCode === 'LOVIXA20') {
      if (numericSubtotal < 999) {
        return NextResponse.json(
          { error: 'Minimum order amount of ₹999 required for coupon LOVIXA20.' },
          { status: 400 }
        )
      }
      return NextResponse.json({
        valid: true,
        code: 'LOVIXA20',
        discountType: 'percentage',
        discountValue: 20,
        minOrderAmount: 999,
        maxDiscountAmount: 500,
        message: '20% VIP Ritual discount applied!',
      })
    }

    return NextResponse.json({ error: 'Invalid coupon code. Please check and try again.' }, { status: 404 })
  } catch (error: any) {
    console.error('Coupon validation error:', error)
    return NextResponse.json({ error: 'Unable to validate coupon code at this time.' }, { status: 500 })
  }
}
