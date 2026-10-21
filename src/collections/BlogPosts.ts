import type { CollectionConfig } from 'payload'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'isPublished', 'publishedAt'],
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
      label: 'Article Title',
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
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'Hair Wellness',
      options: [
        { label: 'Hair Wellness', value: 'hair-wellness' },
        { label: 'Self-Care Rituals', value: 'rituals' },
        { label: 'Botanical Science', value: 'botanical-science' },
        { label: 'Ayurvedic Scalp Care', value: 'ayurvedic-care' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'text',
      label: 'Author Name',
      defaultValue: 'LOVIXA Botanical Research Team',
    },
    {
      name: 'readTime',
      type: 'text',
      label: 'Estimated Read Time',
      defaultValue: '4 min read',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Short Excerpt / Summary',
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured Cover Image',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Article Content',
      required: true,
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags & Topics',
      fields: [
        { name: 'tag', type: 'text', required: true },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO & Social Share',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
        { name: 'focusKeywords', type: 'text' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
