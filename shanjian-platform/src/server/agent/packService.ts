import { caseReviewTools } from './tools/caseReviewTools'
import { filesystemTools } from './tools/filesystemTools'
import { repositoryTools } from './tools/repositoryTools'
import { runtimeTools } from './tools/runtimeTools'
import { terminalTools } from './tools/terminalTools'
import type { AgentPackName, AnyAgentToolDefinition } from './types'

const packDependencies: Record<AgentPackName, AgentPackName[]> = {
  'base-read-pack': [],
  'repo-pack': ['base-read-pack'],
  'data-pack': ['base-read-pack'],
  'memory-pack': ['base-read-pack'],
  'search-pack': ['base-read-pack'],
}

const packTools: Record<AgentPackName, AnyAgentToolDefinition[]> = {
  'base-read-pack': [...runtimeTools, ...filesystemTools, ...terminalTools],
  'repo-pack': repositoryTools,
  'data-pack': caseReviewTools,
  'memory-pack': [],
  'search-pack': [],
}

export function expandMountedPacks(packs: AgentPackName[]): AgentPackName[] {
  const mounted = new Set<AgentPackName>()

  function addPack(pack: AgentPackName) {
    for (const dependency of packDependencies[pack]) addPack(dependency)
    mounted.add(pack)
  }

  for (const pack of packs) addPack(pack)

  return Array.from(mounted)
}

export function getAgentPackTools(
  packs: AgentPackName[] = ['base-read-pack', 'repo-pack', 'data-pack'],
): AnyAgentToolDefinition[] {
  const toolsByName = new Map<string, AnyAgentToolDefinition>()

  for (const pack of expandMountedPacks(packs)) {
    for (const tool of packTools[pack]) {
      toolsByName.set(tool.name, tool)
    }
  }

  return Array.from(toolsByName.values())
}

export function getAgentToolByName(toolName: string): AnyAgentToolDefinition | undefined {
  return getAgentPackTools().find((tool) => tool.name === toolName)
}
