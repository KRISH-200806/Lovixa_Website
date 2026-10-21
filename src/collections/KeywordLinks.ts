import type { CollectionConfig } from 'payload'

export const KeywordLinks: CollectionConfig = {
  slug: 'keyword-links',
  labels: {
    singular: 'Keyword Link',
    plural: 'Keyword Links',
  },
  admin: {
    useAsTitle: 'keyword',
    defaultColumns: ['keyword', 'targetURL', 'priority', 'active', 'fromKeywordPlan'],
    group: 'SEO & Marketing',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'keyword',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'targetURL',
      type: 'text',
      required: true,
      label: 'Target URL',
    },
    {
      name: 'priority',
      type: 'number',
      defaultValue: 100,
      admin: {
        description: 'Lower number = higher priority for auto-linking',
      },
    },
    {
      name: 'matchType',
      type: 'select',
      defaultValue: 'partial',
      options: [
        { label: 'Partial / Word Match', value: 'partial' },
        { label: 'Exact Match', value: 'exact' },
      ],
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'fromKeywordPlan',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether this link was automatically imported from keyword-plan',
      },
    },
  ],
}
