import type { GlobalConfig } from 'payload'

export const LanguageSettings: GlobalConfig = {
  slug: 'language-settings',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
  },
  fields: [
    { name: 'defaultLocale', type: 'text', defaultValue: 'en' },
    {
      name: 'supportedLocales',
      type: 'array',
      fields: [
        { name: 'code', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
  ],
}
