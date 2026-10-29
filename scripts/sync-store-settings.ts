import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function syncStoreSettings() {
  console.log('🔄 LOVIXA Sync Store Settings (Branding, Contact, Maps, Socials)...')
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
        freeShippingEnabled: false,
        shippingPolicyNote: 'Pan-India express delivery (₹99 flat rate). Fast delivery in 3 - 5 business days.',
        deliveryTimeline: '3 - 5 Business Days',
      },
      tax: {
        enabled: true,
        ratePercentage: 18,
        pricesIncludeTax: true,
        taxLabel: 'GST',
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
      branding: {
        logoUrl: '/images/lovixa-logo.webp',
        logoAlt: 'LOVIXA COSMETIC',
        copyrightText: '© 2026 LOVIXA COSMETIC. All rights reserved.',
        footerTagline: 'Embrace Your Natural Beauty — Thoughtful hair care essentials crafted for everyday beauty rituals.',
      },
      contact: {
        phone: '+91 97124 60509',
        supportHours: 'Mon - Sat: 10:00 AM – 6:00 PM',
        email: 'lovixacosmetic@gmail.com',
        address: 'Yogi Chowk Rd, Jai Bhawani Society, Punagam, Varachha, Surat, Gujarat 395011',
        whatsappNumber: '919712460509',
        googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.8665389657434!2d72.8722421!3d21.2064114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f4a33190899%3A0xe54911ba8e3cf344!2sYogi%20Chowk%20Rd%2C%20Surat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
        googleMapsShareLink: 'https://maps.google.com/?q=Yogi+Chowk+Surat+Gujarat',
      },
      socialLinks: [
        { platform: 'instagram', url: 'https://www.instagram.com/lovixa_cosmetic', label: 'Instagram' },
        { platform: 'facebook', url: 'https://www.facebook.com/p/Lovixa-Harbel-Care-61574511437687/', label: 'Facebook' },
        { platform: 'youtube', url: 'https://www.youtube.com/@lovixacosmetic', label: 'YouTube' },
        { platform: 'whatsapp', url: 'https://wa.me/919712460509', label: 'WhatsApp' },
      ],
    } as any,
  })

  console.log('✅ Successfully updated store-settings in Payload CMS with Branding, Contact, and Maps!')
  process.exit(0)
}

syncStoreSettings().catch((err) => {
  console.error('❌ Error syncing store settings:', err)
  process.exit(1)
})
