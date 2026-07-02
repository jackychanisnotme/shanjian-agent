import Link from 'next/link'

import { buttonClassName } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { formatCurrency, type PublicProject } from '../../domain/charity'

interface ProjectDetailViewProps {
  project: PublicProject
}

export function ProjectDetailView({ project }: ProjectDetailViewProps) {
  return (
    <article className="detail-shell" aria-labelledby="project-detail-title">
      <Link className="back-link" href="/projects">
        返回项目列表
      </Link>
      <div className="detail-heading">
        <div>
          <p className="section-label">{project.region} · 脱敏项目</p>
          <h1 id="project-detail-title">{project.patientAlias}</h1>
          <p>{project.diseaseLabel}</p>
        </div>
        <Badge>{project.status}</Badge>
      </div>
      <section className="detail-band">
        <div>
          <span>核验需求</span>
          <strong>{project.verifiedNeed}</strong>
        </div>
        <div>
          <span>资源缺口</span>
          <strong>{formatCurrency(project.resourceGap)}</strong>
        </div>
        <div>
          <span>帮助意向</span>
          <strong>{project.matchedIntentions} 条</strong>
        </div>
      </section>
      <section className="detail-section">
        <h2>项目事实</h2>
        <p>{project.story}</p>
      </section>
      <section className="detail-columns">
        <div>
          <h2>证据摘要</h2>
          <ul>
            {project.evidenceSummary.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>当前真实需要</h2>
          <ul>
            {project.needs.map((need) => (
              <li key={need.id}>
                <strong>{need.label}</strong>
                <span>{need.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="detail-section">
        <h2>救助进展</h2>
        <ol className="timeline">
          {project.progress.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>
      <Link className={buttonClassName('primary')} href={`/intentions/new?project=${project.slug}`}>
        登记帮助意向
      </Link>
    </article>
  )
}
