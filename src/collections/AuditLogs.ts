import type { CollectionConfig } from 'payload'

export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  admin: {
    useAsTitle: 'action',
    group: 'Admin',
    defaultColumns: ['action', 'user', 'collectionName', 'documentId', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
    create: () => false,
    update: () => false,
    delete: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
  },
  fields: [
    { name: 'action', type: 'text', required: true },
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'userEmail', type: 'text' },
    { name: 'collectionName', type: 'text', required: true },
    { name: 'documentId', type: 'text' },
    { name: 'changes', type: 'json' },
    { name: 'ipAddress', type: 'text' },
  ],
}
