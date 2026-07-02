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

  it('supports a general intention pool when no project is selected', () => {
    render(<IntentionRegistrationForm />)

    expect(screen.getByText('通用意向池')).toBeInTheDocument()
    expect(screen.getByText(/机构工作人员会在后台匹配具体项目/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '提交帮助意向' })).toBeInTheDocument()
  })
})
