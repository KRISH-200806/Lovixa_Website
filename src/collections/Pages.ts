import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Page & Policy',
    plural: 'Pages & Policies (About, Privacy, Terms, Shipping, Return, FAQ, Contact)',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'isPublished', 'updatedAt'],
    group: 'Website Pages & Policies',
    description: 'Edit content for About Us (Our Story), Privacy Policy, Terms & Conditions, Shipping Policy, Return & Refund Policy, FAQ, and Contact Us',
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
          const slugsToRevalidate = new Set<string>()
          if (doc?.slug) slugsToRevalidate.add(doc.slug)
          if (previousDoc?.slug) slugsToRevalidate.add(previousDoc.slug)
          if (slugsToRevalidate.has('about') || slugsToRevalidate.has('our-story')) {
            slugsToRevalidate.add('about')
            slugsToRevalidate.add('our-story')
          }
          if (slugsToRevalidate.has('terms') || slugsToRevalidate.has('terms-conditions')) {
            slugsToRevalidate.add('terms')
            slugsToRevalidate.add('terms-conditions')
          }
          if (slugsToRevalidate.has('return-refund-policy') || slugsToRevalidate.has('refund-policy')) {
            slugsToRevalidate.add('return-refund-policy')
            slugsToRevalidate.add('refund-policy')
          }
          for (const s of slugsToRevalidate) {
            revalidatePath(`/${s}`)
            revalidateTag(`page-${s}`)
          }
          revalidatePath('/', 'layout')
          revalidateTag('pages')
        } catch {}
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        try {
          const { revalidatePath, revalidateTag } = await import('next/cache')
          const slugsToRevalidate = new Set<string>()
          if (doc?.slug) slugsToRevalidate.add(doc.slug)
          if (slugsToRevalidate.has('about') || slugsToRevalidate.has('our-story')) {
            slugsToRevalidate.add('about')
            slugsToRevalidate.add('our-story')
          }
          if (slugsToRevalidate.has('terms') || slugsToRevalidate.has('terms-conditions')) {
            slugsToRevalidate.add('terms')
            slugsToRevalidate.add('terms-conditions')
          }
          if (slugsToRevalidate.has('return-refund-policy') || slugsToRevalidate.has('refund-policy')) {
            slugsToRevalidate.add('return-refund-policy')
            slugsToRevalidate.add('refund-policy')
          }
          for (const s of slugsToRevalidate) {
            revalidatePath(`/${s}`)
            revalidateTag(`page-${s}`)
          }
          revalidatePath('/', 'layout')
          revalidateTag('pages')
        } catch {}
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero & Overview',
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
                description: 'Unique URL path (e.g. about, contact, terms-conditions, privacy-policy, shipping-policy, return-refund-policy, faq)',
              },
            },
            {
              name: 'isPublished',
              type: 'checkbox',
              label: 'Published Live on Website',
              defaultValue: true,
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'badge',
              type: 'text',
              label: 'Hero Top Pill Badge (e.g. OUR PHILOSOPHY, DATA INTEGRITY & TRUST, GET IN TOUCH)',
              defaultValue: 'LOVIXA COSMETIC',
            },
            {
              name: 'highlightTitle',
              type: 'text',
              label: 'Hero Highlight / Secondary Heading (e.g. Thoughtfully Yours.)',
            },
            {
              name: 'subtitle',
              type: 'textarea',
              label: 'Hero Subtitle Description',
            },
            {
              name: 'headerImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Hero Banner Image (Media Upload)',
            },
            {
              name: 'headerImageUrl',
              type: 'text',
              label: 'Fallback Hero Banner Image Path (e.g. /images/lovixa-story.jpg)',
            },
            {
              name: 'lastUpdated',
              type: 'text',
              label: 'Last Updated Date Note (e.g. October 2026 • LOVIXA COSMETIC)',
              admin: {
                description: 'Displayed at the top of policy pages.',
              },
            },
          ],
        },
        {
          label: 'Policy & Content Sections',
          fields: [
            {
              name: 'content',
              type: 'richText',
              label: 'WYSIWYG Rich Text Content (Optional - formatted text, paragraphs, or lists)',
            },
            {
              name: 'sections',
              type: 'array',
              label: 'Structured Policy Sections (Numbered Headings & Paragraphs)',
              admin: {
                description: 'Add or edit numbered sections for terms, privacy, shipping, returns, or story.',
              },
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  required: true,
                  label: 'Section Heading (e.g. 1. Our Privacy Commitment)',
                },
                {
                  name: 'content',
                  type: 'textarea',
                  required: true,
                  label: 'Section Content Text (Paragraphs or bullet points)',
                },
              ],
            },
          ],
        },
        {
          label: 'About Us Page Story & Content',
          admin: {
            condition: (data) => data?.slug === 'about' || data?.slug === 'our-story',
          },
          fields: [
            {
              name: 'aboutStory',
              type: 'group',
              label: 'Our Story & Brand Philosophy Content',
              fields: [
                {
                  name: 'editorialPurposeBadge',
                  type: 'text',
                  label: 'Purpose Section Badge',
                  defaultValue: 'OUR PURPOSE',
                },
                {
                  name: 'editorialHeading',
                  type: 'text',
                  label: 'Purpose Section Main Headline',
                  defaultValue: 'Care that feels thoughtful, gentle, and authentically personal.',
                },
                {
                  name: 'editorialText',
                  type: 'textarea',
                  label: 'Purpose Section Editorial Text',
                },
                {
                  name: 'storyBadge',
                  type: 'text',
                  label: 'Difference Section Badge',
                  defaultValue: 'THE LOVIXA DIFFERENCE',
                },
                {
                  name: 'storyHeading',
                  type: 'text',
                  label: 'Difference Section Headline',
                  defaultValue: 'Formulated for real hair and skin, designed for everyday confidence.',
                },
                {
                  name: 'storyParagraph1',
                  type: 'textarea',
                  label: 'Difference Story Paragraph 1',
                },
                {
                  name: 'storyParagraph2',
                  type: 'textarea',
                  label: 'Difference Story Paragraph 2',
                },
                {
                  name: 'storyImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Difference Story Split Image Upload',
                },
                {
                  name: 'storyImageUrl',
                  type: 'text',
                  label: 'Fallback Story Image Path (e.g. /images/about-follower.webp)',
                  defaultValue: '/images/about-follower.webp',
                },
                {
                  name: 'storyButtonText',
                  type: 'text',
                  label: 'Story Primary Button Text',
                  defaultValue: 'Explore Collection',
                },
                {
                  name: 'storyButtonLink',
                  type: 'text',
                  label: 'Story Primary Button Link',
                  defaultValue: '/products',
                },
                {
                  name: 'storySecondaryButtonText',
                  type: 'text',
                  label: 'Story Secondary Button Text',
                  defaultValue: 'Get in Touch',
                },
                {
                  name: 'storySecondaryButtonLink',
                  type: 'text',
                  label: 'Story Secondary Button Link',
                  defaultValue: '/contact',
                },
                {
                  name: 'pillarsBadge',
                  type: 'text',
                  label: 'Pillars & Commitments Section Badge',
                  defaultValue: 'OUR COMMITMENTS',
                },
                {
                  name: 'pillarsHeading',
                  type: 'text',
                  label: 'Pillars & Commitments Main Headline',
                  defaultValue: 'What Guides Every Formula',
                },
                {
                  name: 'pillarsSubtitle',
                  type: 'textarea',
                  label: 'Pillars & Commitments Subtitle Text',
                  defaultValue: 'Honest beauty care based on transparency, botanical integrity, and respectful customer relationships.',
                },
                {
                  name: 'brandPillars',
                  type: 'array',
                  label: 'Brand Philosophy Pillars (Cards)',
                  fields: [
                    {
                      name: 'iconType',
                      type: 'select',
                      label: 'Pillar Icon',
                      options: [
                        { label: 'Botanical Leaf', value: 'leaf' },
                        { label: 'Shield & Quality', value: 'shield' },
                        { label: 'Sparkles & Mindful', value: 'sparkles' },
                        { label: 'Heart & Care', value: 'heart' },
                      ],
                      defaultValue: 'leaf',
                    },
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                      label: 'Pillar Title',
                    },
                    {
                      name: 'desc',
                      type: 'textarea',
                      required: true,
                      label: 'Pillar Description',
                    },
                  ],
                },
                {
                  name: 'commitments',
                  type: 'array',
                  label: 'Commitment & Values Cards',
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                      label: 'Commitment Title',
                    },
                    {
                      name: 'desc',
                      type: 'textarea',
                      required: true,
                      label: 'Commitment Description',
                    },
                  ],
                },
                {
                  name: 'showcaseImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Full-Width Showcase Banner Image Upload',
                },
                {
                  name: 'showcaseImageUrl',
                  type: 'text',
                  label: 'Fallback Full-Width Showcase Banner Image Path',
                  defaultValue: '/images/about-all-products.webp',
                },
                {
                  name: 'ctaBadge',
                  type: 'text',
                  label: 'Bottom Support CTA Badge',
                  defaultValue: 'HERE FOR YOU',
                },
                {
                  name: 'ctaHeading',
                  type: 'text',
                  label: 'Bottom Support CTA Headline',
                  defaultValue: 'Have a Question About Our Formulations?',
                },
                {
                  name: 'ctaSubtitle',
                  type: 'textarea',
                  label: 'Bottom Support CTA Subtitle Text',
                  defaultValue: 'Our customer concierge team is available to assist you with product details, order inquiries, and care recommendations.',
                },
                {
                  name: 'ctaButtonText',
                  type: 'text',
                  label: 'Bottom Support CTA Button Text',
                  defaultValue: 'Contact Concierge',
                },
                {
                  name: 'ctaButtonLink',
                  type: 'text',
                  label: 'Bottom Support CTA Button Link',
                  defaultValue: '/contact',
                },
              ],
            },
          ],
        },
        {
          label: 'Contact Details',
          admin: {
            condition: (data) => data?.slug === 'contact',
          },
          fields: [
            {
              name: 'contactInfo',
              type: 'group',
              label: 'Contact Information & Business Details',
              fields: [
                {
                  name: 'phone',
                  type: 'text',
                  label: 'Customer Care Phone',
                  defaultValue: '+91 97124 60509',
                },
                {
                  name: 'supportHours',
                  type: 'text',
                  label: 'Customer Care Working Hours',
                  defaultValue: 'Mon - Sat: 10:00 AM – 6:00 PM',
                },
                {
                  name: 'email',
                  type: 'text',
                  label: 'Concierge Email',
                  defaultValue: 'lovixacosmetic@gmail.com',
                },
                {
                  name: 'emailNote',
                  type: 'text',
                  label: 'Email Note',
                  defaultValue: 'Dedicated support within 24 business hours',
                },
                {
                  name: 'address',
                  type: 'textarea',
                  label: 'Office & Registered Address',
                  defaultValue: 'Yogi Chowk Rd, Jai Bhawani Society, Punagam, Varachha, Surat, Gujarat 395011',
                },
                {
                  name: 'whatsappNumber',
                  type: 'text',
                  label: 'WhatsApp Chat Number (International format)',
                  defaultValue: '919712460509',
                },
                {
                  name: 'introSubtitle',
                  type: 'textarea',
                  label: 'Contact Form Intro Text',
                  defaultValue: 'Fill the form below and one of our concierge team members will respond within 24 business hours to assist you with your routine or order inquiries.',
                },
                {
                  name: 'socialLinks',
                  type: 'array',
                  label: 'Social Media Profiles',
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Facebook', value: 'facebook' },
                        { label: 'Instagram', value: 'instagram' },
                        { label: 'YouTube', value: 'youtube' },
                        { label: 'LinkedIn', value: 'linkedin' },
                      ],
                    },
                    {
                      name: 'url',
                      type: 'text',
                      required: true,
                      label: 'Profile URL',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'FAQ Accordions',
          fields: [
            {
              name: 'faqItems',
              type: 'array',
              label: 'Frequently Asked Questions',
              admin: {
                description: 'Manage Q&A items for this page (e.g. /faq or policy questions).',
              },
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  required: true,
                  label: 'Question',
                },
                {
                  name: 'answer',
                  type: 'textarea',
                  required: true,
                  label: 'Answer',
                },
                {
                  name: 'category',
                  type: 'select',
                  label: 'Category',
                  defaultValue: 'all',
                  options: [
                    { label: 'General / All', value: 'all' },
                    { label: 'Products & Ingredients', value: 'products' },
                    { label: 'Usage & Rituals', value: 'usage' },
                    { label: 'Orders & Payments', value: 'orders' },
                    { label: 'Shipping & Delivery', value: 'shipping' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
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
        },
      ],
    },
  ],
}
