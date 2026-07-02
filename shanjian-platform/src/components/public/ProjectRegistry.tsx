import Link from 'next/link'

import { buttonClassName } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { formatCurrency, type ProjectStatus, type PublicProject } from '../../domain/charity'

interface ProjectRegistryProps {
  projects: PublicProject[]
}

const statusLabels: Record<ProjectStatus, string> = {
  urgent: '紧急',
  in_treatment: '治疗中',
  awaiting_materials: '待补材料',
  receiving_intentions: '接收帮助意向',
  completed: '阶段完成',
}

export function ProjectRegistry({ projects }: ProjectRegistryProps) {
  return (
    <section className="public-console" aria-labelledby="project-registry-title">
      <nav className="public-sidebar" aria-label="公共项目导航">
        <Link className="sidebar-brand" href="/">
          善见 Platform
        </Link>
        <div className="sidebar-group">
          <span>项目管理</span>
          <Link aria-current="page" href="/projects">
            公开项目
          </Link>
          <Link href="/intentions/new">帮助意向</Link>
          <Link href="/admin">机构后台</Link>
        </div>
        <div className="sidebar-note">
          公众侧为只读项目索引。所有审核、拨付与反馈发布仍在机构后台完成。
        </div>
      </nav>

      <div className="public-workspace">
        <header className="public-topbar">
          <div>
            <span className="breadcrumb">控制台 / 项目</span>
            <h1 id="project-registry-title">公众项目展示</h1>
          </div>
          <Link className={buttonClassName('secondary')} href="/admin">
            机构后台
          </Link>
        </header>

        <div className="collection-toolbar">
          <div>
            <h2>公开项目</h2>
            <p>{projects.length} 条记录 · 脱敏项目索引</p>
          </div>
          <div className="toolbar-meta">
            <span>已公开</span>
            <strong>{projects.filter((project) => project.isPublished).length}</strong>
          </div>
        </div>

        <div className="compliance-strip" role="note">
          平台仅登记帮助意向，不在平台内收款。真实募捐主体、资金账户、票据、拨付和最终救助决策由有资质机构负责。
        </div>

        <div className="collection-table-wrap">
          <table aria-label="公开项目列表" className="collection-table">
            <thead>
              <tr>
                <th scope="col">项目</th>
                <th scope="col">状态</th>
                <th scope="col">地区</th>
                <th scope="col">资源缺口</th>
                <th scope="col">真实需要</th>
                <th scope="col">操作</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>
                    <Link className="table-title-link" href={`/projects/${project.slug}`}>
                      {project.patientAlias}
                    </Link>
                    <span>{project.diseaseLabel}</span>
                    <small>{project.verifiedNeed}</small>
                  </td>
                  <td>
                    <Badge tone={project.status === 'urgent' ? 'urgent' : 'neutral'}>
                      {statusLabels[project.status]}
                    </Badge>
                  </td>
                  <td>{project.region}</td>
                  <td>{formatCurrency(project.resourceGap)}</td>
                  <td>
                    <div className="need-stack">
                      {project.needs.slice(0, 3).map((need) => (
                        <span key={need.id}>{need.label}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link className={buttonClassName('secondary')} href={`/projects/${project.slug}`}>
                        查看
                      </Link>
                      <Link className={buttonClassName('primary')} href={`/intentions/new?project=${project.slug}`}>
                        登记帮助意向
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
