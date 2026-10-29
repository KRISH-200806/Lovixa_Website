import { getPayload } from 'payload'
import configPromise from '../src/payload.config'
import { config as loadDotenv } from 'dotenv'

loadDotenv()

async function syncAllCatalogAndShipping() {
  console.log('🚀 Running Master Sync: 200ml/100ml Sizes & Complete Free Shipping Removal across MongoDB...')
  const payload = await getPayload({ config: configPromise })

  // 1. Sync Products
  console.log('→ Updating Products in database...')
  const duoDoc = await payload.find({
    collection: 'products',
    where: { slug: { equals: 'lovixa-hair-care-duo' } },
    limit: 1,
  })

  if (duoDoc.docs.length > 0) {
    await payload.update({
      collection: 'products',
      id: duoDoc.docs[0].id,
      data: {
        size: 'Complete Ritual Pair: 200ml Shampoo + 100ml Hair Oil',
        shortDescription:
          'Two Essentials. One Beautiful Ritual. Pair your LOVIXA Shampoo (200ml) with our Hair Oil (100ml) and make every hair care day feel special.',
        ingredients:
          'LOVIXA Shampoo (200ml) and LOVIXA Hair Oil (100ml) formulation ingredients as declared on primary bottles.',
        seo: {
          metaTitle: 'LOVIXA Hair Care Duo (Shampoo 200ml + Oil 100ml) — Value Combo | LOVIXA',
          metaDescription:
            'Shop LOVIXA Complete Hair Care Duo at special combo price. Includes 200ml Botanical Shampoo & 100ml Nourishing Hair Oil.',
          focusKeywords: 'hair care combo, shampoo and hair oil set, ayurvedic hair kit, LOVIXA duo',
        },
      },
    })
    console.log('  ✓ Updated lovixa-hair-care-duo product')
  }

  const shampooDoc = await payload.find({
    collection: 'products',
    where: { slug: { equals: 'lovixa-shampoo' } },
    limit: 1,
  })
  if (shampooDoc.docs.length > 0) {
    await payload.update({
      collection: 'products',
      id: shampooDoc.docs[0].id,
      data: {
        size: '200ml e (6.76 fl. oz)',
        seo: {
          metaTitle: 'LOVIXA Shampoo (200ml) — Botanical Hair Cleanser | LOVIXA COSMETIC',
          metaDescription:
            'Shop LOVIXA Botanical Refreshing Shampoo (200ml) online. Gentle clarifying formula with Rosemary and Provitamin B5 for soft, healthy hair.',
          focusKeywords: 'botanical shampoo, sulfate free shampoo, rosemary shampoo, hair care, LOVIXA cosmetic',
        },
      },
    })
    console.log('  ✓ Updated lovixa-shampoo product')
  }

  const oilDoc = await payload.find({
    collection: 'products',
    where: { slug: { equals: 'lovixa-hair-oil' } },
    limit: 1,
  })
  if (oilDoc.docs.length > 0) {
    await payload.update({
      collection: 'products',
      id: oilDoc.docs[0].id,
      data: {
        size: '100ml Comb Applicator Bottle',
        seo: {
          metaTitle: 'LOVIXA Hair Oil (100ml) — Nourishing Cold-Pressed Elixir | LOVIXA COSMETIC',
          metaDescription:
            'Shop LOVIXA Cold-Pressed Nourishing Hair Oil (100ml) online. Traditional botanical blend of 14 herbs for deep root strength and natural gloss.',
          focusKeywords: 'nourishing hair oil, cold pressed hair oil, ayurvedic hair oil, rosemary hair oil, LOVIXA cosmetic',
        },
      },
    })
    console.log('  ✓ Updated lovixa-hair-oil product')
  }

  // 2. Sync Variants
  console.log('→ Updating Product Variants in database...')
  const variants = await payload.find({
    collection: 'product-variants',
    limit: 50,
  })
  for (const v of variants.docs) {
    if (v.sku === 'LVX-DUO-SET') {
      await payload.update({
        collection: 'product-variants',
        id: v.id,
        data: {
          title: 'Complete Ritual Duo Set (200ml + 100ml)',
        },
      })
      console.log('  ✓ Updated variant LVX-DUO-SET')
    } else if (v.sku === 'LVX-SHMP-500ML' || v.sku === 'LVX-SHMP-200ML') {
      await payload.update({
        collection: 'product-variants',
        id: v.id,
        data: {
          sku: 'LVX-SHMP-200ML',
          title: '200ml Bottle',
        },
      })
      console.log('  ✓ Updated variant LVX-SHMP-200ML')
    } else if (v.sku === 'LVX-OIL-50ML' || v.sku === 'LVX-OIL-100ML') {
      await payload.update({
        collection: 'product-variants',
        id: v.id,
        data: {
          sku: 'LVX-OIL-100ML',
          title: '100ml Comb Bottle',
        },
      })
      console.log('  ✓ Updated variant LVX-OIL-100ML')
    }
  }

  // 3. Sync Homepage Global
  console.log('→ Updating Homepage global...')
  const hp = await payload.findGlobal({ slug: 'homepage' })
  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      ...hp,
      promoBanner: {
        ...(hp?.promoBanner || {}),
        productTitle: 'Botanical Shampoo (200ml) + Hair Oil (100ml)',
        freeShippingText: '',
      },
    },
  })
  console.log('  ✓ Homepage global updated.')

  // 4. Sync StoreSettings Global (Disable Free Shipping)
  console.log('→ Updating StoreSettings global (disabling free shipping)...')
  const storeSettings = await payload.findGlobal({ slug: 'store-settings' })
  await payload.updateGlobal({
    slug: 'store-settings',
    data: {
      ...storeSettings,
      shipping: {
        ...(storeSettings?.shipping || {}),
        flatRate: 99,
        freeShippingThreshold: 999,
        freeShippingEnabled: false,
        shippingPolicyNote: 'Pan-India express delivery (₹99 flat rate). Fast delivery in 3 - 5 business days.',
        deliveryTimeline: '3 - 5 Business Days',
      },
    },
  })
  console.log('  ✓ StoreSettings global updated: freeShippingEnabled = false')

  // 5. Sync AnnouncementBar Global
  console.log('→ Updating AnnouncementBar global...')
  await payload.updateGlobal({
    slug: 'announcement-bar',
    data: {
      enabled: true,
      messages: [
        {
          text: 'EXPRESS PAN-INDIA DELIVERY WITH REAL-TIME TRACKING',
          highlight: 'PAN-INDIA DELIVERY',
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

  // 6. Sync Header Global
  console.log('→ Updating Header global...')
  const header = await payload.findGlobal({ slug: 'header' })
  await payload.updateGlobal({
    slug: 'header',
    data: {
      ...header,
      announcement: {
        enabled: true,
        text: '🌿 100% Authentic Ayurvedic Botanical Hair Care | Pan-India Delivery',
        link: '/products',
      },
    },
  })
  console.log('  ✓ Header global updated.')

  // 7. Sync SEOSettings Global
  console.log('→ Updating SEOSettings global...')
  const seoSettings = await payload.findGlobal({ slug: 'seo-settings' })
  await payload.updateGlobal({
    slug: 'seo-settings',
    data: {
      ...seoSettings,
      defaultMetaDescription:
        'Discover LOVIXA Botanical Hair Care Essentials — Refreshing Botanical Shampoo (200ml) & Nourishing Hair Oil (100ml). Thoughtfully formulated with Rosemary, Eucalyptus & Cold-Pressed oils for healthier, radiant hair.',
    },
  })
  console.log('  ✓ SEOSettings global updated.')

  // 8. Sync Shipping Policy Page
  console.log('→ Updating Shipping Policy page in database...')
  const shippingPage = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'shipping-policy' } },
    limit: 1,
  })
  if (shippingPage.docs.length > 0) {
    const existingSections = shippingPage.docs[0].sections || []
    const updatedSections = existingSections.map((sec: any) => {
      if (sec.heading && sec.heading.includes('3.')) {
        return {
          heading: '3. Shipping Charges & Delivery Policy',
          content: '• Standard Express Shipping: A nominal flat fee of ₹99 applies to orders to cover protective handling and courier carriage with real-time tracking.',
        }
      }
      return sec
    })
    await payload.update({
      collection: 'pages',
      id: shippingPage.docs[0].id,
      data: {
        sections: updatedSections,
      },
    })
    console.log('  ✓ Updated Shipping Policy page')
  }

  console.log('🎉 Master sync finished successfully!')
  process.exit(0)
}

syncAllCatalogAndShipping().catch((err) => {
  console.error('❌ Error during master sync:', err)
  process.exit(1)
})
