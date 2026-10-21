import type { CollectionConfig } from 'payload'

export const InventoryTransactions: CollectionConfig = {
  slug: 'inventory-transactions',
  admin: {
    useAsTitle: 'reason',
    defaultColumns: ['product', 'variant', 'type', 'quantity', 'previousStock', 'newStock', 'createdAt'],
    group: 'Inventory',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user && user.role !== 'customer'),
    create: ({ req: { user } }) => Boolean(user && user.role !== 'customer'),
    update: () => false, // Immutable audit trail
    delete: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      name: 'variant',
      type: 'relationship',
      relationTo: 'product-variants',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'manual_adjustment',
      options: [
        { label: 'Customer Order Deduction', value: 'order_deduction' },
        { label: 'Restock / Inbound Shipment', value: 'restock' },
        { label: 'Manual Adjustment', value: 'manual_adjustment' },
        { label: 'Customer Return Restock', value: 'return_restock' },
        { label: 'Damaged / Expired Write-off', value: 'damaged_writeoff' },
      ],
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
      label: 'Quantity Changed (+/-)',
    },
    {
      name: 'previousStock',
      type: 'number',
      required: true,
      label: 'Stock Before Transaction',
    },
    {
      name: 'newStock',
      type: 'number',
      required: true,
      label: 'Stock After Transaction',
    },
    {
      name: 'reason',
      type: 'text',
      required: true,
      label: 'Audit Reason / Memo',
    },
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      admin: {
        condition: (data) => Boolean(data?.order || data?.type === 'order_deduction'),
      },
    },
    {
      name: 'performedBy',
      type: 'relationship',
      relationTo: 'users',
    },
  ],
}
