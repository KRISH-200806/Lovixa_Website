import type { CollectionConfig } from 'payload'

export const SeoReports: CollectionConfig = {
  slug: 'seo-reports',
  admin: {
    useAsTitle: 'url',
    group: 'Admin',
    defaultColumns: ['url', 'score', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user && user.role !== 'customer'),
    create: ({ req: { user } }) => Boolean(user && user.role !== 'customer'),
    update: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
    delete: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
  },
  fields: [
    { name: 'url', type: 'text', required: true },
    { name: 'score', type: 'number', required: true },
    { name: 'metrics', type: 'json' },
    { name: 'recommendations', type: 'array', fields: [{ name: 'item', type: 'text' }] },
  ],
}
