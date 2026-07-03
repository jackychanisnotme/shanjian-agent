import type { CollectionConfig } from 'payload'

import { adminOnlyAccess } from './access'

export const AgentConfigs: CollectionConfig = {
  slug: 'agent-configs',
  labels: {
    singular: 'Agent 配置',
    plural: 'Agent 配置',
  },
  admin: {
    useAsTitle: 'configName',
    group: '系统管理',
    defaultColumns: ['configName', 'isActive', 'provider', 'modelName', 'baseUrl', 'updatedAt'],
  },
  access: adminOnlyAccess,
  fields: [
    {
      name: 'configName',
      type: 'text',
      label: '配置名称',
      defaultValue: '默认四辨审核 Agent',
      required: true,
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: '启用此配置',
      defaultValue: false,
    },
    {
      name: 'provider',
      type: 'select',
      label: '模型供应商',
      defaultValue: 'openai_compatible',
      required: true,
      options: [
        { label: 'OpenAI 兼容接口', value: 'openai_compatible' },
        { label: 'DeepSeek', value: 'deepseek' },
        { label: '通义千问', value: 'qwen' },
        { label: 'Ollama / 本地模型', value: 'ollama' },
        { label: '自定义', value: 'custom' },
      ],
    },
    {
      name: 'baseUrl',
      type: 'text',
      label: 'Base URL',
      defaultValue: 'https://api.openai.com/v1',
      required: true,
      admin: {
        description: '填写 OpenAI 兼容接口地址，例如 https://api.openai.com/v1 或本地模型网关地址。',
      },
    },
    {
      name: 'apiKey',
      type: 'text',
      label: 'API Key',
      required: true,
      admin: {
        description: '仅后台服务端调用大模型时使用。不要把此字段传给前台页面、公开 API 或日志。',
      },
    },
    {
      name: 'modelName',
      type: 'text',
      label: '模型名称',
      defaultValue: 'gpt-4.1-mini',
    },
    {
      name: 'temperature',
      type: 'number',
      label: 'Temperature',
      defaultValue: 0.2,
      min: 0,
      max: 2,
    },
    {
      name: 'maxOutputTokens',
      type: 'number',
      label: '最大输出 Token',
      defaultValue: 2000,
      min: 1,
      required: true,
    },
    {
      name: 'timeoutSeconds',
      type: 'number',
      label: '超时时间（秒）',
      defaultValue: 60,
      min: 1,
      required: true,
    },
    {
      name: 'systemPrompt',
      type: 'textarea',
      label: '系统提示词',
      defaultValue:
        '你是善见平台的四辨审核辅助 Agent。只做材料整理、风险提示和人工复核建议，不承诺救助结果，不自动公开项目。',
      admin: {
        description: '后续细调四辨审核 Agent 时优先从这里读取基础提示词。',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: '备注',
      admin: {
        description: '记录供应商账号、使用范围、测试结论或切换说明，避免填写无关敏感信息。',
      },
    },
  ],
}
