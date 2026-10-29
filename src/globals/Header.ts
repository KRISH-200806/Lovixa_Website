import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  admin: {
    group: 'Navigation',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user && user.role !== 'customer'),
  },
  fields: [
    {
      name: 'announcement',
      type: 'group',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        { name: 'text', type: 'text', defaultValue: '🌿 100% Authentic Ayurvedic Botanical Hair Care | Pan-India Delivery' },
        { name: 'link', type: 'text', defaultValue: '/products' },
      ],
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'link', type: 'text', required: true },
        { name: 'badge', type: 'text' },
      ],
      defaultValue: [
        { label: 'Home', link: '/' },
        { label: 'Shop All', link: '/products' },
        { label: 'Hair Care', link: '/#collection' },
        { label: 'Our Story', link: '/about' },
        { label: 'Contact Us', link: '/contact' },
      ],
    },
  ],
}
