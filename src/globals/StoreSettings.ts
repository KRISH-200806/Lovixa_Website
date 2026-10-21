import type { GlobalConfig } from 'payload'

export const StoreSettings: GlobalConfig = {
  slug: 'store-settings',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
  },
  fields: [
    {
      name: 'storeName',
      type: 'text',
      required: true,
      defaultValue: 'LOVIXA COSMETIC',
    },
    {
      name: 'currency',
      type: 'group',
      label: '1. Store Base Currency (Catalog & Product Pricing Currency)',
      admin: {
        description:
          'Declare your primary base currency. All product prices in Admin are entered in this currency (Base value = 1.0).',
      },
      fields: [
        {
          name: 'code',
          type: 'text',
          label: 'Base Currency Code (e.g. INR)',
          required: true,
          defaultValue: 'INR',
          admin: {
            description: 'The code of your base currency (e.g. INR).',
          },
        },
        {
          name: 'symbol',
          type: 'text',
          required: true,
          defaultValue: '₹',
          label: 'Base Currency Symbol (e.g. ₹)',
          admin: {
            description: 'Symbol for base currency.',
          },
        },
        {
          name: 'baseValue',
          type: 'number',
          required: true,
          defaultValue: 1,
          label: 'Base Currency Unit Value (Standard = 1.0)',
          admin: {
            description: 'Base standard unit value (1.0). All other currency exchange rates are measured relative to this 1 base unit.',
          },
        },
        {
          name: 'decimals',
          type: 'number',
          defaultValue: 0,
          label: 'Decimal Places (e.g. 0)',
        },
      ],
    },
    {
      name: 'supportedCurrencies',
      type: 'array',
      label: '2. Available Website Currencies (Converted relative to Base Currency)',
      admin: {
        description:
          'Declare the currencies available on the website storefront. For Indian Rupee store, keep INR at rate 1.',
      },
      defaultValue: [
        { code: 'INR', symbol: '₹', name: 'Indian Rupee', exchangeRate: 1 },
      ],
      fields: [
        { name: 'code', type: 'text', required: true, label: 'Currency Code (e.g. INR)' },
        { name: 'symbol', type: 'text', required: true, label: 'Currency Symbol (e.g. ₹)' },
        { name: 'name', type: 'text', required: true, label: 'Currency Name (e.g. Indian Rupee)' },
        {
          name: 'exchangeRate',
          type: 'number',
          required: true,
          defaultValue: 1,
          label: 'Value Compared to 1 Base Unit (Standard = 1)',
          admin: {
            description: 'Multiplier: Website Price = Base Product Price × This Value',
          },
        },
      ],
    },
    {
      name: 'tax',
      type: 'group',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        { name: 'ratePercentage', type: 'number', defaultValue: 8.25 },
        { name: 'pricesIncludeTax', type: 'checkbox', defaultValue: false },
        { name: 'taxLabel', type: 'text', defaultValue: 'Sales Tax' },
      ],
    },
    {
      name: 'shipping',
      type: 'group',
      fields: [
        { name: 'flatRate', type: 'number', defaultValue: 99, label: 'Standard Flat Shipping Rate' },
        { name: 'freeShippingThreshold', type: 'number', defaultValue: 999, label: 'Free Shipping Threshold' },
        { name: 'freeShippingEnabled', type: 'checkbox', defaultValue: true, label: 'Enable Free Shipping' },
        {
          name: 'serviceablePincodes',
          type: 'textarea',
          label: 'Serviceable Pincodes (Optional)',
          admin: {
            description: 'Comma or whitespace separated 6-digit Indian pincodes. Leave blank to allow orders across all of India.',
          },
        },
        {
          name: 'shippingPolicyNote',
          type: 'text',
          label: 'Shipping Policy Short Note',
          defaultValue: 'Free express Pan-India shipping on all orders over ₹999.',
        },
        {
          name: 'deliveryTimeline',
          type: 'text',
          label: 'Estimated Delivery Timeline',
          defaultValue: '3 - 5 Business Days',
        },
      ],
    },
    {
      name: 'whatsappCheckout',
      type: 'group',
      label: 'WhatsApp Ordering & Manual Payment Settings',
      admin: {
        description: 'Configure official business WhatsApp number, UPI ID, and instructions for WhatsApp checkout.',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable WhatsApp Order Checkout',
        },
        {
          name: 'businessNumber',
          type: 'text',
          defaultValue: '919712460509',
          label: 'Official Business WhatsApp Number',
          admin: {
            description: 'International format without + or spaces (e.g. 919712460509). Click-to-chat links will redirect customers here.',
          },
        },
        {
          name: 'upiId',
          type: 'text',
          defaultValue: 'lovixacosmetic@upi',
          label: 'Official Business UPI ID',
          admin: {
            description: 'The UPI ID shared with customers on WhatsApp for manual payments (GPay, PhonePe, Paytm, etc.).',
          },
        },
        {
          name: 'bankDetails',
          type: 'textarea',
          label: 'Bank Account Details (Optional)',
          defaultValue: 'Bank: State Bank of India\nA/C Name: LOVIXA COSMETIC\nA/C Number: 1234567890\nIFSC: SBIN0001234',
        },
        {
          name: 'privacyNotice',
          type: 'text',
          label: 'Checkout Privacy Notice',
          defaultValue: 'Your contact and delivery details will only be used by LOVIXA Concierge to confirm stock and dispatch your order.',
        },
      ],
    },
    {
      name: 'gateways',
      type: 'group',
      fields: [
        { name: 'enableWhatsApp', type: 'checkbox', defaultValue: true, label: 'Enable WhatsApp / Manual UPI Checkout' },
        { name: 'enableStripe', type: 'checkbox', defaultValue: false },
        { name: 'enableRazorpay', type: 'checkbox', defaultValue: false },
        { name: 'enableCashOnDelivery', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
}
