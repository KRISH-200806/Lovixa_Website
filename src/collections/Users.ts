import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role'],
    group: 'Admin',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || user.role === 'staff') return true
      return { id: { equals: user.id } }
    },
    create: () => true, // Allowed for customer registration
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
    delete: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'customer',
      required: true,
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Staff / Store Manager', value: 'staff' },
        { label: 'Customer', value: 'customer' },
      ],
      access: {
        update: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
      },
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'savedAddresses',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', defaultValue: 'Home' },
        { name: 'addressLine1', type: 'text', required: true },
        { name: 'addressLine2', type: 'text' },
        { name: 'city', type: 'text', required: true },
        { name: 'state', type: 'text', required: true },
        { name: 'postalCode', type: 'text', required: true },
        { name: 'country', type: 'text', required: true, defaultValue: 'IN' },
        { name: 'isDefault', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'wishlist',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
  ],
}
