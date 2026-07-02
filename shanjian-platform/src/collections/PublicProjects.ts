import type { CollectionConfig } from 'payload'

export const PublicProjects: CollectionConfig = {
  slug: 'public-projects',
  labels: {
    singular: '公开项目',
    plural: '公开项目',
  },
  admin: {
    useAsTitle: 'patientAlias',
    group: '救助项目',
    defaultColumns: ['patientAlias', 'status', 'region', 'resourceGap', 'isPublished'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'application',
      type: 'relationship',
      label: '关联求助申请',
      relationTo: 'aid-applications',
    },
    { name: 'slug', type: 'text', label: '项目路径', required: true, unique: true },
    { name: 'patientAlias', type: 'text', label: '患者脱敏称呼', required: true },
    { name: 'diseaseLabel', type: 'text', label: '疾病/救助类型', required: true },
    { name: 'region', type: 'text', label: '地区', required: true },
    {
      name: 'status',
      type: 'select',
      label: '项目状态',
      defaultValue: 'receiving_intentions',
      required: true,
      options: [
        { label: '紧急', value: 'urgent' },
        { label: '治疗中', value: 'in_treatment' },
        { label: '等待材料', value: 'awaiting_materials' },
        { label: '收集帮助意向', value: 'receiving_intentions' },
        { label: '已完成', value: 'completed' },
      ],
    },
    { name: 'verifiedNeed', type: 'textarea', label: '已核实需求', required: true },
    { name: 'resourceGap', type: 'number', label: '资源缺口', required: true },
    { name: 'matchedIntentions', type: 'number', label: '已匹配意向数', defaultValue: 0, required: true },
    { name: 'needs', type: 'json', label: '真实需要', required: true },
    { name: 'progress', type: 'json', label: '项目进展', required: true },
    { name: 'story', type: 'textarea', label: '脱敏项目说明', required: true },
    { name: 'evidenceSummary', type: 'json', label: '证据摘要', required: true },
    { name: 'feedback', type: 'json', label: '公开反馈', required: true },
    { name: 'isPublished', type: 'checkbox', label: '是否公开展示', defaultValue: false },
  ],
}
