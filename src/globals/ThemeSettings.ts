import type { GlobalConfig } from 'payload'

export const ThemeSettings: GlobalConfig = {
  slug: 'theme-settings',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
  },
  fields: [
    { name: 'primaryColor', type: 'text', defaultValue: '#6B2D5C' },
    { name: 'accentColor', type: 'text', defaultValue: '#E8C4D4' },
    { name: 'backgroundColor', type: 'text', defaultValue: '#FBF6F8' },
    { name: 'textColor', type: 'text', defaultValue: '#2B1822' },
    {
      name: 'fontFamily',
      type: 'select',
      defaultValue: 'inter',
      options: [
        { label: 'Inter', value: 'inter' },
        { label: 'Geist', value: 'geist' },
        { label: 'Outfit', value: 'outfit' },
      ],
    },
    {
      name: 'borderRadius',
      type: 'select',
      defaultValue: '0.75rem',
      options: [
        { label: 'Sharp (0px)', value: '0px' },
        { label: 'Rounded (8px)', value: '0.5rem' },
        { label: 'Smooth (12px)', value: '0.75rem' },
        { label: 'Pill (9999px)', value: '9999px' },
      ],
    },
  ],
}
