import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AidApplicationForm } from '../../src/components/public/AidApplicationForm'

describe('AidApplicationForm', () => {
  it('labels public submission as institutional review rather than payment', () => {
    render(<AidApplicationForm />)

    expect(screen.getByRole('heading', { name: '提交求助申请' })).toBeInTheDocument()
    expect(screen.getByText(/提交后进入机构后台待复核/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '提交求助申请' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /支付|收款|募捐/ })).not.toBeInTheDocument()
    expect(screen.queryByText('立即支付')).not.toBeInTheDocument()
  })

  it('shows a waiting-for-review confirmation after submission', () => {
    render(<AidApplicationForm submissionId="42" />)

    expect(screen.getByText('已提交，等待机构复核')).toBeInTheDocument()
    expect(screen.getByText('后台记录编号：42')).toBeInTheDocument()
  })
})
