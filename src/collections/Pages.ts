import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'isPublished', 'updatedAt'],
    group: 'Content',
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
      label: 'Page Title',
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
      label: 'Published Live',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'badge',
      type: 'text',
      label: 'Header Badge (e.g. LOVIXA BOTANICAL)',
      defaultValue: 'LOVIXA COSMETIC',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Page Subtitle',
    },
    {
      name: 'headerImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Hero Banner Background Image',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Main Page Content',
    },
    {
      name: 'seo',
      type: 'group',
      label: 'Search Engine Optimization (SEO)',
      fields: [
        { name: 'metaTitle', type: 'text', label: 'Meta Title' },
        { name: 'metaDescription', type: 'textarea', label: 'Meta Description' },
        { name: 'focusKeywords', type: 'text', label: 'Target Focus Keywords' },
        { name: 'canonicalUrl', type: 'text', label: 'Canonical URL' },
        { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'Open Graph Social Image' },
        { name: 'noIndex', type: 'checkbox', label: 'Disallow Indexing (noindex)', defaultValue: false },
      ],
    },
  ],
}
