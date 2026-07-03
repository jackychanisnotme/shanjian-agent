// Any setup scripts you might need go here

// Load .env files
import 'dotenv/config'
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import { randomUUID } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

const workerId = process.env.VITEST_WORKER_ID || `${process.pid}`
const dbDir = path.join(tmpdir(), 'shanjian-platform-vitest')
mkdirSync(dbDir, { recursive: true })
process.env.DATABASE_URL = `file:${path.join(dbDir, `payload-${workerId}-${randomUUID()}.db`)}`

afterEach(() => {
  cleanup()
})
