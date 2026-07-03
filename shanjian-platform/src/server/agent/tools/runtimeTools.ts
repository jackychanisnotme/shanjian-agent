import { z } from 'zod'

import { defineAgentTool } from '../toolDefine'
import type { AnyAgentToolDefinition } from '../types'
import { agentWorkspaceRoot, projectRoot } from '../workspace'

export const runtimeTools: AnyAgentToolDefinition[] = [
  defineAgentTool({
    name: 'agent_runtime_status',
    description: '查看 Agent Runtime 状态和已开放能力',
    safety: 'read',
    inputSchema: z.object({}).passthrough(),
    handler: () => ({
      status: 'ready',
      projectRoot,
      agentWorkspaceRoot,
      mountedPacks: ['base-read-pack', 'repo-pack'],
      writeToolsEnabled: false,
    }),
  }),
  defineAgentTool({
    name: 'agent_runtime_logs',
    description: '读取最近 Agent 工具执行日志',
    safety: 'read',
    inputSchema: z.object({
      limit: z.number().int().min(1).max(50).default(10),
    }),
    handler: async ({ limit }, context) => {
      if (!context.payload) return { logs: [] }

      const logs = await context.payload.find({
        collection: 'agent-runtime-logs',
        sort: '-createdAt',
        limit,
      })

      return {
        logs: logs.docs.map((log) => ({
          toolName: log.toolName,
          safety: log.safety,
          success: log.success,
          durationMs: log.durationMs,
          createdAt: log.createdAt,
        })),
      }
    },
  }),
]
