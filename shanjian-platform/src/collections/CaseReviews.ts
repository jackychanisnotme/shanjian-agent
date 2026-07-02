import type { CollectionConfig } from 'payload'

export const CaseReviews: CollectionConfig = {
  slug: 'case-reviews',
  labels: {
    singular: '四辨审核',
    plural: '四辨审核',
  },
  admin: {
    useAsTitle: 'reviewTitle',
    group: '救助项目',
    defaultColumns: ['reviewTitle', 'application', 'decision', 'reviewSource', 'updatedAt'],
  },
  fields: [
    { name: 'reviewTitle', type: 'text', label: '审核标题', required: true },
    {
      name: 'application',
      type: 'relationship',
      label: '关联求助申请',
      relationTo: 'aid-applications',
      required: true,
    },
    { name: 'goodAndHarm', type: 'json', label: '辨善恶', required: true },
    { name: 'truth', type: 'json', label: '辨真伪', required: true },
    {
      name: 'scaleUrgency',
      type: 'select',
      label: '紧急程度',
      required: true,
      options: [
        { label: '低', value: 'low' },
        { label: '中', value: 'medium' },
        { label: '高', value: 'high' },
      ],
    },
    { name: 'scaleRationale', type: 'textarea', label: '辨大小说明', required: true },
    { name: 'resourceGap', type: 'number', label: '资源缺口', required: true },
    { name: 'proximity', type: 'json', label: '辨远近', required: true },
    { name: 'humanChecklist', type: 'json', label: '人工复核清单', required: true },
    {
      name: 'decision',
      type: 'select',
      label: '人工决策',
      options: [
        { label: '要求补充材料', value: 'request_materials' },
        { label: '拒绝', value: 'reject' },
        { label: '批准展示', value: 'approve_display' },
        { label: '线下跟进', value: 'offline_follow_up' },
      ],
    },
    {
      name: 'reviewSource',
      type: 'select',
      label: '审核来源',
      defaultValue: 'deterministic',
      required: true,
      options: [
        { label: '规则辅助', value: 'deterministic' },
        { label: '本地 LLM', value: 'local_llm' },
        { label: '人工填写', value: 'manual' },
      ],
    },
  ],
}
