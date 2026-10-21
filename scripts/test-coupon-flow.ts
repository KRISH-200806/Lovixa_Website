import { getPayload } from 'payload'
import configPromise from '../src/payload.config'
import assert from 'node:assert/strict'

async function runCouponVerification() {
  console.log('🧪 Starting Single-Use Coupon Verification Test...')
  const payload = await getPayload({ config: configPromise })

  const testCode = 'TESTVIP100'

  // Clean up if exists
  const existing = await payload.find({
    collection: 'coupons',
    where: { code: { equals: testCode } },
  })
  for (const doc of existing.docs) {
    await payload.delete({ collection: 'coupons', id: doc.id })
  }

  // 1. Admin creates a single-use coupon (usageLimit: 1, perUserLimit: 1)
  console.log('1. Admin creates a single-use coupon in Payload CMS...')
  const created = await payload.create({
    collection: 'coupons',
    data: {
      code: testCode,
      discountType: 'fixed_amount',
      discountValue: 100,
      minOrderAmount: 200,
      usageLimit: 1,
      perUserLimit: 1,
      usedCount: 0,
      isActive: true,
    },
  })
  console.log(`  ✓ Coupon created: ID=${created.id}, code=${created.code}, usageLimit=${created.usageLimit}, usedCount=${created.usedCount}`)

  // 2. Validate coupon for subtotal ₹500
  console.log('2. Customer validates coupon on website...')
  const validateRes = await fetch('http://localhost:3001/api/coupons/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: testCode,
      subtotal: 500,
      phone: '9876543210',
    }),
  })
  const validateData = await validateRes.json()
  assert.equal(validateRes.status, 200)
  assert.equal(validateData.valid, true)
  assert.equal(validateData.discount, 100)
  console.log(`  ✓ Validated successfully! Discount: ₹${validateData.discount}`)

  // 3. Customer places WhatsApp order using this coupon
  console.log('3. Customer places WhatsApp order using this coupon...')
  const checkoutRes = await fetch('http://localhost:3001/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'Bhavin Patel',
      customerPhone: '9712460509',
      customerEmail: 'bhavin@example.com',
      shippingAddress: {
        house: 'House 12',
        street: 'Yogi Chowk',
        city: 'Surat',
        state: 'Gujarat',
        pincode: '395011',
      },
      items: [
        {
          productId: 'prod-1',
          title: 'LOVIXA Shampoo',
          price: 299,
          quantity: 2,
        },
      ],
      subtotal: 598,
      discountTotal: 100,
      couponCode: testCode,
      shippingTotal: 99,
      grandTotal: 597,
      paymentProvider: 'whatsapp_manual',
    }),
  })
  const checkoutData = await checkoutRes.json()
  if (checkoutRes.status !== 200) {
    console.error('Checkout error details:', checkoutData)
  }
  assert.equal(checkoutRes.status, 200)
  assert.ok(checkoutData.orderNumber)
  console.log(`  ✓ Order placed! Order Number: ${checkoutData.orderNumber}`)

  // 4. Inspect coupon in database: usedCount must now be 1, usedBy must have phone
  console.log('4. Checking coupon state in database...')
  const updatedCoupon = await payload.findByID({
    collection: 'coupons',
    id: created.id,
  }) as any
  assert.equal(updatedCoupon.usedCount, 1, 'usedCount must be incremented to 1')
  assert.ok(updatedCoupon.usedBy && updatedCoupon.usedBy.length === 1, 'usedBy must have 1 record')
  assert.equal(updatedCoupon.usedBy[0].phone, '9712460509')
  console.log(`  ✓ Database verified: usedCount = ${updatedCoupon.usedCount}, usedBy phone = ${updatedCoupon.usedBy[0].phone}`)

  // 5. Customer (or another person) tries to validate or reuse this single-use coupon
  console.log('5. Re-validating used coupon...')
  const revalidateRes = await fetch('http://localhost:3001/api/coupons/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: testCode,
      subtotal: 500,
      phone: '9712460509',
    }),
  })
  const revalidateData = await revalidateRes.json()
  assert.equal(revalidateRes.status, 400)
  console.log(`  ✓ Correctly rejected with 400! Message: "${revalidateData.error}"`)

  // 6. Another person tries to place an order with this exhausted single-use coupon
  console.log('6. Another customer tries to place an order with exhausted coupon...')
  const recheckoutRes = await fetch('http://localhost:3001/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'Ramesh Shah',
      customerPhone: '9825123456',
      shippingAddress: {
        house: 'House 4',
        street: 'Varachha',
        city: 'Surat',
        state: 'Gujarat',
        pincode: '395011',
      },
      items: [
        {
          productId: 'prod-1',
          title: 'LOVIXA Shampoo',
          price: 299,
          quantity: 2,
        },
      ],
      subtotal: 598,
      discountTotal: 100,
      couponCode: testCode,
      shippingTotal: 99,
      grandTotal: 597,
      paymentProvider: 'whatsapp_manual',
    }),
  })
  const recheckoutData = await recheckoutRes.json()
  assert.equal(recheckoutRes.status, 400)
  console.log(`  ✓ Correctly blocked at checkout! Message: "${recheckoutData.error}"`)

  // Clean up test coupon
  await payload.delete({ collection: 'coupons', id: created.id })
  console.log('  ✓ Test coupon cleaned up.')

  console.log('🎉 ALL SINGLE-USE COUPON VERIFICATIONS PASSED 100%!')
  process.exit(0)
}

runCouponVerification().catch((err) => {
  console.error('❌ Coupon flow test failed:', err)
  process.exit(1)
})
