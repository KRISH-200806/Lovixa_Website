/**
 * LOVIXA COSMETIC — Official Business & Contact Constants
 * Single source of truth for business details across the entire storefront
 */

export const BUSINESS_DETAILS = {
  name: 'LOVIXA COSMETIC',
  tagline: 'Pure Botanical Hair Care & Ayurvedic Formulations',
  phone: {
    display: '+91 97124 60509',
    raw: '919712460509',
    tel: 'tel:+919712460509',
  },
  whatsapp: {
    display: '+91 97124 60509',
    number: '919712460509',
    link: 'https://wa.me/919712460509',
  },
  email: {
    address: 'lovixacosmetic@gmail.com',
    mailto: 'mailto:lovixacosmetic@gmail.com',
  },
  address: {
    full: 'Yogi Chowk Rd, Jai Bhawani Society, Punagam, Varachha, Surat, Gujarat 395011',
    street: 'Yogi Chowk Rd, Jai Bhawani Society, Punagam, Varachha',
    city: 'Surat',
    state: 'Gujarat',
    pincode: '395011',
    country: 'India',
    countryCode: 'IN',
  },
  hours: {
    display: 'Mon - Sat: 10:00 AM – 7:00 PM IST',
    short: '10:00 AM – 7:00 PM',
  },
  social: {
    instagram: {
      url: 'https://www.instagram.com/lovixa_cosmetic',
      handle: '@lovixa_cosmetic',
    },
    facebook: {
      url: 'https://www.facebook.com/p/Lovixa-Harbel-Care-61574511437687/',
      handle: 'Lovixa Harbel Care',
    },
  },
} as const
