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

  it('allows applicants to upload supporting material files for institutional review', () => {
    render(<AidApplicationForm />)

    const fileInput = screen.getByLabelText('上传证明材料')

    expect(fileInput).toHaveAttribute('type', 'file')
    expect(fileInput).toHaveAttribute('name', 'materialFiles')
    expect(fileInput).toHaveAttribute('multiple')
    expect(screen.getByText(/诊断摘要、医疗费用发票、医保或商保回执/)).toBeInTheDocument()
  })

  it('keeps the public application form focused on applicant-facing questions', () => {
    render(<AidApplicationForm />)

    expect(screen.getByLabelText('病情与治疗情况')).toHaveAttribute('name', 'conditionAndTreatment')
    expect(screen.getByLabelText('目前最主要的费用缺口/压力')).toHaveAttribute(
      'name',
      'expensePressure',
    )
    expect(screen.getByLabelText('家庭情况与求助原因')).toHaveAttribute('name', 'familySituation')
    expect(screen.getByRole('group', { name: '需要哪些帮助' })).toBeInTheDocument()
    expect(screen.getByLabelText('补充说明')).toHaveAttribute('name', 'additionalNotes')

    expect(screen.queryByLabelText('病情摘要')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('治疗阶段')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('总费用')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('已支付金额')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('医保/商保预估')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('受助人真实需要')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('材料说明')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('已有诊断摘要')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('最新医疗费用发票待补充')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('原始叙事')).not.toBeInTheDocument()
  })
})
