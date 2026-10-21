import type { CollectionConfig } from 'payload'

export const SectionSourceMap: CollectionConfig = {
  slug: 'section-source-map',
  labels: {
    singular: 'Section Source Map',
    plural: 'Section Source Maps',
  },
  admin: {
    useAsTitle: 'sectionType',
    defaultColumns: ['sourceTable', 'sourceId', 'sectionType', 'position'],
    group: 'System & Architecture',
    hidden: false,
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
    update: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
    delete: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
  },
  fields: [
    {
      name: 'sourceTable',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'sourceId',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'sourceField',
      type: 'text',
      defaultValue: 'sections',
    },
    {
      name: 'sectionId',
      type: 'text',
      required: true,
    },
    {
      name: 'sectionType',
      type: 'text',
      required: true,
    },
    {
      name: 'position',
      type: 'number',
      required: true,
    },
    {
      name: 'sectionData',
      type: 'json',
    },
  ],
}
