import type { CollectionConfig } from 'payload'

export const ProductVariants: CollectionConfig = {
  slug: 'product-variants',
  admin: {
    useAsTitle: 'sku',
    defaultColumns: ['sku', 'title', 'price', 'inventory', 'product'],
    group: 'Catalog',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user && user.role !== 'customer'),
    update: ({ req: { user } }) => Boolean(user && user.role !== 'customer'),
    delete: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
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
          revalidatePath('/')
          revalidatePath('/products')
          revalidateTag('products')
        } catch {}
      },
    ],
    afterDelete: [
      async () => {
        try {
          const { clearStorefrontCache } = await import('@/lib/cms/products')
          clearStorefrontCache()
        } catch {}
        try {
          const { revalidatePath, revalidateTag } = await import('next/cache')
          revalidatePath('/')
          revalidatePath('/products')
          revalidateTag('products')
        } catch {}
      },
    ],
  },
  fields: [
    {
      name: 'sku',
      type: 'text',
      required: true,
      unique: true,
      label: 'SKU (Stock Keeping Unit)',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Variant Name (e.g. Midnight Blue / XL)',
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: 'Variant Price ($)',
    },
    {
      name: 'compareAtPrice',
      type: 'number',
      label: 'Compare-at Price ($)',
    },
    {
      name: 'inventory',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Available Stock Inventory',
    },
    {
      name: 'allowBackorder',
      type: 'checkbox',
      label: 'Allow Backorder When Out of Stock',
      defaultValue: false,
    },
    {
      name: 'options',
      type: 'array',
      label: 'Variant Options (Color, Size, Material, etc.)',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Option Name (e.g. Color)',
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          label: 'Option Value (e.g. Midnight Blue)',
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Variant Specific Image',
    },
  ],
}
