import type { GlobalConfig } from 'payload'
import { publicRead, staffOnly } from '../access/cms'
import { stripIdBeforeOperationHook, stripIdHook } from '../hooks/stripId'
import { createRevalidateGlobalHook } from '../hooks/revalidateNextCache'
import { createAuditLogGlobalHook } from '../hooks/auditLog'

/**
 * Global configuration for Live Visual Preview in Payload CMS.
 * By default, live preview is disabled (off). Administrators can toggle
 * live preview on/off, customize the frontend preview URL, and configure viewports.
 */
export const PreviewSettings: GlobalConfig = {
  slug: 'preview-settings',
  label: 'Live Preview Settings',
  admin: {
    group: 'Site Shell',
    description: 'Configure real-time side-by-side visual preview for pages and home.',
  },
  access: {
    read: publicRead,
    update: staffOnly,
  },
  hooks: {
    beforeValidate: [stripIdHook],
    afterChange: [createRevalidateGlobalHook('preview-settings'), createAuditLogGlobalHook('preview-settings')],
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Enable Live Visual Preview',
      defaultValue: false,
      admin: {
        description: 'When enabled, the admin panel displays a real-time side-by-side visual preview pane when editing pages.',
      },
    },
    {
      type: 'row',
      admin: {
        condition: (data) => Boolean(data?.enabled),
      },
      fields: [
        {
          name: 'previewUrl',
          type: 'text',
          label: 'Preview Base URL',
          defaultValue: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
          admin: {
            width: '50%',
            description: 'Origin URL used for the preview iframe (e.g. http://localhost:3000 or https://preview.domain.com).',
          },
        },
        {
          name: 'enableBreakpoints',
          type: 'checkbox',
          label: 'Show Device Breakpoints Toolbar',
          defaultValue: true,
          admin: {
            width: '50%',
            description: 'Include mobile, tablet, and desktop responsive viewport toggle buttons in the preview pane.',
          },
        },
      ],
    },
  ],
}
