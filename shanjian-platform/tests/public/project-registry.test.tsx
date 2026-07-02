import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ProjectRegistry } from '../../src/components/public/ProjectRegistry'
import { seedPublicProjects } from '../../src/domain/demoSeed'

describe('ProjectRegistry', () => {
  it('renders de-identified projects without payment CTA', () => {
    render(<ProjectRegistry projects={seedPublicProjects} />)

    expect(screen.getByText('公众项目展示')).toBeInTheDocument()
    expect(screen.getByText(seedPublicProjects[0].patientAlias)).toBeInTheDocument()
    expect(screen.queryByText('立即支付')).not.toBeInTheDocument()
    expect(screen.getAllByText(/登记帮助意向/).length).toBeGreaterThan(0)
  })

  it('uses an admin-style collection table structure', () => {
    render(<ProjectRegistry projects={seedPublicProjects} />)

    expect(screen.getByRole('navigation', { name: '公共项目导航' })).toBeInTheDocument()
    expect(screen.getByRole('table', { name: '公开项目列表' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: '状态' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: '资源缺口' })).toBeInTheDocument()
  })

  it('localizes the admin-style navigation and collection summary', () => {
    render(<ProjectRegistry projects={seedPublicProjects} />)
    const navigation = screen.getByRole('navigation', { name: '公共项目导航' })

    expect(navigation).toHaveTextContent('项目管理')
    expect(navigation).toHaveTextContent('公开项目')
    expect(navigation).toHaveTextContent('求助申请')
    expect(navigation).toHaveTextContent('帮助意向')
    expect(navigation).not.toHaveTextContent('机构后台')
    expect(screen.getByRole('link', { name: '机构后台' })).toBeInTheDocument()
    expect(screen.getByText('控制台 / 项目')).toBeInTheDocument()
    expect(screen.getByText(`${seedPublicProjects.length} 条记录 · 脱敏项目索引`)).toBeInTheDocument()
    expect(screen.getByText('已公开')).toBeInTheDocument()
  })

  it('shows a Chinese empty state when there are no published projects', () => {
    render(<ProjectRegistry projects={[]} />)

    expect(screen.getByText('暂无公开项目')).toBeInTheDocument()
    expect(screen.getByText('机构完成复核并手动发布后，项目会显示在这里。')).toBeInTheDocument()
  })
})
