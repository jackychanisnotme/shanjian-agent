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

    expect(screen.getByText('项目管理')).toBeInTheDocument()
    expect(screen.getAllByText('公开项目').length).toBeGreaterThan(0)
    expect(screen.getByText('帮助意向')).toBeInTheDocument()
    expect(screen.getAllByText('机构后台').length).toBeGreaterThan(0)
    expect(screen.getByText('控制台 / 项目')).toBeInTheDocument()
    expect(screen.getByText(`${seedPublicProjects.length} 条记录 · 脱敏项目索引`)).toBeInTheDocument()
    expect(screen.getByText('已公开')).toBeInTheDocument()
  })
})
