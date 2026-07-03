import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

describe('project agent instructions', () => {
  it('documents how future 四辨审核 agents should use backend Agent 配置', async () => {
    const doc = await readFile(path.resolve(process.cwd(), 'AGENTS.md'), 'utf8')

    expect(doc).toContain('Agent 配置')
    expect(doc).toContain('agent-configs')
    expect(doc).toContain('baseUrl')
    expect(doc).toContain('apiKey')
    expect(doc).toContain('四辨审核')
    expect(doc).toContain('不要自动公开项目')
    expect(doc).toContain('Agent Runtime')
    expect(doc).toContain('agent-runtime-logs')
    expect(doc).toContain('只读终端')
  })
})
