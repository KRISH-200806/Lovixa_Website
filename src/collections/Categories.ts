import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
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
          revalidatePath('/collections')
          revalidateTag('categories')
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
          revalidatePath('/collections')
          revalidateTag('categories')
        } catch {}
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'badge',
      type: 'text',
      label: 'Category Badge Tag',
      defaultValue: 'Botanical Hair Care',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
    },
    {
      name: 'attributes',
      type: 'array',
      label: 'Category-Specific Filterable Attributes',
      admin: {
        description: 'Define filterable attribute facets for this category (e.g. Hair Type, Hair Concern, Volume/Size)',
      },
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Attribute Name (e.g. Hair Concern)' },
        { name: 'slug', type: 'text', required: true, label: 'Attribute Key (e.g. concern)' },
        {
          name: 'options',
          type: 'array',
          label: 'Filter Options',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'value', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO Metadata',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
        { name: 'canonicalUrl', type: 'text' },
      ],
    },
  ],
}
