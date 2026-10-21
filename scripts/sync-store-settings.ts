import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function syncStoreSettings() {
  console.log('🔄 LOVIXA Sync Store Settings to INR...')
  const payload = await getPayload({ config })

  const updatedSettings = await payload.updateGlobal({
    slug: 'store-settings',
    data: {
      storeName: 'LOVIXA COSMETIC',
      currency: {
        code: 'INR',
        symbol: '₹',
        baseValue: 1,
        decimals: 0,
      },
      supportedCurrencies: [
        {
          code: 'INR',
          symbol: '₹',
          name: 'Indian Rupee',
          exchangeRate: 1,
        },
      ],
      shipping: {
        flatRate: 99,
        freeShippingThreshold: 999,
        freeShippingEnabled: true,
        shippingPolicyNote: 'Free express Pan-India shipping on all orders over ₹999.',
        deliveryTimeline: '3 - 5 Business Days',
      },
      tax: {
        enabled: true,
        ratePercentage: 18,
        pricesIncludeTax: true,
        taxLabel: 'GST (Inclusive)',
      },
      whatsappCheckout: {
        enabled: true,
        businessNumber: '919712460509',
        upiId: 'lovixacosmetic@upi',
        bankDetails:
          'Bank: State Bank of India\nA/C Name: LOVIXA COSMETIC\nA/C Number: 1234567890\nIFSC: SBIN0001234',
        privacyNotice:
          'Your contact and delivery details will only be used by LOVIXA Concierge to confirm stock and dispatch your order.',
      },
    },
  })

  console.log('✅ Successfully updated store-settings in Payload CMS:')
  console.log(JSON.stringify(updatedSettings.currency, null, 2))
  console.log(JSON.stringify(updatedSettings.supportedCurrencies, null, 2))
  process.exit(0)
}

syncStoreSettings().catch((err) => {
  console.error('❌ Error syncing store settings:', err)
  process.exit(1)
})
