import { z } from 'zod'

import { defineAgentTool } from '../toolDefine'
import { getTerminalStatus, runReadonlyTerminalCommand } from '../terminalService'
import type { AnyAgentToolDefinition } from '../types'
import { projectRoot } from '../workspace'

export const terminalTools: AnyAgentToolDefinition[] = [
  defineAgentTool({
    name: 'terminal_status',
    description: '查看 Agent 终端能力状态',
    safety: 'read',
    inputSchema: z.object({}),
    handler: () => getTerminalStatus(),
  }),
  defineAgentTool({
    name: 'terminal_cwd',
    description: '查看 Agent 终端当前工作目录',
    safety: 'read',
    inputSchema: z.object({}),
    handler: () => ({ cwd: projectRoot }),
  }),
  defineAgentTool({
    name: 'terminal_run_readonly',
    description: '执行只读终端检查命令',
    safety: 'read',
    inputSchema: z.object({
      command: z.string().min(1),
      timeoutMs: z.number().int().min(1000).max(30000).default(8000),
    }),
    handler: ({ command, timeoutMs }) => runReadonlyTerminalCommand(command, timeoutMs),
  }),
]
