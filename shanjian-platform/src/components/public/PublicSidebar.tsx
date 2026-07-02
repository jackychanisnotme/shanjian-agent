import Link from 'next/link'

interface PublicSidebarProps {
  current?: 'applications' | 'intentions' | 'projects'
}

export function PublicSidebar({ current }: PublicSidebarProps) {
  return (
    <nav className="public-sidebar" aria-label="公共项目导航">
      <Link className="sidebar-brand" href="/">
        善见 Platform
      </Link>
      <div className="sidebar-group">
        <span>项目管理</span>
        <Link aria-current={current === 'projects' ? 'page' : undefined} href="/projects">
          公开项目
        </Link>
        <Link aria-current={current === 'applications' ? 'page' : undefined} href="/applications/new">
          求助申请
        </Link>
        <Link aria-current={current === 'intentions' ? 'page' : undefined} href="/intentions/new">
          帮助意向
        </Link>
      </div>
      <div className="sidebar-note">
        公众侧仅登记求助申请与帮助意向。所有审核、拨付与反馈发布由机构完成。
      </div>
    </nav>
  )
}
