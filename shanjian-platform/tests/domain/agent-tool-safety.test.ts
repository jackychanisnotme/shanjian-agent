import { describe, expect, it } from 'vitest'

import { getAgentToolSafety, isAgentToolWriteOperation } from '../../src/server/agent/toolSafety'

describe('Agent tool safety classifier', () => {
  it('classifies known read and write tools deterministically', () => {
    expect(getAgentToolSafety('filesystem_read_file')).toBe('read')
    expect(getAgentToolSafety('terminal_run_readonly')).toBe('read')
    expect(getAgentToolSafety('agent_runtime_status')).toBe('read')

    expect(getAgentToolSafety('terminal_run')).toBe('write')
    expect(getAgentToolSafety('filesystem_write_file')).toBe('write')
    expect(getAgentToolSafety('case_review_generate_suggestions')).toBe('write')
    expect(isAgentToolWriteOperation('filesystem_write_file')).toBe(true)
    expect(isAgentToolWriteOperation('filesystem_read_file')).toBe(false)
    expect(isAgentToolWriteOperation('case_review_generate_suggestions')).toBe(true)
  })
})
