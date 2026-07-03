import type { Payload } from 'payload'

import { getAgentToolByName } from './packService'
import { createPreview, truncateResult } from './preview'
import type { AgentToolResult } from './types'

type ExecuteAgentToolInput = {
  payload?: Payload
  toolName: string
  args?: unknown
  timeoutMs?: number
}

export async function executeAgentTool({
  payload,
  toolName,
  args = {},
  timeoutMs = 30000,
}: ExecuteAgentToolInput): Promise<AgentToolResult> {
  const tool = getAgentToolByName(toolName)
  if (!tool) throw new Error(`未知 Agent 工具：${toolName}`)

  const startedAt = Date.now()
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const parsedArgs = await tool.parseArgs(args)
    const rawData = await tool.handler(parsedArgs as never, { payload, signal: controller.signal })
    const { value, truncated } = truncateResult(rawData)
    const durationMs = Date.now() - startedAt
    const result: AgentToolResult = {
      ok: true,
      toolName,
      safety: tool.safety,
      durationMs,
      data: value,
      truncated,
    }

    await writeRuntimeLog(payload, {
      toolName,
      safety: tool.safety,
      success: true,
      durationMs,
      argsPreview: createPreview(args),
      resultPreview: createPreview(value),
    })

    return result
  } catch (error) {
    const durationMs = Date.now() - startedAt
    const message = error instanceof Error ? error.message : String(error)
    const result: AgentToolResult = {
      ok: false,
      toolName,
      safety: tool.safety,
      durationMs,
      error: message,
      truncated: false,
    }

    await writeRuntimeLog(payload, {
      toolName,
      safety: tool.safety,
      success: false,
      durationMs,
      argsPreview: createPreview(args),
      resultPreview: createPreview({ error: message }),
      errorMessage: message,
    })

    return result
  } finally {
    clearTimeout(timer)
  }
}

export async function executeAgentToolsInParallel(
  calls: Array<Omit<ExecuteAgentToolInput, 'payload'> & { payload?: Payload }>,
  sharedPayload?: Payload,
): Promise<AgentToolResult[]> {
  return Promise.all(calls.map((call) => executeAgentTool({ payload: call.payload ?? sharedPayload, ...call })))
}

async function writeRuntimeLog(
  payload: Payload | undefined,
  data: {
    toolName: string
    safety: 'read' | 'write'
    success: boolean
    durationMs: number
    argsPreview: string
    resultPreview: string
    errorMessage?: string
  },
) {
  if (!payload) return

  await payload.create({
    collection: 'agent-runtime-logs',
    data,
  })
}
