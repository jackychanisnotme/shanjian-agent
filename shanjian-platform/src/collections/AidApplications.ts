import type { CollectionConfig } from 'payload'

import { institutionOnlyAccess } from './access'

export const AidApplications: CollectionConfig = {
  slug: 'aid-applications',
  labels: {
    singular: '求助申请',
    plural: '求助申请',
  },
  admin: {
    useAsTitle: 'patientAlias',
    group: '救助项目',
    defaultColumns: ['patientAlias', 'status', 'region', 'remainingGap', 'updatedAt'],
    components: {
      edit: {
        beforeDocumentControls: [
          '/components/admin/WorkflowActionButtons#GenerateCaseReviewButton',
          '/components/admin/WorkflowActionButtons#RunApplicationCaseReviewAgentButton',
        ],
      },
    },
  },
  access: institutionOnlyAccess,
  fields: [
    { name: 'patientAlias', type: 'text', label: '患者脱敏称呼', required: true },
    {
      name: 'applicantRole',
      type: 'select',
      label: '申请人身份',
      required: true,
      options: [
        { label: '家属', value: 'family' },
        { label: '本人', value: 'patient' },
        { label: '志愿者', value: 'volunteer' },
        { label: '机构工作人员', value: 'institution_staff' },
      ],
    },
    { name: 'diseaseSummary', type: 'textarea', label: '病情摘要', required: true },
    { name: 'treatmentStage', type: 'text', label: '治疗阶段', required: true },
    { name: 'region', type: 'text', label: '地区', required: true },
    { name: 'expenseTotal', type: 'number', label: '总费用', required: true },
    { name: 'paidAmount', type: 'number', label: '已支付金额', required: true },
    { name: 'reimbursementEstimate', type: 'number', label: '医保/商保预估', required: true },
    { name: 'remainingGap', type: 'number', label: '费用缺口', required: true },
    { name: 'familyBurden', type: 'textarea', label: '家庭负担说明', required: true },
    {
      name: 'aidApplicationReadableSummary',
      type: 'ui',
      admin: {
        components: {
          Field: '/components/admin/ReadableReviewFields#AidApplicationReadableSummary',
        },
      },
    },
    {
      type: 'collapsible',
      label: '原始结构化数据（高级）',
      admin: {
        initCollapsed: true,
      },
      fields: [
        { name: 'requestedNeeds', type: 'json', label: '受助人真实需要', required: true },
        { name: 'materialNotes', type: 'json', label: '材料说明', required: true },
        { name: 'evidence', type: 'json', label: '证据材料', required: true },
      ],
    },
    {
      name: 'uploadedMaterials',
      type: 'relationship',
      label: '上传材料文件',
      relationTo: 'media',
      hasMany: true,
    },
    { name: 'rawNarrative', type: 'textarea', label: '原始叙事', required: true },
    { name: 'consentForInstitutionReview', type: 'checkbox', label: '同意机构复核', defaultValue: false },
    { name: 'consentForDeidentifiedDisplay', type: 'checkbox', label: '同意脱敏展示', defaultValue: false },
    {
      name: 'status',
      type: 'select',
      label: '申请状态',
      defaultValue: 'submitted',
      required: true,
      options: [
        { label: '草稿', value: 'draft' },
        { label: '已提交', value: 'submitted' },
        { label: '需补充材料', value: 'needs_materials' },
        { label: '审核中', value: 'under_review' },
        { label: '已批准', value: 'approved' },
        { label: '已拒绝', value: 'rejected' },
        { label: '已公开', value: 'published' },
      ],
    },
  ],
}
