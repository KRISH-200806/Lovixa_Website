import type { GlobalConfig } from 'payload'
import { publicReadPublished } from '../access/cms'
import { PageBlocks } from '../collections/shared/BlockSections'
import { stripIdBeforeOperationHook, stripIdHook } from '../hooks/stripId'
import {
  createCaptureRawSectionsGlobalHook,
  createReadMappedGlobalSectionsHook,
  createSyncGlobalSectionsHook,
} from '../hooks/sectionSourceMap'
import { createRevalidateGlobalHook } from '../hooks/revalidateNextCache'
import { createAuditLogGlobalHook } from '../hooks/auditLog'

import { LIVE_PREVIEW_BREAKPOINTS, createLivePreviewUrl } from '../utils/livePreview'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home Page',
  admin: {
    group: 'Globals',
    livePreview: {
      url: createLivePreviewUrl(() => '/'),
      breakpoints: LIVE_PREVIEW_BREAKPOINTS,
    },
  },
  access: { read: publicReadPublished },
  // Draft/Publish: Local API reads default to the last-published version
  // unless `draft: true` is explicitly requested (admin preview only).
  // The frontend never passes draft:true, so an unpublished page/edit never
  // reaches the public site. See starter-kit/19-draft-publish-workflow.md.
  versions: {
    drafts: true,
  },
  hooks: {
    beforeOperation: [stripIdBeforeOperationHook],
    beforeValidate: [stripIdHook],
    beforeChange: [createCaptureRawSectionsGlobalHook({ sourceTable: 'home' })],
    afterRead: [createReadMappedGlobalSectionsHook({ sourceTable: 'home' })],
    afterChange: [
      createSyncGlobalSectionsHook({ sourceTable: 'home' }),
      createRevalidateGlobalHook('home'),
      createAuditLogGlobalHook('home'),
    ],
  },
  fields: [
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
