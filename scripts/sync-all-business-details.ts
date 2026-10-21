import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function main() {
  console.log('🔄 Syncing all official business details into Payload CMS database...')
  const payload = await getPayload({ config })

  // 1. Update store-settings
  await payload.updateGlobal({
    slug: 'store-settings',
    data: {
      storeName: 'LOVIXA COSMETIC',
      whatsappCheckout: {
        enabled: true,
        businessNumber: '919712460509',
        upiId: 'lovixacosmetic@upi',
      },
    },
  })
  console.log('✓ store-settings updated')

  // 2. Update seo-settings
  try {
    await payload.updateGlobal({
      slug: 'seo-settings',
      data: {
        organization: {
          name: 'LOVIXA COSMETIC',
          legalName: 'LOVIXA COSMETIC',
          contactEmail: 'lovixacosmetic@gmail.com',
          contactPhone: '+91 97124 60509',
          streetAddress: 'Yogi Chowk Rd, Jai Bhawani Society, Punagam, Varachha',
          addressLocality: 'Surat',
          addressRegion: 'Gujarat',
          postalCode: '395011',
          addressCountry: 'IN',
          instagramUrl: 'https://www.instagram.com/lovixa_cosmetic',
          facebookUrl: 'https://www.facebook.com/p/Lovixa-Harbel-Care-61574511437687/',
        },
      },
    })
    console.log('✓ seo-settings updated')
  } catch (err: any) {
    console.warn('Note on seo-settings:', err.message)
  }

  console.log('🎉 All official business details synced into Payload!')
  process.exit(0)
}

main().catch((err) => {
  console.error('Fatal sync error:', err)
  process.exit(1)
})
