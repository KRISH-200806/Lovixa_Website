import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customerName', 'customerPhone', 'grandTotal', 'orderStatus', 'paymentStatus', 'createdAt'],
    group: 'Sales',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || user.role === 'staff') return true
      return { customer: { equals: user.id } }
    },
    create: () => true, // Allowed for checkout process
    update: ({ req: { user } }) => Boolean(user && (user.role === 'admin' || user.role === 'staff')),
    delete: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'guestAccessToken',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      index: true,
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'customerEmail',
      type: 'email',
      // Optional for WhatsApp checkout
    },
    {
      name: 'customerName',
      type: 'text',
      required: true,
    },
    {
      name: 'customerPhone',
      type: 'text',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        { name: 'productId', type: 'text', required: true },
        { name: 'variantId', type: 'text' },
        { name: 'title', type: 'text', required: true },
        { name: 'sku', type: 'text' },
        { name: 'price', type: 'number', required: true },
        { name: 'quantity', type: 'number', required: true },
        { name: 'image', type: 'text' },
        { name: 'optionsSummary', type: 'text' },
      ],
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
    },
    {
      name: 'discountTotal',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'couponCode',
      type: 'text',
    },
    {
      name: 'shippingTotal',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'taxTotal',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'grandTotal',
      type: 'number',
      required: true,
    },
    {
      name: 'currency',
      type: 'text',
      label: 'Order Currency',
      defaultValue: 'USD',
      admin: {
        description: 'Currency selected by the customer at checkout',
      },
    },
    {
      name: 'baseCurrency',
      type: 'text',
      label: 'Store Base Currency',
      defaultValue: 'USD',
    },
    {
      name: 'baseGrandTotal',
      type: 'number',
      label: 'Total Converted in Base Currency',
      admin: {
        description: 'Order grand total converted into store base currency',
      },
    },
    {
      name: 'exchangeRate',
      type: 'number',
      label: 'Exchange Rate Applied',
      defaultValue: 1,
    },
    {
      name: 'currencyBreakdown',
      type: 'array',
      label: 'All Store Currencies Breakdown',
      admin: {
        description: 'Auto-converted values across all supported store currencies at time of order',
      },
      fields: [
        { name: 'code', type: 'text', required: true, label: 'Currency Code' },
        { name: 'symbol', type: 'text', required: true, label: 'Symbol' },
        { name: 'total', type: 'number', required: true, label: 'Converted Grand Total' },
        { name: 'exchangeRate', type: 'number', required: true, label: 'Exchange Rate' },
      ],
    },
    {
      name: 'orderStatus',
      type: 'select',
      defaultValue: 'awaiting_confirmation',
      label: 'Order Status',
      options: [
        { label: 'Awaiting WhatsApp Confirmation', value: 'awaiting_confirmation' },
        { label: 'Awaiting Payment', value: 'awaiting_payment' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'paymentStatus',
      type: 'select',
      defaultValue: 'unpaid',
      label: 'Payment Status',
      options: [
        { label: 'Unpaid', value: 'unpaid' },
        { label: 'Payment Verification Pending', value: 'verification_pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Refunded', value: 'refunded' },
        { label: 'Pending', value: 'pending' },
        { label: 'Failed', value: 'failed' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'paymentProvider',
      type: 'select',
      defaultValue: 'whatsapp_manual',
      label: 'Payment Method',
      options: [
        { label: 'Manual UPI / Bank Transfer (WhatsApp)', value: 'whatsapp_manual' },
        { label: 'Razorpay', value: 'razorpay' },
        { label: 'Stripe', value: 'stripe' },
        { label: 'Cash on Delivery', value: 'cod' },
        { label: 'Free Order', value: 'free' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'paymentIntentId',
      type: 'text',
      admin: { position: 'sidebar' },
    },
    {
      name: 'fulfillmentStatus',
      type: 'select',
      defaultValue: 'unfulfilled',
      label: 'Legacy Fulfillment Status',
      options: [
        { label: 'Unfulfilled', value: 'unfulfilled' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'shippingAddress',
      type: 'group',
      label: 'Delivery Address',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'firstName', type: 'text', admin: { width: '50%' } },
            { name: 'lastName', type: 'text', admin: { width: '50%' } },
          ],
        },
        { name: 'house', label: 'House / Flat / Building', type: 'text' },
        { name: 'street', label: 'Street / Area / Locality', type: 'text' },
        { name: 'landmark', label: 'Landmark (Optional)', type: 'text' },
        { name: 'address', label: 'Full Formatted Address', type: 'text', required: true },
        {
          type: 'row',
          fields: [
            { name: 'city', type: 'text', required: true, admin: { width: '40%' } },
            { name: 'state', label: 'State', type: 'text', required: true, admin: { width: '30%' } },
            { name: 'postalCode', label: 'Pincode', type: 'text', required: true, admin: { width: '30%' } },
          ],
        },
        { name: 'country', type: 'text', defaultValue: 'India' },
      ],
    },
    {
      name: 'trackingNumber',
      type: 'text',
      admin: { position: 'sidebar' },
    },
    {
      name: 'trackingUrl',
      type: 'text',
      admin: { position: 'sidebar' },
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      label: 'Admin Internal Notes',
      admin: {
        position: 'sidebar',
        description: 'Staff notes on customer WhatsApp communication, payment verification, or dispatch.',
      },
    },
  ],
}
