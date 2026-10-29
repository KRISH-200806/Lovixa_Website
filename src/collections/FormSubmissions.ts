import type { CollectionConfig } from 'payload'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  labels: {
    singular: 'Customer Inquiry',
    plural: 'Customer Inquiries & Form Submissions',
  },
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
    defaultColumns: ['status', 'formType', 'name', 'email', 'phone', 'createdAt'],
    description: 'View customer contact messages, routine inquiries, and update reply status.',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user && user.role !== 'customer'),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user && user.role !== 'customer'),
    delete: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: '🟢 New / Unread', value: 'new' },
        { label: '🟡 Read / In Review', value: 'read' },
        { label: '🔵 Replied / Resolved', value: 'replied' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    { name: 'formType', type: 'text', defaultValue: 'contact', required: true, admin: { position: 'sidebar' } },
    { name: 'name', type: 'text', label: 'Customer Name' },
    { name: 'email', type: 'email', required: true, label: 'Email Address' },
    { name: 'phone', type: 'text', label: 'Phone Number' },
    { name: 'message', type: 'textarea', label: 'Inquiry Message' },
    { name: 'adminNotes', type: 'textarea', label: 'Internal Staff Notes / Reply Log' },
    { name: 'metadata', type: 'json' },
  ],
}
