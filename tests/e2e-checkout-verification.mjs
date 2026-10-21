import assert from 'node:assert/strict'

async function runE2ECheckoutTest() {
  console.log('--- 🧪 STARTING E2E WHATSAPP CHECKOUT VERIFICATION ---')

  const baseUrl = 'http://localhost:3001'

  // Step 1: Validate Coupon LOVIXA15
  console.log('1. Validating coupon LOVIXA15 for subtotal ₹598...')
  const couponRes = await fetch(`${baseUrl}/api/coupons/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: 'LOVIXA15', subtotal: 598 }),
  })
  assert.equal(couponRes.status, 200, 'Coupon validation should return 200')
  const couponData = await couponRes.json()
  assert.equal(couponData.valid, true, 'Coupon must be valid')
  assert.equal(couponData.discount, 89.7, '15% of 598 is 89.70')
  console.log(`   ✓ Coupon Validated: ${couponData.code} -> ₹${couponData.discount} discount`)

  // Step 2: Create Checkout Order
  console.log('2. Creating Pending Order via /api/checkout...')
  const checkoutPayload = {
    customerName: 'Komal Patel',
    customerEmail: 'komal.patel@testlovixa.com',
    customerPhone: '+91 91739 96739',
    currency: 'INR',
    currencySymbol: '₹',
    items: [
      {
        id: '6ad5a7630c45be98f3af16f3',
        product: '6ad5a7630c45be98f3af16f3',
        title: 'LOVIXA Shampoo',
        price: 299,
        quantity: 1,
        variantTitle: '500ml',
      },
      {
        id: '6ad5a7630c45be98f3af1707',
        product: '6ad5a7630c45be98f3af1707',
        title: 'LOVIXA Hair Oil',
        price: 299,
        quantity: 1,
        variantTitle: '50ml',
      },
    ],
    subtotal: 598,
    discountTotal: 89.7,
    couponCode: 'LOVIXA15',
    shippingTotal: 99,
    taxTotal: 0,
    grandTotal: 607.3,
    shippingAddress: {
      house: 'B-201, Green Acres',
      street: 'Bodakdev Road',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380054',
    },
  }

  const checkoutRes = await fetch(`${baseUrl}/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(checkoutPayload),
  })

  assert.equal(checkoutRes.status, 200, 'Checkout must return 200')
  const checkoutData = await checkoutRes.json()
  assert.equal(checkoutData.success, true, 'Checkout should indicate success')
  assert.ok(checkoutData.orderNumber, 'Must return orderNumber')
  assert.ok(checkoutData.guestAccessToken, 'Must return cryptographic guestAccessToken')
  assert.ok(checkoutData.whatsappUrl, 'Must return whatsappUrl')
  assert.ok(checkoutData.whatsappUrl.startsWith('https://wa.me/'), 'whatsappUrl must be wa.me')

  console.log(`   ✓ Pending Order Created: ${checkoutData.orderNumber}`)
  console.log(`   ✓ Guest Token Generated: ${checkoutData.guestAccessToken.slice(0, 16)}...`)
  console.log(`   ✓ WhatsApp Click-to-Chat URL Generated: ${checkoutData.whatsappUrl.slice(0, 60)}...`)

  // Step 3: Verify Security of /api/orders (Phase 1 Fix Verification)
  console.log('3. Verifying Security & Authorization on /api/orders...')

  // 3a: Anonymous list request without parameters -> Must return 401
  const anonListRes = await fetch(`${baseUrl}/api/orders`)
  assert.equal(anonListRes.status, 401, 'Anonymous listing of customer orders MUST return 401')
  console.log('   ✓ Anonymous list request blocked with 401 Unauthorized')

  // 3b: Query specific order WITHOUT guest token -> Must return 403
  const unauthOrderRes = await fetch(`${baseUrl}/api/orders?orderNumber=${checkoutData.orderNumber}`)
  assert.equal(unauthOrderRes.status, 403, 'Order query without guest token MUST return 403')
  console.log('   ✓ Unauthenticated order lookup blocked with 403 Forbidden')

  // 3c: Query specific order WITH valid guest token -> Must return 200
  const authOrderRes = await fetch(
    `${baseUrl}/api/orders?orderNumber=${checkoutData.orderNumber}&token=${checkoutData.guestAccessToken}`
  )
  assert.equal(authOrderRes.status, 200, 'Order query with valid token MUST return 200')
  const orderDetails = await authOrderRes.json()
  assert.ok(
    orderDetails.order.paymentStatus === 'unpaid' || orderDetails.order.paymentStatus === 'awaiting_payment',
    'Payment status must be unpaid or awaiting_payment'
  )
  assert.notEqual(orderDetails.order.paymentStatus, 'paid', 'Pending WhatsApp order must NEVER be marked as paid')
  assert.equal(orderDetails.order.total, 607.3, 'Grand total must be 607.30')
  console.log(`   ✓ Order retrieved with valid guest token: Order=${orderDetails.order.orderNumber}, Payment=${orderDetails.order.paymentStatus}, Total=₹${orderDetails.order.total}`)

  console.log('--- ✅ E2E WHATSAPP CHECKOUT VERIFICATION FULLY PASSED ---')
}

runE2ECheckoutTest().catch((err) => {
  console.error('❌ E2E Test Failed:', err)
  process.exit(1)
})
