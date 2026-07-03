import type { AgentToolSafety } from './types'

const explicitReadTools = new Set([
  'filesystem_list_directory',
  'filesystem_search_files',
  'filesystem_search_content',
  'filesystem_read_file',
  'repository_list',
  'repository_read_summary',
  'repository_read_file',
  'terminal_status',
  'terminal_cwd',
  'terminal_run_readonly',
  'agent_runtime_status',
  'agent_runtime_logs',
])

const explicitWriteTools = new Set([
  'filesystem_write_file',
  'case_review_generate_suggestions',
  'terminal_run',
  'memory_write',
  'sql_execute_write',
  'taskflow_start',
])

export function getAgentToolSafety(toolName: string): AgentToolSafety {
  if (explicitReadTools.has(toolName)) return 'read'
  if (explicitWriteTools.has(toolName)) return 'write'

  const normalized = toolName.toLowerCase()
  const writeSignals = ['write', 'create', 'update', 'delete', 'remove', 'run', 'execute', 'start', 'stop', 'send']

  return writeSignals.some((signal) => normalized.includes(signal)) ? 'write' : 'read'
}

export function isAgentToolWriteOperation(toolName: string): boolean {
  return getAgentToolSafety(toolName) === 'write'
}
