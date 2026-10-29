import type { GlobalConfig } from 'payload'

export const SEOSettings: GlobalConfig = {
  slug: 'seo-settings',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
  },
  fields: [
    {
      name: 'siteTitle',
      type: 'text',
      required: true,
      defaultValue: 'LOVIXA COSMETIC | Embrace Your Natural Beauty • Botanical Hair Care',
      label: 'Default Site Title',
    },
    {
      name: 'titleSeparator',
      type: 'text',
      defaultValue: '—',
      label: 'Title Separator Symbol',
    },
    {
      name: 'defaultMetaDescription',
      type: 'textarea',
      required: true,
      defaultValue: 'Discover LOVIXA Botanical Hair Care Essentials — Refreshing Botanical Shampoo (200ml) & Nourishing Hair Oil (100ml). Thoughtfully formulated with Rosemary, Eucalyptus & Cold-Pressed oils for healthier, radiant hair.',
      label: 'Default Meta Description',
    },
    {
      name: 'keywords',
      type: 'textarea',
      label: 'Core Focus Keywords (Comma separated)',
      defaultValue: 'LOVIXA, LOVIXA cosmetic, botanical shampoo, nourishing hair oil, rosemary hair care, ayurvedic hair oil, sulfate free clarifying shampoo, anti-frizz hair ritual',
      admin: {
        description: 'Target SEO keywords for the Indian & international cosmetics audience',
      },
    },
    {
      name: 'canonicalBaseUrl',
      type: 'text',
      defaultValue: 'https://www.lovixacosmetic.com',
      label: 'Production Canonical Base URL',
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Default Open Graph Social Share Image',
    },
    {
      name: 'googleVerification',
      type: 'text',
      label: 'Google Search Console Verification Token',
    },
    {
      name: 'bingVerification',
      type: 'text',
      label: 'Bing Webmaster Tools Verification Token',
    },
    {
      name: 'googleAnalyticsId',
      type: 'text',
      label: 'Google Analytics 4 Measurement ID (e.g. G-XXXXXXXXXX)',
      admin: {
        description: 'Enables automatic GA4 pageview tracking when set.',
      },
    },
    {
      name: 'googleTagManagerId',
      type: 'text',
      label: 'Google Tag Manager Container ID (e.g. GTM-XXXXXXX)',
    },
    {
      name: 'metaPixelId',
      type: 'text',
      label: 'Meta / Facebook Pixel ID (e.g. 123456789012345)',
      admin: {
        description: 'Enables Meta Pixel conversion tracking when set.',
      },
    },
    {
      name: 'organization',
      type: 'group',
      label: 'Organization JSON-LD Structured Data Schema',
      fields: [
        { name: 'name', type: 'text', defaultValue: 'LOVIXA COSMETIC' },
        { name: 'legalName', type: 'text', defaultValue: 'LOVIXA COSMETIC' },
        { name: 'contactEmail', type: 'text', defaultValue: 'lovixacosmetic@gmail.com' },
        { name: 'contactPhone', type: 'text', defaultValue: '+91 97124 60509' },
        { name: 'streetAddress', type: 'text', defaultValue: 'Yogi Chowk Rd, Jai Bhawani Society, Punagam, Varachha' },
        { name: 'addressLocality', type: 'text', defaultValue: 'Surat' },
        { name: 'addressRegion', type: 'text', defaultValue: 'Gujarat' },
        { name: 'postalCode', type: 'text', defaultValue: '395011' },
        { name: 'addressCountry', type: 'text', defaultValue: 'IN' },
        { name: 'instagramUrl', type: 'text', defaultValue: 'https://www.instagram.com/lovixa_cosmetic' },
        { name: 'facebookUrl', type: 'text', defaultValue: 'https://www.facebook.com/p/Lovixa-Harbel-Care-61574511437687/' },
      ],
    },
  ],
}
