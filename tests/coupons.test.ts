import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

interface MockCoupon {
  code: string
  discountType: 'percentage' | 'fixed_amount' | 'free_shipping'
  discountValue: number
  minOrderAmount?: number
  maxDiscountAmount?: number
  expiresAt?: string
  usageLimit?: number
  usedCount?: number
  isActive: boolean
}

function calculateDiscount(coupon: MockCoupon, subtotal: number, shippingFee = 9.99) {
  if (!coupon.isActive) {
    return { valid: false, error: 'Coupon is inactive' }
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, error: 'Coupon has expired' }
  }

  if (coupon.usageLimit && (coupon.usedCount || 0) >= coupon.usageLimit) {
    return { valid: false, error: 'Coupon usage limit reached' }
  }

  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      error: `Minimum order amount of $${coupon.minOrderAmount} required`,
    }
  }

  let discount = 0
  if (coupon.discountType === 'percentage') {
    discount = (subtotal * coupon.discountValue) / 100
    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount
    }
  } else if (coupon.discountType === 'fixed_amount') {
    discount = Math.min(coupon.discountValue, subtotal)
  } else if (coupon.discountType === 'free_shipping') {
    discount = shippingFee
  }

  return { valid: true, discount: Number(discount.toFixed(2)) }
}

describe('Dynamic CMS Coupon Engine', () => {
  it('calculates percentage discounts correctly', () => {
    const coupon: MockCoupon = {
      code: 'SAVE20',
      discountType: 'percentage',
      discountValue: 20,
      isActive: true,
    }
    const result = calculateDiscount(coupon, 100)
    assert.equal(result.valid, true)
    assert.equal(result.discount, 20)
  })

  it('respects maximum discount caps', () => {
    const coupon: MockCoupon = {
      code: 'HALFPRICE',
      discountType: 'percentage',
      discountValue: 50,
      maxDiscountAmount: 30,
      isActive: true,
    }
    const result = calculateDiscount(coupon, 200)
    assert.equal(result.valid, true)
    assert.equal(result.discount, 30)
  })

  it('calculates fixed amount discounts correctly', () => {
    const coupon: MockCoupon = {
      code: 'FLAT15',
      discountType: 'fixed_amount',
      discountValue: 15,
      isActive: true,
    }
    const result = calculateDiscount(coupon, 50)
    assert.equal(result.valid, true)
    assert.equal(result.discount, 15)
  })

  it('enforces minimum order requirements', () => {
    const coupon: MockCoupon = {
      code: 'VIP50',
      discountType: 'fixed_amount',
      discountValue: 50,
      minOrderAmount: 150,
      isActive: true,
    }
    const belowMin = calculateDiscount(coupon, 100)
    assert.equal(belowMin.valid, false)

    const aboveMin = calculateDiscount(coupon, 160)
    assert.equal(aboveMin.valid, true)
    assert.equal(aboveMin.discount, 50)
  })

  it('rejects expired coupons', () => {
    const coupon: MockCoupon = {
      code: 'EXPIRED2020',
      discountType: 'percentage',
      discountValue: 20,
      expiresAt: '2020-01-01T00:00:00Z',
      isActive: true,
    }
    const result = calculateDiscount(coupon, 100)
    assert.equal(result.valid, false)
    assert.equal(result.error, 'Coupon has expired')
  })
})
