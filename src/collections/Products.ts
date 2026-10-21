import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'brand', 'basePrice', 'stock', 'isPublished'],
    group: 'Catalog',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user && user.role !== 'customer'),
    update: ({ req: { user } }) => Boolean(user && user.role !== 'customer'),
    delete: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      label: 'Published to Storefront',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'basePrice',
      type: 'number',
      required: true,
      label: 'Base Price ($)',
    },
    {
      name: 'compareAtPrice',
      type: 'number',
      label: 'Compare-at / Original Price ($)',
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Short Summary',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Full Description & Specifications',
    },
    {
      name: 'images',
      type: 'array',
      label: 'Product Gallery',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
        },
      ],
    },
    {
      name: 'hasVariants',
      type: 'checkbox',
      label: 'Has Multiple Variants (Size, Color, etc.)',
      defaultValue: false,
    },
    {
      name: 'variants',
      type: 'relationship',
      relationTo: 'product-variants',
      hasMany: true,
      admin: {
        condition: (data) => Boolean(data?.hasVariants),
      },
    },
    {
      name: 'trackInventory',
      type: 'checkbox',
      label: 'Track Stock Inventory',
      defaultValue: true,
    },
    {
      name: 'stock',
      type: 'number',
      label: 'Total Stock Quantity',
      defaultValue: 100,
    },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Featured', value: 'featured' },
        { label: 'Best Seller', value: 'best-seller' },
        { label: 'New Arrival', value: 'new-arrival' },
        { label: 'On Sale', value: 'on-sale' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'size',
      type: 'text',
      label: 'Size / Net Quantity (e.g. 500ml e, 50ml Dropper)',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'actives',
      type: 'array',
      label: 'Key Botanical Actives',
      admin: {
        description: 'Highlight key botanical extracts and active compounds (e.g. Botanical Cleansing Complex, Provitamin B5)',
      },
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Active Compound Name' },
        { name: 'desc', type: 'textarea', required: true, label: 'Scientific / Botanical Description' },
      ],
    },
    {
      name: 'ritualSteps',
      type: 'array',
      label: 'How to Use & Self-Care Ritual Steps',
      fields: [
        { name: 'stepNumber', type: 'number', label: 'Step #' },
        { name: 'title', type: 'text', label: 'Step Title (e.g. Cleanse, Nourish)' },
        { name: 'instruction', type: 'textarea', required: true, label: 'Step Instructions' },
      ],
    },
    {
      name: 'benefits',
      type: 'array',
      label: 'Product Benefits & Verified Claims',
      fields: [
        { name: 'claim', type: 'text', required: true, label: 'Verified Benefit Claim' },
        { name: 'highlight', type: 'checkbox', label: 'Feature on Product Card', defaultValue: false },
      ],
    },
    {
      name: 'ingredients',
      type: 'textarea',
      label: 'Complete Ingredients List (INCI)',
      admin: {
        description: 'Transparent declaration of all natural & botanical ingredients',
      },
    },
    {
      name: 'caution',
      type: 'textarea',
      label: 'Safety, Patch Test & Caution Guidance',
    },
    {
      name: 'categoryAttributes',
      type: 'array',
      label: 'Category-Specific Attributes & Properties',
      admin: {
        description: 'Dynamic attributes according to categories (e.g. Hair Type = Oily, Concern = Hair Fall, Volume = 500ml)',
      },
      fields: [
        { name: 'attributeKey', type: 'text', required: true, label: 'Attribute Key (e.g. hair-type, concern)' },
        { name: 'attributeName', type: 'text', label: 'Attribute Display Name (e.g. Hair Type)' },
        { name: 'value', type: 'text', required: true, label: 'Value (e.g. Oily Scalp)' },
      ],
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'Routine Pairs & Complementary Products',
      admin: {
        description: 'Select products that complete the customer care ritual',
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'Product SEO & Social Metadata',
      fields: [
        { name: 'metaTitle', type: 'text', label: 'SEO Title Tag' },
        { name: 'metaDescription', type: 'textarea', label: 'Meta Description' },
        { name: 'focusKeywords', type: 'text', label: 'Focus & Secondary Keywords' },
        { name: 'canonicalUrl', type: 'text', label: 'Canonical URL' },
        { name: 'noIndex', type: 'checkbox', label: 'Disallow Indexing (noindex)', defaultValue: false },
      ],
    },
  ],
}
