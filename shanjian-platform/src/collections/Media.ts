import type { CollectionConfig } from 'payload'

import { institutionOnlyAccess } from './access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: '媒体文件',
    plural: '媒体文件',
  },
  admin: {
    group: '系统管理',
  },
  access: institutionOnlyAccess,
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: '替代文本',
      required: true,
    },
  ],
  upload: true,
}
