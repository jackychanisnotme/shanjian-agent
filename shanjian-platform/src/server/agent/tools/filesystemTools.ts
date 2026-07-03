import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod'

import { defineAgentTool } from '../toolDefine'
import type { AnyAgentToolDefinition } from '../types'
import { projectRoot, resolveSafeWorkspacePath, toProjectRelativePath } from '../workspace'

const ignoredDirectoryNames = new Set(['.git', '.next', 'node_modules', 'dist', 'coverage'])

export const filesystemTools: AnyAgentToolDefinition[] = [
  defineAgentTool({
    name: 'filesystem_list_directory',
    description: '列出项目工作区内的目录内容',
    safety: 'read',
    inputSchema: z.object({
      path: z.string().default('.'),
      depth: z.number().int().min(0).max(3).default(1),
    }),
    handler: async ({ path: inputPath, depth }) => {
      const root = resolveSafeWorkspacePath(inputPath)
      const entries = await listDirectory(root, depth)

      return { root: toProjectRelativePath(root), entries }
    },
  }),
  defineAgentTool({
    name: 'filesystem_search_files',
    description: '按文件名关键词搜索项目工作区内的文件',
    safety: 'read',
    inputSchema: z.object({
      query: z.string().min(1),
      path: z.string().default('.'),
      limit: z.number().int().min(1).max(200).default(50),
    }),
    handler: async ({ query, path: inputPath, limit }) => {
      const root = resolveSafeWorkspacePath(inputPath)
      const files = await collectFiles(root, limit, (filePath) => path.basename(filePath).includes(query))

      return { query, files }
    },
  }),
  defineAgentTool({
    name: 'filesystem_search_content',
    description: '按文本关键词搜索项目工作区内的文件内容',
    safety: 'read',
    inputSchema: z.object({
      query: z.string().min(1),
      path: z.string().default('.'),
      limit: z.number().int().min(1).max(100).default(30),
    }),
    handler: async ({ query, path: inputPath, limit }) => {
      const root = resolveSafeWorkspacePath(inputPath)
      const files = await collectFiles(root, limit * 8)
      const matches: Array<{ file: string; line: number; preview: string }> = []

      for (const file of files) {
        if (matches.length >= limit) break

        const content = await safeReadText(path.resolve(projectRoot, file), 200000)
        if (!content) continue

        const lines = content.split('\n')
        const lineIndex = lines.findIndex((line) => line.includes(query))
        if (lineIndex >= 0) {
          matches.push({
            file,
            line: lineIndex + 1,
            preview: lines[lineIndex].trim().slice(0, 240),
          })
        }
      }

      return { query, matches }
    },
  }),
  defineAgentTool({
    name: 'filesystem_read_file',
    description: '读取项目工作区内的文本文件',
    safety: 'read',
    inputSchema: z.object({
      path: z.string().min(1),
      maxBytes: z.number().int().positive().max(200000).default(60000),
    }),
    handler: async ({ path: inputPath, maxBytes }) => {
      const filePath = resolveSafeWorkspacePath(inputPath)
      const content = await safeReadText(filePath, maxBytes)

      if (content === null) {
        throw new Error('文件不存在、不是普通文件，或不是可读取文本')
      }

      return { path: toProjectRelativePath(filePath), content }
    },
  }),
]

async function listDirectory(root: string, depth: number): Promise<Array<{ path: string; type: 'file' | 'directory' }>> {
  const dirents = await readdir(root, { withFileTypes: true })
  const entries: Array<{ path: string; type: 'file' | 'directory' }> = []

  for (const dirent of dirents) {
    if (dirent.isDirectory() && ignoredDirectoryNames.has(dirent.name)) continue

    const fullPath = path.resolve(root, dirent.name)
    entries.push({
      path: toProjectRelativePath(fullPath),
      type: dirent.isDirectory() ? 'directory' : 'file',
    })

    if (dirent.isDirectory() && depth > 1) {
      entries.push(...(await listDirectory(fullPath, depth - 1)))
    }
  }

  return entries
}

async function collectFiles(
  root: string,
  limit: number,
  predicate: (relativePath: string) => boolean = () => true,
): Promise<string[]> {
  const found: string[] = []

  async function walk(directory: string): Promise<void> {
    if (found.length >= limit) return

    const dirents = await readdir(directory, { withFileTypes: true })

    for (const dirent of dirents) {
      if (found.length >= limit) break
      if (dirent.isDirectory() && ignoredDirectoryNames.has(dirent.name)) continue

      const fullPath = path.resolve(directory, dirent.name)

      if (dirent.isDirectory()) {
        await walk(fullPath)
      } else if (dirent.isFile()) {
        const relative = toProjectRelativePath(fullPath)
        if (predicate(relative)) found.push(relative)
      }
    }
  }

  await walk(root)

  return found
}

async function safeReadText(filePath: string, maxBytes: number): Promise<string | null> {
  try {
    const fileStat = await stat(filePath)
    if (!fileStat.isFile()) return null

    const handle = await readFile(filePath)
    const slice = handle.subarray(0, maxBytes)
    if (slice.includes(0)) return null

    const content = slice.toString('utf8')

    return handle.length > maxBytes ? `${content}\n[文件内容已截断，请缩小读取范围]` : content
  } catch {
    return null
  }
}
