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
  hooks: {
    afterChange: [
      async () => {
        try {
          const { clearStorefrontCache } = await import('@/lib/cms/products')
          clearStorefrontCache()
        } catch {}
        try {
          const { revalidatePath, revalidateTag } = await import('next/cache')
          revalidatePath('/', 'layout')
          revalidateTag('store-settings')
        } catch {}
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'WhatsApp & Ordering',
          description: 'Configure official business WhatsApp number, order messages, floating chat icon, and manual UPI instructions.',
          fields: [
            {
              name: 'storeName',
              type: 'text',
              required: true,
              defaultValue: 'LOVIXA COSMETIC',
              label: 'Store Brand Name',
            },
            {
              name: 'whatsappCheckout',
              type: 'group',
              label: 'WhatsApp Ordering & Manual Payment Settings',
              admin: {
                description: 'Configure official business WhatsApp number, order message formats, floating WhatsApp chat icon, UPI ID, and manual payment instructions.',
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
                    description: 'International format without + or spaces (e.g. 919712460509). Used for WhatsApp checkout and customer redirect.',
                  },
                },
                {
                  name: 'orderMessageHeader',
                  type: 'text',
                  defaultValue: '*LOVIXA COSMETIC — NEW ORDER REQUEST*',
                  label: 'WhatsApp Order Message: Top Header / Title',
                  admin: {
                    description: 'Title line sent at top of WhatsApp order message. Use *text* for bold in WhatsApp.',
                  },
                },
                {
                  name: 'orderMessageNote',
                  type: 'textarea',
                  defaultValue: 'Please confirm product availability, shipping charges, and payment instructions.',
                  label: 'WhatsApp Order Message: Customer Note / Instructions',
                  admin: {
                    description: 'Instructions shown towards the bottom of the WhatsApp order message before closing.',
                  },
                },
                {
                  name: 'orderMessageFooter',
                  type: 'text',
                  defaultValue: 'Thank you for choosing LOVIXA COSMETIC.',
                  label: 'WhatsApp Order Message: Footer / Sign-off',
                  admin: {
                    description: 'Closing line at the end of the WhatsApp order message.',
                  },
                },
                {
                  name: 'customOrderTemplate',
                  type: 'textarea',
                  label: 'WhatsApp Order Message: Advanced Custom Template (Optional)',
                  admin: {
                    description: 'Leave empty to use standard formatted layout. Available placeholders: {orderNumber}, {customerName}, {customerMobile}, {customerEmail}, {items}, {subtotal}, {discount}, {shipping}, {grandTotal}, {address}, {landmark}, {city}, {state}, {pincode}, {paymentMethod}, {paymentStatus}, {orderStatus}, {note}, {footer}, {storeName}.',
                  },
                },
                {
                  name: 'orderSuccessMessage',
                  type: 'textarea',
                  defaultValue: 'Hello LOVIXA! I have placed order #{orderNumber}. Please confirm product availability and payment instructions.',
                  label: 'Order Success Page: WhatsApp Button Message',
                  admin: {
                    description: 'Pre-filled message when customer clicks WhatsApp button on the checkout success page. {orderNumber} will be replaced automatically.',
                  },
                },
                {
                  name: 'floatingIconEnabled',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Storefront Floating WhatsApp Icon: Enable / Show',
                  admin: {
                    description: 'Show or hide the floating WhatsApp chat button at bottom-right corner of the website.',
                  },
                },
                {
                  name: 'floatingIconNumber',
                  type: 'text',
                  label: 'Storefront Floating WhatsApp Icon: Phone Number (Optional override)',
                  admin: {
                    description: 'If left blank, uses the Official Business WhatsApp Number above.',
                  },
                },
                {
                  name: 'floatingIconMessage',
                  type: 'textarea',
                  defaultValue: 'Hello LOVIXA! I would like to know more about your hair care essentials.',
                  label: 'Storefront Floating WhatsApp Icon: Click Message',
                  admin: {
                    description: 'The pre-filled message that automatically opens in WhatsApp when a visitor clicks the floating WhatsApp icon on the site.',
                  },
                },
                {
                  name: 'floatingIconTooltip',
                  type: 'text',
                  defaultValue: 'Chat with LOVIXA on WhatsApp',
                  label: 'Storefront Floating WhatsApp Icon: Hover Tooltip / Accessibility Label',
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
          ],
        },
        {
          label: 'Contact & Social Details',
          fields: [
            {
              name: 'contact',
              type: 'group',
              label: 'Official Store Contact Details',
              admin: {
                description: 'Customer helpline, support email, address, WhatsApp, and working hours displayed across the footer and store.',
              },
              fields: [
                { name: 'phone', type: 'text', label: 'Support Phone Number', defaultValue: '+91 97124 60509' },
                { name: 'supportHours', type: 'text', label: 'Support Working Hours', defaultValue: 'Mon - Sat: 10:00 AM – 6:00 PM' },
                { name: 'email', type: 'text', label: 'Support Email', defaultValue: 'lovixacosmetic@gmail.com' },
                { name: 'address', type: 'textarea', label: 'Registered Business Address', defaultValue: 'Yogi Chowk Rd, Jai Bhawani Society, Punagam, Varachha, Surat, Gujarat 395011' },
                { name: 'whatsappNumber', type: 'text', label: 'Direct WhatsApp Support Number', defaultValue: '919712460509' },
                { name: 'googleMapsEmbedUrl', type: 'textarea', label: 'Google Maps Iframe Embed URL', defaultValue: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.8665389657434!2d72.8722421!3d21.2064114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f4a33190899%3A0xe54911ba8e3cf344!2sYogi%20Chowk%20Rd%2C%20Surat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin' },
                { name: 'googleMapsShareLink', type: 'text', label: 'Google Maps Clickable Link', defaultValue: 'https://maps.google.com/?q=Yogi+Chowk+Surat+Gujarat' },
              ],
            },
            {
              name: 'socialLinks',
              type: 'array',
              label: 'Official Social Media Profiles',
              defaultValue: [
                { platform: 'instagram', url: 'https://www.instagram.com/lovixa_cosmetic', label: 'Instagram' },
                { platform: 'facebook', url: 'https://www.facebook.com/p/Lovixa-Harbel-Care-61574511437687/', label: 'Facebook' },
                { platform: 'youtube', url: 'https://www.youtube.com/@lovixacosmetic', label: 'YouTube' },
              ],
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'WhatsApp', value: 'whatsapp' },
                    { label: 'Twitter / X', value: 'twitter' },
                    { label: 'LinkedIn', value: 'linkedin' },
                  ],
                },
                { name: 'url', type: 'text', required: true, label: 'Profile URL' },
                { name: 'label', type: 'text', label: 'Display Label' },
              ],
            },
          ],
        },
        {
          label: 'Currencies & Pricing',
          fields: [
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
          ],
        },
        {
          label: 'Shipping & Delivery',
          fields: [
            {
              name: 'shipping',
              type: 'group',
              label: 'Shipping Rates & Timelines',
              fields: [
                { name: 'flatRate', type: 'number', defaultValue: 99, label: 'Standard Flat Shipping Rate' },
                { name: 'freeShippingThreshold', type: 'number', defaultValue: 999, label: 'Free Shipping Threshold' },
                { name: 'freeShippingEnabled', type: 'checkbox', defaultValue: false, label: 'Enable Free Shipping' },
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
                  defaultValue: 'Pan-India express delivery (₹99 flat rate). Fast delivery in 3 - 5 business days.',
                },
                {
                  name: 'deliveryTimeline',
                  type: 'text',
                  label: 'Estimated Delivery Timeline',
                  defaultValue: '3 - 5 Business Days',
                },
              ],
            },
          ],
        },
        {
          label: 'Taxes & GST',
          fields: [
            {
              name: 'tax',
              type: 'group',
              label: 'Tax / GST Configuration',
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: true, label: 'Enable Taxes' },
                { name: 'ratePercentage', type: 'number', defaultValue: 18, label: 'GST Rate Percentage' },
                { name: 'pricesIncludeTax', type: 'checkbox', defaultValue: true, label: 'Catalog Prices Include GST' },
                { name: 'taxLabel', type: 'text', defaultValue: 'GST', label: 'Tax Label' },
              ],
            },
          ],
        },
        {
          label: 'Branding & Logo',
          fields: [
            {
              name: 'branding',
              type: 'group',
              label: 'Site Branding & Identity',
              fields: [
                { name: 'logo', type: 'upload', relationTo: 'media', label: 'Storefront Brand Logo' },
                { name: 'logoUrl', type: 'text', defaultValue: '/images/lovixa-logo.webp', label: 'Fallback Logo URL' },
                { name: 'logoAlt', type: 'text', defaultValue: 'LOVIXA COSMETIC', label: 'Logo Alt Text' },
                { name: 'copyrightText', type: 'text', defaultValue: '© 2026 LOVIXA COSMETIC. All rights reserved.', label: 'Footer Copyright Notice' },
                { name: 'footerTagline', type: 'text', defaultValue: 'Embrace Your Natural Beauty — Thoughtful hair care essentials crafted for everyday beauty rituals.', label: 'Footer Brand Tagline' },
              ],
            },
          ],
        },
        {
          label: 'Payment Gateways',
          fields: [
            {
              name: 'gateways',
              type: 'group',
              label: 'Active Store Payment Gateways',
              fields: [
                { name: 'enableWhatsApp', type: 'checkbox', defaultValue: true, label: 'Enable WhatsApp / Manual UPI Checkout' },
                { name: 'enableStripe', type: 'checkbox', defaultValue: false, label: 'Enable Stripe Payments' },
                { name: 'enableRazorpay', type: 'checkbox', defaultValue: false, label: 'Enable Razorpay Payments' },
                { name: 'enableCashOnDelivery', type: 'checkbox', defaultValue: false, label: 'Enable Cash On Delivery (COD)' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
