import type { CollectionConfig } from 'payload'

import { institutionOnlyAccess } from './access'

export const AgentRuntimeLogs: CollectionConfig = {
  slug: 'agent-runtime-logs',
  labels: {
    singular: 'Agent 运行日志',
    plural: 'Agent 运行日志',
  },
  admin: {
    useAsTitle: 'toolName',
    group: '系统管理',
    defaultColumns: ['toolName', 'safety', 'success', 'durationMs', 'createdAt'],
  },
  access: institutionOnlyAccess,
  fields: [
    { name: 'toolName', type: 'text', label: '工具名称', required: true },
    {
      name: 'safety',
      type: 'select',
      label: '安全分类',
      required: true,
      options: [
        { label: '只读', value: 'read' },
        { label: '写入', value: 'write' },
      ],
    },
    { name: 'success', type: 'checkbox', label: '是否成功', defaultValue: false, required: true },
    { name: 'durationMs', type: 'number', label: '耗时（毫秒）', required: true },
    {
      name: 'argsPreview',
      type: 'textarea',
      label: '参数摘要',
      admin: {
        description: '已脱敏和截断，不存储 API Key、Token、密码等敏感字段。',
      },
    },
    {
      name: 'resultPreview',
      type: 'textarea',
      label: '结果摘要',
      admin: {
        description: '已脱敏和截断，仅用于审计工具行为。',
      },
    },
    { name: 'errorMessage', type: 'textarea', label: '错误信息' },
  ],
}
