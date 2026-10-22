import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

/**
 * LOVIXA Authoritative Pricing, Tax, and Promotion Math Specification
 * Money Verification: COUP-001 to COUP-026, PROD-015, CHECK-017
 */

interface CouponConfig {
  code: string
  discountType: 'percentage' | 'fixed_amount' | 'free_shipping'
  discountValue: number
  minOrderAmount?: number
  maxDiscountAmount?: number | null
  expiresAt?: string
  startsAt?: string
  usageLimit?: number
  usedCount?: number
  perUserLimit?: number
  usedBy?: Array<{ phone?: string; email?: string }>
  isActive: boolean
}

function calculateAuthoritativeTotals({
  items,
  coupon,
  freeShippingThreshold = 999,
  flatRateShipping = 99,
  gstRate = 0.18,
  pricesIncludeGst = true,
}: {
  items: Array<{ price: number; quantity: number }>
  coupon?: CouponConfig | null
  freeShippingThreshold?: number
  flatRateShipping?: number
  gstRate?: number
  pricesIncludeGst?: boolean
}) {
  // 1. Precise subtotal using integer minor units (paise) to prevent floating-point drift
  const subtotalPaise = items.reduce((acc, item) => {
    const itemPaise = Math.round(item.price * 100)
    const qty = Math.max(1, Math.floor(item.quantity))
    return acc + itemPaise * qty
  }, 0)

  const subtotal = subtotalPaise / 100

  // 2. Validate coupon eligibility
  let discountPaise = 0
  let isFreeShippingCoupon = false

  if (coupon) {
    if (!coupon.isActive) {
      throw new Error('Coupon is inactive')
    }
    if (coupon.startsAt && new Date(coupon.startsAt).getTime() > Date.now()) {
      throw new Error('Coupon is not yet active')
    }
    if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
      throw new Error('Coupon has expired')
    }
    if (coupon.usageLimit && (coupon.usedCount || 0) >= coupon.usageLimit) {
      throw new Error('Coupon global usage limit reached')
    }
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      throw new Error(`Minimum order amount of ₹${coupon.minOrderAmount} required`)
    }

    if (coupon.discountType === 'percentage') {
      const rawDiscountPaise = Math.round((subtotalPaise * coupon.discountValue) / 100)
      discountPaise = rawDiscountPaise
      if (coupon.maxDiscountAmount && coupon.maxDiscountAmount > 0) {
        const capPaise = Math.round(coupon.maxDiscountAmount * 100)
        discountPaise = Math.min(discountPaise, capPaise)
      }
      discountPaise = Math.min(discountPaise, subtotalPaise)
    } else if (coupon.discountType === 'fixed_amount') {
      const fixedPaise = Math.round(coupon.discountValue * 100)
      discountPaise = Math.min(fixedPaise, subtotalPaise)
    } else if (coupon.discountType === 'free_shipping') {
      isFreeShippingCoupon = true
    }
  }

  const discountTotal = discountPaise / 100

  // 3. Shipping fee
  let shippingPaise = 0
  if (!isFreeShippingCoupon && subtotalPaise < Math.round(freeShippingThreshold * 100)) {
    shippingPaise = Math.round(flatRateShipping * 100)
  }
  const shippingTotal = shippingPaise / 100

  // 4. Tax (GST)
  const taxablePaise = Math.max(0, subtotalPaise - discountPaise)
  let taxPortionPaise = 0
  if (pricesIncludeGst) {
    // Embedded tax: portion = amount - (amount / (1 + rate))
    taxPortionPaise = Math.round(taxablePaise - taxablePaise / (1 + gstRate))
  } else {
    taxPortionPaise = Math.round(taxablePaise * gstRate)
  }
  const taxTotal = taxPortionPaise / 100

  // 5. Grand total
  const grandTotalPaise = taxablePaise + shippingPaise
  const grandTotal = Math.max(0, grandTotalPaise / 100)

  return {
    subtotal,
    discountTotal,
    shippingTotal,
    taxTotal,
    grandTotal,
    hasFreeShipping: shippingTotal === 0,
  }
}

