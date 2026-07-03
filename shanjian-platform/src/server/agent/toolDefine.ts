import { z, type ZodType } from 'zod'

import type { AgentToolDefinition, AgentToolHandler, AgentToolSafety } from './types'

type DefineAgentToolOptions<TArgs, TResult> = {
  name: string
  description: string
  safety: AgentToolSafety
  inputSchema: ZodType<TArgs>
  handler: AgentToolHandler<TArgs, TResult>
}

export function defineAgentTool<TArgs, TResult>(
  options: DefineAgentToolOptions<TArgs, TResult>,
): AgentToolDefinition<TArgs, TResult> {
  return {
    ...options,
    jsonSchema: z.toJSONSchema(options.inputSchema) as Record<string, unknown>,
    parseArgs: async (args: unknown) => {
      const parsed = await options.inputSchema.safeParseAsync(args)

      if (!parsed.success) {
        throw new Error(`参数校验失败：${z.prettifyError(parsed.error)}`)
      }

      return parsed.data
    },
  }
}
