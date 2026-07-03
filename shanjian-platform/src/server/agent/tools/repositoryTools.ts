import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod'

import { defineAgentTool } from '../toolDefine'
import type { AnyAgentToolDefinition } from '../types'
import { projectRoot, resolveSafeWorkspacePath, toProjectRelativePath } from '../workspace'

export const repositoryTools: AnyAgentToolDefinition[] = [
  defineAgentTool({
    name: 'repository_list',
    description: '列出当前可读代码仓库',
    safety: 'read',
    inputSchema: z.object({}),
    handler: () => ({
      repositories: [
        {
          name: path.basename(projectRoot),
          root: projectRoot,
          type: 'local-git-workspace',
        },
      ],
    }),
  }),
  defineAgentTool({
    name: 'repository_read_summary',
    description: '读取当前仓库 README 摘要',
    safety: 'read',
    inputSchema: z.object({}),
    handler: async () => {
      const readmePath = resolveSafeWorkspacePath('README.md')
      const content = await readFile(readmePath, 'utf8')

      return {
        repository: path.basename(projectRoot),
        readme: content.slice(0, 4000),
      }
    },
  }),
  defineAgentTool({
    name: 'repository_read_file',
    description: '读取当前仓库内的指定文件',
    safety: 'read',
    inputSchema: z.object({
      path: z.string().min(1),
      maxBytes: z.number().int().positive().max(200000).default(60000),
    }),
    handler: async ({ path: inputPath, maxBytes }) => {
      const filePath = resolveSafeWorkspacePath(inputPath)
      const content = await readFile(filePath)
      const slice = content.subarray(0, maxBytes).toString('utf8')

      return {
        path: toProjectRelativePath(filePath),
        content: content.length > maxBytes ? `${slice}\n[文件内容已截断，请缩小读取范围]` : slice,
      }
    },
  }),
]
