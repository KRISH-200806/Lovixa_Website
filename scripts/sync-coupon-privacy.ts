import { getPayload } from 'payload'
import configPromise from '../src/payload.config'

async function syncCouponPrivacy() {
  console.log('🔄 Synchronizing Coupon Privacy & Removing Public Coupons...')
  const payload = await getPayload({ config: configPromise })

  // 1. Update Homepage global
  console.log('  → Updating Homepage global community copy...')
  const homepage = await payload.findGlobal({ slug: 'homepage' })
  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      ...homepage,
      community: {
        ...(homepage?.community || {}),
        vipBadge: 'THE LOVIXA PRIVILEGE CIRCLE',
        vipTitle: 'Join Our Community for Exclusive Offers',
        vipSubtitle:
          'Connect with our official WhatsApp community to receive your personal welcome discount voucher directly on your phone.',
        vipCode: '',
      },
    },
  })
  console.log('  ✓ Homepage global updated.')

  // 2. Update AnnouncementBar global
  console.log('  → Updating AnnouncementBar global messages...')
  await payload.updateGlobal({
    slug: 'announcement-bar',
    data: {
      enabled: true,
      messages: [
        {
          text: 'FREE PAN-INDIA EXPRESS SHIPPING ON ALL ORDERS OVER ₹999',
          highlight: 'FREE SHIPPING',
          link: '/products',
        },
        {
          text: 'CONNECT WITH US ON WHATSAPP FOR EXCLUSIVE VIP OFFERS & PERSONAL VOUCHERS',
          highlight: 'VIP OFFERS',
          link: 'https://wa.me/919712460509?text=Hello%20Lovixa%2C%20I%20would%20like%20to%20receive%20an%20exclusive%20VIP%20discount%20code',
        },
        {
          text: '100% PURE BOTANICAL EXTRACTS • CRUELTY-FREE • AYURVEDIC FORMULATION',
          highlight: '100% BOTANICAL',
          link: '/#why-choose',
        },
      ],
      backgroundColor: '#1F141A',
      textColor: '#FFFFFF',
    },
  })
  console.log('  ✓ AnnouncementBar global updated.')

  // 3. Inspect existing coupons in database
  console.log('  → Inspecting current coupons in database...')
  const existingCoupons = await payload.find({
    collection: 'coupons',
    limit: 50,
  })
  console.log(`  Found ${existingCoupons.docs.length} coupons in database:`)
  for (const c of existingCoupons.docs) {
    console.log(`    - Code: ${c.code} | Type: ${c.discountType} | Value: ${c.discountValue} | UsageLimit: ${c.usageLimit} | UsedCount: ${c.usedCount} | Active: ${c.isActive}`)
  }

  console.log('✅ Coupon Privacy Sync Completed Successfully!')
  process.exit(0)
}

syncCouponPrivacy().catch((err) => {
  console.error('❌ Error during coupon sync:', err)
  process.exit(1)
})
