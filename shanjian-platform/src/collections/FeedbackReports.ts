import type { CollectionConfig } from 'payload'

export const FeedbackReports: CollectionConfig = {
  slug: 'feedback-reports',
  labels: {
    singular: '反馈报告',
    plural: '反馈报告',
  },
  admin: {
    useAsTitle: 'title',
    group: '资源跟进',
    defaultColumns: ['title', 'project', 'status', 'requiresInstitutionReview'],
  },
  fields: [
    { name: 'title', type: 'text', label: '报告标题', required: true },
    {
      name: 'project',
      type: 'relationship',
      label: '关联公开项目',
      relationTo: 'public-projects',
      required: true,
    },
    {
      name: 'intention',
      type: 'relationship',
      label: '关联帮助意向',
      relationTo: 'donation-intentions',
    },
    { name: 'draft', type: 'textarea', label: '反馈草稿', required: true },
    { name: 'requiresInstitutionReview', type: 'checkbox', label: '发布前需机构复核', defaultValue: true },
    {
      name: 'status',
      type: 'select',
      label: '报告状态',
      defaultValue: 'draft',
      required: true,
      options: [
        { label: '草稿', value: 'draft' },
        { label: '已复核', value: 'reviewed' },
        { label: '已发布', value: 'published' },
      ],
    },
  ],
}
