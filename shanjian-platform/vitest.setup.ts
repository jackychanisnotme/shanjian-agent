// Any setup scripts you might need go here

// Load .env files
import 'dotenv/config'
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
