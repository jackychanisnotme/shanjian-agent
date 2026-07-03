import { describe, expect, it } from 'vitest'

import { isReadonlyTerminalCommandAllowed } from '../../src/server/agent/terminalService'

describe('readonly terminal command policy', () => {
  it('allows safe inspection commands', () => {
    expect(isReadonlyTerminalCommandAllowed('ls')).toBe(true)
    expect(isReadonlyTerminalCommandAllowed('rg output-profile backend/src')).toBe(true)
    expect(isReadonlyTerminalCommandAllowed('git status')).toBe(true)
    expect(isReadonlyTerminalCommandAllowed('git diff -- src')).toBe(true)
    expect(isReadonlyTerminalCommandAllowed('cat package.json')).toBe(true)
  })

  it('rejects write-capable or uncontrolled commands', () => {
    expect(isReadonlyTerminalCommandAllowed('rm -rf .next')).toBe(false)
    expect(isReadonlyTerminalCommandAllowed('git reset --hard')).toBe(false)
    expect(isReadonlyTerminalCommandAllowed('npm run build')).toBe(false)
    expect(isReadonlyTerminalCommandAllowed(`python -c "open('x','w').write('no')"`)).toBe(false)
  })
})
