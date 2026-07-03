import path from 'node:path'

export const projectRoot = process.cwd()
export const agentWorkspaceRoot = path.resolve(projectRoot, 'agent-workspace')

export function resolveSafeWorkspacePath(inputPath: string): string {
  const resolved = path.resolve(projectRoot, inputPath)

  if (isInside(resolved, projectRoot) || isInside(resolved, agentWorkspaceRoot)) {
    return resolved
  }

  throw new Error('路径不在允许的 Agent 工作区范围内')
}

export function toProjectRelativePath(resolvedPath: string): string {
  return path.relative(projectRoot, resolvedPath) || '.'
}

function isInside(targetPath: string, parentPath: string): boolean {
  const relative = path.relative(parentPath, targetPath)

  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))
}
