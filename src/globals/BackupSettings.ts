import type { GlobalConfig } from 'payload'
import { staffOnly } from '../access/cms'
import { stripIdBeforeOperationHook, stripIdHook } from '../hooks/stripId'

/**
 * Universal Database Backup and Disaster Recovery control global.
 * Renders the BackupManager admin UI component in Payload Admin.
 * Staff-only access.
 */
export const BackupSettings: GlobalConfig = {
  slug: 'backup-manager',
  label: 'Database Backup',
  admin: {
    group: 'System',
    description: 'Export and restore portable snapshots of all website content and configurations.',
  },
  access: {
    read: staffOnly,
    update: staffOnly,
  },
  hooks: {
    beforeOperation: [stripIdBeforeOperationHook],
    beforeValidate: [stripIdHook],
  },
  fields: [
    {
      name: 'backupControl',
      type: 'ui',
      admin: {
        components: {
          Field: '/admin/components/BackupManager#BackupManager',
        },
      },
    },
  ],
}
