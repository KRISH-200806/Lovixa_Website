import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: {
    group: 'Navigation',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user && user.role !== 'customer'),
  },
  fields: [
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Embrace Your Natural Beauty — Thoughtful hair care essentials crafted for everyday beauty rituals.',
    },
    {
      name: 'copyright',
      type: 'text',
      defaultValue: '© 2026 LOVIXA COSMETIC. All rights reserved.',
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        { name: 'platform', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}
