import type { Payload } from 'payload'

export type ActiveAgentConfig = {
  id: number | string
  configName: string
  isActive?: boolean | null
  provider: string
  baseUrl: string
  apiKey: string
  modelName: string
  temperature?: number | null
  maxOutputTokens?: number | null
  timeoutSeconds?: number | null
  systemPrompt?: string | null
}

export type PublicAgentConfig = Omit<ActiveAgentConfig, 'apiKey'>

export async function getActiveAgentConfig(payload: Payload): Promise<ActiveAgentConfig | null> {
  const configs = await payload.find({
    collection: 'agent-configs',
    where: {
      isActive: {
        equals: true,
      },
    },
    limit: 1,
    sort: '-updatedAt',
  })

  const config = configs.docs[0]
  if (!config) return null

  return toActiveAgentConfig(config)
}

export async function getAgentConfigById(
  payload: Payload,
  configId: number | string,
): Promise<ActiveAgentConfig | null> {
  const config = await payload.findByID({
    collection: 'agent-configs',
    id: configId,
  })

  if (!config) return null

  return toActiveAgentConfig(config)
}

function toActiveAgentConfig(config: {
  apiKey: string
  baseUrl: string
  configName: string
  id: number | string
  isActive?: boolean | null
  maxOutputTokens?: number | null
  modelName?: string | null
  provider: string
  systemPrompt?: string | null
  temperature?: number | null
  timeoutSeconds?: number | null
}): ActiveAgentConfig {
  return {
    id: config.id,
    configName: config.configName,
    isActive: config.isActive,
    provider: config.provider,
    baseUrl: config.baseUrl,
    apiKey: config.apiKey,
    modelName: config.modelName || 'gpt-4.1-mini',
    temperature: config.temperature ?? 0.2,
    maxOutputTokens: config.maxOutputTokens,
    timeoutSeconds: config.timeoutSeconds,
    systemPrompt: config.systemPrompt,
  }
}

export function sanitizeAgentConfig(config: ActiveAgentConfig | null): PublicAgentConfig | null {
  if (!config) return null

  const { apiKey: _apiKey, ...publicConfig } = config

  return publicConfig
}
