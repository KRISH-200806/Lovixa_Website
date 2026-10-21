import type { GlobalConfig } from 'payload'

export const AnnouncementBar: GlobalConfig = {
  slug: 'announcement-bar',
  admin: {
    group: 'Website Content',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user && user.role !== 'customer'),
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Enable Top Announcement Bar',
      defaultValue: true,
    },
    {
      name: 'messages',
      type: 'array',
      label: 'Ticker / Announcement Messages',
      fields: [
        { name: 'text', type: 'text', required: true, label: 'Message Text' },
        { name: 'highlight', type: 'text', label: 'Bold Highlight (e.g. LOVIXA15)' },
        { name: 'link', type: 'text', label: 'Optional Click Link (e.g. /products)' },
      ],
      defaultValue: [
        { text: 'FREE PAN-INDIA EXPRESS SHIPPING ON ALL ORDERS OVER ₹999', highlight: 'FREE SHIPPING', link: '/products' },
        { text: 'CONNECT WITH US ON WHATSAPP FOR EXCLUSIVE VIP OFFERS & PERSONAL VOUCHERS', highlight: 'VIP OFFERS', link: 'https://wa.me/919712460509?text=Hello%20Lovixa%2C%20I%20would%20like%20to%20receive%20an%20exclusive%20VIP%20discount%20code' },
        { text: '100% PURE BOTANICAL EXTRACTS • CRUELTY-FREE • AYURVEDIC FORMULATION', highlight: '100% BOTANICAL' },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'text',
      label: 'Background Hex Color',
      defaultValue: '#1F141A',
    },
    {
      name: 'textColor',
      type: 'text',
      label: 'Text Hex Color',
      defaultValue: '#FFFFFF',
    },
  ],
}
