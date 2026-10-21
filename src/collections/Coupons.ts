import type { CollectionConfig } from 'payload'

export const Coupons: CollectionConfig = {
  slug: 'coupons',
  admin: {
    useAsTitle: 'code',
    group: 'Promotions',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user && user.role !== 'customer'),
    update: ({ req: { user } }) => Boolean(user && user.role !== 'customer'),
    delete: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique coupon code in UPPERCASE (e.g. VIP50, WELCOME20, SPECIAL10).',
      },
    },
    {
      name: 'discountType',
      type: 'select',
      required: true,
      defaultValue: 'percentage',
      options: [
        { label: 'Percentage (%)', value: 'percentage' },
        { label: 'Fixed Amount (₹)', value: 'fixed_amount' },
        { label: 'Free Shipping', value: 'free_shipping' },
      ],
    },
    {
      name: 'discountValue',
      type: 'number',
      required: true,
      admin: {
        description: 'Discount amount: % (e.g. 15) or Flat ₹ (e.g. 100).',
      },
    },
    {
      name: 'minOrderAmount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Minimum cart subtotal in ₹ required to apply this coupon (0 for no minimum).',
      },
    },
    {
      name: 'maxDiscountAmount',
      type: 'number',
      admin: {
        description: 'Maximum cap on discount in ₹ (optional).',
      },
    },
    {
      name: 'usageLimit',
      type: 'number',
      defaultValue: 1,
      admin: {
        description: 'Total times this coupon can be redeemed across the store. Set to 1 for a single-use coupon (only 1 customer can use it once).',
      },
    },
    {
      name: 'perUserLimit',
      type: 'number',
      defaultValue: 1,
      admin: {
        description: 'Maximum times a single customer (phone or email) can redeem this coupon (default 1).',
      },
    },
    {
      name: 'usedCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Total number of times this coupon has been used in orders.',
      },
    },
    {
      name: 'usedBy',
      type: 'array',
      label: 'Redemption History',
      admin: {
        readOnly: true,
        description: 'Log of customers who redeemed this coupon.',
      },
      fields: [
        { name: 'phone', type: 'text' },
        { name: 'email', type: 'text' },
        { name: 'orderNumber', type: 'text' },
        { name: 'usedAt', type: 'date' },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Enable or disable this coupon code anytime.',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      admin: {
        description: 'Optional expiration date & time.',
      },
    },
  ],
}
