import type { Payload } from 'payload'
import type { ZodType } from 'zod'

export type AgentToolSafety = 'read' | 'write'

export type AgentPackName = 'base-read-pack' | 'repo-pack' | 'data-pack' | 'memory-pack' | 'search-pack'

export type AgentToolContext = {
  payload?: Payload
  signal?: AbortSignal
}

export type AgentToolHandler<TArgs, TResult> = (args: TArgs, context: AgentToolContext) => Promise<TResult> | TResult

export type AgentToolDefinition<TArgs = unknown, TResult = unknown> = {
  name: string
  description: string
  safety: AgentToolSafety
  inputSchema: ZodType<TArgs>
  jsonSchema: Record<string, unknown>
  parseArgs: (args: unknown) => Promise<TArgs>
  handler: AgentToolHandler<TArgs, TResult>
}

export type AnyAgentToolDefinition = Omit<AgentToolDefinition<never, unknown>, 'handler' | 'inputSchema' | 'parseArgs'> & {
  inputSchema: ZodType
  handler: AgentToolHandler<never, unknown>
  parseArgs: (args: unknown) => Promise<unknown>
}

export type AgentToolCall = {
  toolName: string
  args?: unknown
}

export type AgentToolResult =
  | {
      ok: true
      toolName: string
      safety: AgentToolSafety
      durationMs: number
      data: unknown
      truncated: boolean
    }
  | {
      ok: false
      toolName: string
      safety: AgentToolSafety
      durationMs: number
      error: string
      truncated: false
    }

export type AgentRuntimeLog = {
  toolName: string
  safety: AgentToolSafety
  success: boolean
  durationMs: number
  argsPreview: string
  resultPreview: string
  errorMessage?: string
}
