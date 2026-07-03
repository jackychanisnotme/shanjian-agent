import { beforeAll, describe, expect, it } from 'vitest'
import { getPayload, type Payload } from 'payload'

import config from '../../src/payload.config'
import { getActiveAgentConfig, sanitizeAgentConfig } from '../../src/server/agent/configService'
import { executeAgentTool } from '../../src/server/agent/toolService'

let payload: Payload

describe('Agent runtime integration', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  it('reads the active LLM config without exposing apiKey in sanitized output', async () => {
    const uniqueName = `测试 Agent 配置 ${Date.now()}`
    const created = await payload.create({
      collection: 'agent-configs',
      data: {
        configName: uniqueName,
        isActive: true,
        provider: 'openai_compatible',
        baseUrl: 'https://llm.example.test/v1',
        apiKey: 'sk-sensitive-runtime-test',
        modelName: 'test-model',
        temperature: 0.2,
        maxOutputTokens: 1200,
        timeoutSeconds: 30,
        systemPrompt: '只做内部审核辅助。',
      },
    })

    const active = await getActiveAgentConfig(payload)
    const sanitized = sanitizeAgentConfig(active)

    expect(active?.id).toBe(created.id)
    expect(active?.apiKey).toBe('sk-sensitive-runtime-test')
    expect(sanitized).toMatchObject({
      configName: uniqueName,
      baseUrl: 'https://llm.example.test/v1',
      modelName: 'test-model',
      timeoutSeconds: 30,
    })
    expect(sanitized).not.toHaveProperty('apiKey')
    expect(JSON.stringify(sanitized)).not.toContain('sk-sensitive-runtime-test')
  })

  it('applies server defaults when optional model fields are omitted', async () => {
    const uniqueName = `测试 Agent 可选模型字段 ${Date.now()}`

    await payload.create({
      collection: 'agent-configs',
      data: {
        configName: uniqueName,
        isActive: true,
        provider: 'openai_compatible',
        baseUrl: 'https://llm.example.test/v1',
        apiKey: 'sk-sensitive-default-test',
        maxOutputTokens: 1200,
        timeoutSeconds: 30,
        systemPrompt: '只做内部审核辅助。',
      },
    })

    const active = await getActiveAgentConfig(payload)

    expect(active?.configName).toBe(uniqueName)
    expect(active?.modelName).toBe('gpt-4.1-mini')
    expect(active?.temperature).toBe(0.2)
  })

  it('writes redacted runtime logs after executing a readonly tool', async () => {
    const result = await executeAgentTool({
      payload,
      toolName: 'agent_runtime_status',
      args: {
        apiKey: 'sk-never-log-this',
      },
    })

    expect(result.ok).toBe(true)

    const logs = await payload.find({
      collection: 'agent-runtime-logs',
      where: {
        toolName: {
          equals: 'agent_runtime_status',
        },
      },
      sort: '-createdAt',
      limit: 1,
    })

    expect(logs.docs).toHaveLength(1)
    expect(logs.docs[0]).toMatchObject({
      toolName: 'agent_runtime_status',
      safety: 'read',
      success: true,
    })
    expect(JSON.stringify(logs.docs[0])).not.toContain('sk-never-log-this')
  })
})
