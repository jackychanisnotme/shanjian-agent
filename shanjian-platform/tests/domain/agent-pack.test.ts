import { describe, expect, it } from 'vitest'

import { expandMountedPacks, getAgentPackTools } from '../../src/server/agent/packService'

describe('Agent capability packs', () => {
  it('mounts base read tools before repo tools', () => {
    expect(expandMountedPacks(['repo-pack'])).toEqual(['base-read-pack', 'repo-pack'])
  })

  it('keeps repo pack read-only and deduplicated', () => {
    const tools = getAgentPackTools(['repo-pack'])
    const toolNames = tools.map((tool) => tool.name)

    expect(toolNames).toEqual(expect.arrayContaining(['filesystem_read_file', 'repository_read_file', 'terminal_run_readonly']))
    expect(new Set(toolNames).size).toBe(toolNames.length)
    expect(tools.every((tool) => tool.safety === 'read')).toBe(true)
  })
})
