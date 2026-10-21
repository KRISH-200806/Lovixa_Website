import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload'
import { publicReadPublished, staffOnly } from '../access/cms'
import { PageBlocks } from './shared/BlockSections'
import { stripSystemFieldsBeforeOperation, stripSystemFieldsHook } from '../hooks/stripSystemFields'
import {
  createCaptureRawSectionsCollectionHook,
  createCleanupSectionsOnDeleteHook,
  createReadMappedCollectionSectionsHook,
  createSyncCollectionSectionsHook,
} from '../hooks/sectionSourceMap'
import { createRevalidateCollectionDeleteHook, createRevalidateCollectionHook } from '../hooks/revalidateNextCache'

import { createAuditLogCollectionHook, createAuditLogDeleteHook } from '../hooks/auditLog'

import { LIVE_PREVIEW_BREAKPOINTS, createLivePreviewUrl } from '../utils/livePreview'

const SOURCE_TABLE = 'other-pages'

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** Auto-fills `slug` from `title` on first save when left blank — never overwrites a slug the admin already set. */
const autoSlugHook: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) return data
  const title = typeof data.title === 'string' ? data.title : ''
  const slug = typeof data.slug === 'string' ? data.slug.trim() : ''
  if (!slug && title) {
    return { ...data, slug: slugify(title) }
  }
  return data
}

/**
 * Generic content-page collection — any number of one-off pages (About,
 * Careers, a landing page, etc.) that don't warrant their own global. Each
 * doc is a full page built from `sections` (the same block library as the
 * Home global, see shared/BlockSections.ts), rendered at
 * `/[slug]` (src/app/(frontend)/[slug]/page.tsx).
 *
 * Auto-registered as an SEO Report target — see
 * src/lib/seo-report/targets.ts (queries this collection at request time,
 * no manual wiring needed per page).
 */
export const OtherPages: CollectionConfig = {
  slug: 'other-pages',
  labels: { singular: 'Other Page', plural: 'Other Pages' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Content',
    livePreview: {
      url: createLivePreviewUrl((data) => (typeof data?.slug === 'string' ? data.slug : '')),
      breakpoints: LIVE_PREVIEW_BREAKPOINTS,
    },
  },
  access: {
    read: publicReadPublished,
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  // Draft/Publish — see starter-kit/19-draft-publish-workflow.md.
  versions: {
    drafts: true,
  },
  hooks: {
    beforeOperation: [stripSystemFieldsBeforeOperation],
    beforeValidate: [stripSystemFieldsHook, autoSlugHook],
    beforeChange: [createCaptureRawSectionsCollectionHook({ sourceTable: SOURCE_TABLE })],
    afterRead: [createReadMappedCollectionSectionsHook({ sourceTable: SOURCE_TABLE })],
    afterChange: [
      createSyncCollectionSectionsHook({ sourceTable: SOURCE_TABLE }),
      createRevalidateCollectionHook(SOURCE_TABLE),
      createAuditLogCollectionHook(SOURCE_TABLE),
    ],
    afterDelete: [
      createCleanupSectionsOnDeleteHook({ sourceTable: SOURCE_TABLE }),
      createRevalidateCollectionDeleteHook(SOURCE_TABLE),
      createAuditLogDeleteHook(SOURCE_TABLE),
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'URL path, e.g. "about" → /about. Auto-filled from title if left blank.' },
    },
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'subtitle', type: 'textarea', localized: true },
        { name: 'accentColor', type: 'text', defaultValue: '#FB5600' },
      ],
    },
    {
      name: 'sections',
      type: 'blocks',
      blocks: PageBlocks,
    },
  ],
}
