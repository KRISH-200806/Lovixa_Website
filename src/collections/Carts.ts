import type { CollectionConfig } from 'payload'

export const Carts: CollectionConfig = {
  slug: 'carts',
  admin: {
    useAsTitle: 'cartToken',
    group: 'Sales',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'cartToken',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'productId', type: 'text', required: true },
        { name: 'variantId', type: 'text' },
        { name: 'quantity', type: 'number', required: true, min: 1 },
      ],
    },
    {
      name: 'couponCode',
      type: 'text',
    },
  ],
}
