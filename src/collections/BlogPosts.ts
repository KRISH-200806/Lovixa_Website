import type { CollectionConfig } from 'payload'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  labels: {
    singular: 'Blog Post / Article',
    plural: 'Blog Posts & Hair Wellness Journal',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedAt'],
    group: 'Content',
    description: 'Manage hair wellness articles, scalp care guides, routine stories, and SEO metadata.',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user && user.role !== 'customer'),
    update: ({ req: { user } }) => Boolean(user && user.role !== 'customer'),
    delete: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc }) => {
        try {
          const { revalidatePath, revalidateTag } = await import('next/cache')
          revalidatePath('/blog')
          if (doc?.slug) {
            revalidatePath(`/blog/${doc.slug}`)
            revalidateTag(`blog-post-${doc.slug}`)
          }
          if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
            revalidatePath(`/blog/${previousDoc.slug}`)
          }
          revalidateTag('blog-posts')
        } catch {}
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        try {
          const { revalidatePath, revalidateTag } = await import('next/cache')
          revalidatePath('/blog')
          if (doc?.slug) {
            revalidatePath(`/blog/${doc.slug}`)
            revalidateTag(`blog-post-${doc.slug}`)
          }
          revalidateTag('blog-posts')
        } catch {}
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Article Details',
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
                description: 'Unique URL path (e.g. rosemary-oil-benefits-for-hair-growth)',
              },
            },
            {
              name: 'status',
              type: 'select',
              label: 'Publication Status',
              defaultValue: 'published',
              options: [
                { label: '🟢 Published', value: 'published' },
                { label: '🟡 Draft', value: 'draft' },
                { label: '🔵 Scheduled', value: 'scheduled' },
              ],
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'isPublished',
              type: 'checkbox',
              label: 'Live on Storefront',
              defaultValue: true,
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'publishedAt',
              type: 'date',
              label: 'Publish Date',
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
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'readTime',
              type: 'text',
              label: 'Estimated Read Time',
              defaultValue: '4 min read',
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'excerpt',
              type: 'textarea',
              label: 'Short Excerpt / Teaser',
              required: true,
              admin: {
                description: 'Displayed on the blog listing cards and search results.',
              },
            },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Featured Cover Image (Media Upload)',
            },
            {
              name: 'featuredImageUrl',
              type: 'text',
              label: 'Fallback Featured Cover Image URL (e.g. /images/lovixa-hero.jpg)',
            },
            {
              name: 'featuredImageAlt',
              type: 'text',
              label: 'Featured Image Alt Text',
              defaultValue: 'LOVIXA Botanical Hair Care Article Cover',
            },
            {
              name: 'content',
              type: 'richText',
              label: 'Full Article Content (WYSIWYG Lexical Editor)',
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
          ],
        },
        {
          label: 'Article FAQ (Schema)',
          fields: [
            {
              name: 'faqSection',
              type: 'array',
              label: 'Q&A Items (Generates FAQPage Schema)',
              admin: {
                description: 'Add related questions to display at the end of the post and generate Google FAQ Rich Snippets.',
              },
              fields: [
                { name: 'question', type: 'text', required: true, label: 'Question' },
                { name: 'answer', type: 'textarea', required: true, label: 'Answer' },
              ],
            },
          ],
        },
        {
          label: 'SEO & Social Share',
          fields: [
            {
              name: 'seo',
              type: 'group',
              label: 'Search Engine Optimization',
              fields: [
                { name: 'metaTitle', type: 'text', label: 'Meta Title' },
                { name: 'metaDescription', type: 'textarea', label: 'Meta Description' },
                { name: 'focusKeywords', type: 'text', label: 'Focus Keywords (Comma separated)' },
                { name: 'canonicalUrl', type: 'text', label: 'Canonical URL' },
                { name: 'ogTitle', type: 'text', label: 'OpenGraph Social Title' },
                { name: 'ogDescription', type: 'textarea', label: 'OpenGraph Social Description' },
                { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'OpenGraph Social Share Image' },
                {
                  name: 'twitterCard',
                  type: 'select',
                  label: 'Twitter Card Type',
                  defaultValue: 'summary_large_image',
                  options: [
                    { label: 'Large Image (summary_large_image)', value: 'summary_large_image' },
                    { label: 'Small Summary (summary)', value: 'summary' },
                  ],
                },
                { name: 'noIndex', type: 'checkbox', label: 'Disallow Search Indexing (noindex)', defaultValue: false },
              ],
            },
          ],
        },
      ],
    },
  ],
}
