import { z } from 'zod'
import { describe, expect, it } from 'vitest'

import { defineAgentTool } from '../../src/server/agent/toolDefine'

describe('Agent tool definition', () => {
  it('generates strict JSON schema and validates arguments with Zod', async () => {
    const tool = defineAgentTool({
      name: 'filesystem_read_file',
      description: '读取工作区内的文本文件',
      safety: 'read',
      inputSchema: z.object({
        path: z.string().min(1),
        maxBytes: z.number().int().positive().optional(),
      }),
      handler: async (args) => ({ path: args.path }),
    })

    expect(tool.jsonSchema).toMatchObject({
      type: 'object',
      additionalProperties: false,
      properties: {
        path: { type: 'string', minLength: 1 },
        maxBytes: { type: 'integer' },
      },
      required: ['path'],
    })

    await expect(tool.parseArgs({ path: 'README.md' })).resolves.toEqual({ path: 'README.md' })
    await expect(tool.parseArgs({ path: '' })).rejects.toThrow('参数校验失败')
  })
})
