import { spawn } from 'node:child_process'

import { projectRoot } from './workspace'

const allowedCommands = new Set(['ls', 'pwd', 'rg', 'grep', 'find', 'cat', 'head', 'tail', 'wc', 'git'])
const allowedGitSubcommands = new Set(['status', 'diff', 'show', 'log', 'branch', 'rev-parse', 'ls-files', 'grep'])
const blockedShellOperators = /[;&|`$<>]/
const blockedArgumentPatterns = [/^--exec\b/, /^-exec\b/, /^--delete\b/, /^--remove\b/, /^--output\b/, /^-o$/, /^--write\b/]

export type TerminalRunResult = {
  command: string
  cwd: string
  exitCode: number | null
  stdout: string
  stderr: string
  timedOut: boolean
}

export function isReadonlyTerminalCommandAllowed(command: string): boolean {
  const trimmed = command.trim()
  if (!trimmed || blockedShellOperators.test(trimmed)) return false

  const parts = parseCommand(trimmed)
  const [binary, subcommand] = parts
  if (!binary || !allowedCommands.has(binary)) return false

  if (parts.some((part) => blockedArgumentPatterns.some((pattern) => pattern.test(part)))) return false

  if (binary === 'git') {
    return Boolean(subcommand && allowedGitSubcommands.has(subcommand) && !isBlockedGitCommand(parts))
  }

  return true
}

export async function runReadonlyTerminalCommand(command: string, timeoutMs = 8000): Promise<TerminalRunResult> {
  if (!isReadonlyTerminalCommandAllowed(command)) {
    throw new Error('只读终端策略拒绝执行该命令')
  }

  const [binary, ...args] = parseCommand(command)

  return new Promise((resolve) => {
    const child = spawn(binary, args, {
      cwd: projectRoot,
      shell: false,
      env: { ...process.env, FORCE_COLOR: '0' },
    })
    const stdoutChunks: Buffer[] = []
    const stderrChunks: Buffer[] = []
    let timedOut = false

    const timer = setTimeout(() => {
      timedOut = true
      child.kill('SIGTERM')
    }, timeoutMs)

    child.stdout.on('data', (chunk: Buffer) => stdoutChunks.push(chunk))
    child.stderr.on('data', (chunk: Buffer) => stderrChunks.push(chunk))
    child.on('close', (exitCode) => {
      clearTimeout(timer)
      resolve({
        command,
        cwd: projectRoot,
        exitCode,
        stdout: truncateText(Buffer.concat(stdoutChunks).toString('utf8')),
        stderr: truncateText(Buffer.concat(stderrChunks).toString('utf8')),
        timedOut,
      })
    })
  })
}

export function getTerminalStatus() {
  return {
    cwd: projectRoot,
    readonlyCommands: Array.from(allowedCommands).sort(),
    writeCommandsEnabled: false,
  }
}

function parseCommand(command: string): string[] {
  const matches = command.match(/"([^"]*)"|'([^']*)'|[^\s]+/g) ?? []

  return matches.map((part) => {
    if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"))) {
      return part.slice(1, -1)
    }

    return part
  })
}

function isBlockedGitCommand(parts: string[]): boolean {
  const commandText = parts.join(' ')

  return /\b(reset|checkout|clean|commit|push|pull|merge|rebase|apply|am|switch|restore|add|rm)\b/.test(commandText)
}

function truncateText(value: string, maxLength = 12000): string {
  if (value.length <= maxLength) return value

  return `${value.slice(0, maxLength)}\n[输出已截断，请缩小命令范围]`
}
