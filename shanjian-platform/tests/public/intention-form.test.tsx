import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { IntentionRegistrationForm } from '../../src/components/public/IntentionRegistrationForm'
import { seedPublicProjects } from '../../src/domain/demoSeed'

describe('IntentionRegistrationForm', () => {
  it('labels the public action as intention registration rather than payment', () => {
    render(<IntentionRegistrationForm project={seedPublicProjects[0]} />)

    expect(screen.getByRole('heading', { name: '登记帮助意向' })).toBeInTheDocument()
    expect(screen.getByText(/平台仅登记帮助意向/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /支付/ })).not.toBeInTheDocument()
  })
})