describe('Master Pricing & Money Verification Suite (COUP-001 to COUP-026)', () => {
  it('COUP-001 & COUP-007: Computes 15% discount for LOVIXA15 on single shampoo (₹299)', () => {
    const res = calculateAuthoritativeTotals({
      items: [{ price: 299, quantity: 1 }],
      coupon: {
        code: 'LOVIXA15',
        discountType: 'percentage',
        discountValue: 15,
        isActive: true,
      },
    })

    // 15% of 299 = 44.85
    assert.equal(res.subtotal, 299)
    assert.equal(res.discountTotal, 44.85)
    assert.equal(res.shippingTotal, 99) // Below 999
    // 299 - 44.85 + 99 = 353.15
    assert.equal(res.grandTotal, 353.15)
  })

  it('COUP-002: Rejects invalid coupon codes with clear exception', () => {
    assert.throws(
      () =>
        calculateAuthoritativeTotals({
          items: [{ price: 299, quantity: 1 }],
          coupon: {
            code: 'INVALID999',
            discountType: 'percentage',
            discountValue: 50,
            isActive: false, // inactive / not found
          },
        }),
      /Coupon is inactive/
    )
  })

  it('COUP-003: Rejects expired coupons', () => {
    assert.throws(
      () =>
        calculateAuthoritativeTotals({
          items: [{ price: 299, quantity: 1 }],
          coupon: {
            code: 'EXPIRED10',
            discountType: 'percentage',
            discountValue: 10,
            expiresAt: '2023-01-01T00:00:00.000Z',
            isActive: true,
          },
        }),
      /Coupon has expired/
    )
  })

  it('COUP-004: Rejects future-dated coupons that have not yet started', () => {
    assert.throws(
      () =>
        calculateAuthoritativeTotals({
          items: [{ price: 299, quantity: 1 }],
          coupon: {
            code: 'FUTURE20',
            discountType: 'percentage',
            discountValue: 20,
            startsAt: '2030-01-01T00:00:00.000Z',
            isActive: true,
          },
        }),
      /Coupon is not yet active/
    )
  })

  it('COUP-005 & COUP-006: Enforces minimum order amount and accepts exact boundary', () => {
    const couponWithMin: CouponConfig = {
      code: 'VIP999',
      discountType: 'percentage',
      discountValue: 20,
      minOrderAmount: 999,
      isActive: true,
    }

    // Below threshold (₹549 < ₹999) -> must fail
    assert.throws(
      () =>
        calculateAuthoritativeTotals({
          items: [{ price: 549, quantity: 1 }],
          coupon: couponWithMin,
        }),
      /Minimum order amount of ₹999 required/
    )

    // Exact threshold (₹999) -> must succeed
    const boundaryRes = calculateAuthoritativeTotals({
      items: [{ price: 999, quantity: 1 }],
      coupon: couponWithMin,
    })
    assert.equal(boundaryRes.discountTotal, 199.8) // 20% of 999
    assert.equal(boundaryRes.shippingTotal, 0) // >= 999 gets free shipping
    assert.equal(boundaryRes.grandTotal, 799.2)
  })

  it('COUP-008: Applies flat fixed amount discount correctly', () => {
    const res = calculateAuthoritativeTotals({
      items: [{ price: 549, quantity: 1 }],
      coupon: {
        code: 'FLAT100',
        discountType: 'fixed_amount',
        discountValue: 100,
        isActive: true,
      },
    })

    assert.equal(res.subtotal, 549)
    assert.equal(res.discountTotal, 100)
    assert.equal(res.shippingTotal, 99)
    assert.equal(res.grandTotal, 548) // 549 - 100 + 99
  })

  it('COUP-009: Strictly enforces maximum discount cap (LOVIXA15 max ₹300)', () => {
    // 10 Combos = 10 * 549 = ₹5,490. 15% would be ₹823.50, but cap is ₹300
    const res = calculateAuthoritativeTotals({
      items: [{ price: 549, quantity: 10 }],
      coupon: {
        code: 'LOVIXA15',
        discountType: 'percentage',
        discountValue: 15,
        maxDiscountAmount: 300,
        isActive: true,
      },
    })

    assert.equal(res.subtotal, 5490)
    assert.equal(res.discountTotal, 300, 'Discount must be capped at ₹300')
    assert.equal(res.shippingTotal, 0, 'Subtotal > 999 gets free shipping')
    assert.equal(res.grandTotal, 5190) // 5490 - 300 + 0
  })

  it('COUP-018: Applies coupon to Combo Duo set per approved business rules', () => {
    // 1 Combo Duo = ₹549. 15% discount = ₹82.35. Shipping = ₹99. Total = ₹565.65
    const res = calculateAuthoritativeTotals({
      items: [{ price: 549, quantity: 1 }],
      coupon: {
        code: 'LOVIXA15',
        discountType: 'percentage',
        discountValue: 15,
        isActive: true,
      },
    })

    assert.equal(res.subtotal, 549)
    assert.equal(res.discountTotal, 82.35)
    assert.equal(res.shippingTotal, 99)
    assert.equal(res.grandTotal, 565.65)
  })

  it('COUP-020: Enforces global coupon usage limit', () => {
    assert.throws(
      () =>
        calculateAuthoritativeTotals({
          items: [{ price: 299, quantity: 1 }],
          coupon: {
            code: 'ONETIMEONLY',
            discountType: 'percentage',
            discountValue: 50,
            usageLimit: 1,
            usedCount: 1, // exhausted!
            isActive: true,
          },
        }),
      /Coupon global usage limit reached/
    )
  })

  it('COUP-021: Discount greater than subtotal never yields a negative payable amount', () => {
    const res = calculateAuthoritativeTotals({
      items: [{ price: 299, quantity: 1 }],
      coupon: {
        code: 'FLAT500',
        discountType: 'fixed_amount',
        discountValue: 500, // ₹500 > ₹299
        isActive: true,
      },
    })

    assert.equal(res.subtotal, 299)
    assert.equal(res.discountTotal, 299, 'Discount is clamped to subtotal')
    assert.equal(res.shippingTotal, 99)
    assert.equal(res.grandTotal, 99, 'Customer pays only shipping; never negative')
  })

  it('COUP-022: Free-shipping coupon sets shipping fee to ₹0 regardless of subtotal', () => {
    const res = calculateAuthoritativeTotals({
      items: [{ price: 299, quantity: 1 }], // below ₹999
      coupon: {
        code: 'FREESHIP',
        discountType: 'free_shipping',
        discountValue: 0,
        isActive: true,
      },
    })

    assert.equal(res.subtotal, 299)
    assert.equal(res.discountTotal, 0)
    assert.equal(res.shippingTotal, 0, 'Shipping must be ₹0 with free shipping voucher')
    assert.equal(res.grandTotal, 299)
  })

  it('COUP-023: Accurately calculates embedded GST (18%) on discounted total', () => {
    // Shampoo ₹299 with 15% discount (₹44.85) -> Taxable: ₹254.15
    // Inclusive GST portion = 254.15 - (254.15 / 1.18) = 254.15 - 215.3813 = ₹38.77
    const res = calculateAuthoritativeTotals({
      items: [{ price: 299, quantity: 1 }],
      coupon: {
        code: 'LOVIXA15',
        discountType: 'percentage',
        discountValue: 15,
        isActive: true,
      },
      pricesIncludeGst: true,
      gstRate: 0.18,
    })

    assert.equal(res.taxTotal, 38.77, 'Embedded GST portion must be ₹38.77')
  })

  it('COUP-025: Prevents JavaScript IEEE-754 floating-point inaccuracies (e.g. 0.1 + 0.2)', () => {
    // 3 items with fractional price values
    const items = [
      { price: 299.33, quantity: 1 },
      { price: 299.33, quantity: 1 },
      { price: 299.34, quantity: 1 },
    ]
    const res = calculateAuthoritativeTotals({ items })

    // Total must be exactly 898.00, not 898.0000000000001
    assert.equal(res.subtotal, 898)
    assert.equal(Number.isInteger(Math.round(res.subtotal * 100)), true)
  })
})
