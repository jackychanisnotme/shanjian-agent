import type { CollectionConfig } from 'payload'

export const DonationIntentions: CollectionConfig = {
  slug: 'donation-intentions',
  labels: {
    singular: '帮助意向',
    plural: '帮助意向',
  },
  admin: {
    useAsTitle: 'amountOrResource',
    group: '资源跟进',
    defaultColumns: ['project', 'helpCategory', 'helpType', 'city', 'status'],
  },
  fields: [
    {
      name: 'project',
      type: 'relationship',
      label: '关联公开项目',
      relationTo: 'public-projects',
      required: true,
    },
    {
      name: 'helpCategory',
      type: 'select',
      label: '帮助类别',
      required: true,
      options: [
        { label: '钱', value: 'money' },
        { label: '物', value: 'materials' },
        { label: '服', value: 'services' },
      ],
    },
    {
      name: 'helpType',
      type: 'select',
      label: '帮助类型',
      required: true,
      options: [
        { label: '资金支持意向', value: 'funding_intention' },
        { label: '医疗资源', value: 'medical_resource' },
        { label: '药品资源', value: 'drug_resource' },
        { label: '营养支持', value: 'nutrition' },
        { label: '住宿支持', value: 'accommodation' },
        { label: '交通支持', value: 'transportation' },
        { label: '陪诊志愿', value: 'volunteer' },
        { label: '政策咨询', value: 'policy_consultation' },
        { label: '心理支持', value: 'psychological_support' },
        { label: '传播支持', value: 'propagation' },
        { label: '企业支持', value: 'corporate_support' },
      ],
    },
    { name: 'amountOrResource', type: 'textarea', label: '金额或资源说明', required: true },
    { name: 'city', type: 'text', label: '城市/地区', required: true },
    { name: 'contact', type: 'text', label: '联系方式', required: true },
    { name: 'receiptNeed', type: 'checkbox', label: '需要票据/项目信息说明', defaultValue: false },
    { name: 'message', type: 'textarea', label: '留言' },
    { name: 'classification', type: 'text', label: 'AI 分类' },
    { name: 'matchedNeedLabels', type: 'json', label: '匹配的真实需要' },
    { name: 'followUpScript', type: 'textarea', label: '机构跟进话术' },
    {
      name: 'status',
      type: 'select',
      label: '跟进状态',
      defaultValue: 'new',
      required: true,
      options: [
        { label: '新登记', value: 'new' },
        { label: '已匹配', value: 'matched' },
        { label: '已联系', value: 'contacted' },
        { label: '已关闭', value: 'closed' },
      ],
    },
  ],
}
