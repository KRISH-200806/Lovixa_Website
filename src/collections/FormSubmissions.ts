import type { CollectionConfig } from 'payload'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
    defaultColumns: ['formType', 'name', 'email', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user && user.role !== 'customer'),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
    delete: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
  },
  fields: [
    { name: 'formType', type: 'text', defaultValue: 'contact', required: true },
    { name: 'name', type: 'text' },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'message', type: 'textarea' },
    { name: 'metadata', type: 'json' },
  ],
}
