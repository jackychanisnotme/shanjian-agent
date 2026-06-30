import { CheckCircle2, ClipboardList, HeartHandshake } from 'lucide-react';
import type { PublicProject } from '../domain/types';
import { FeedbackPreview } from './FeedbackPreview';

interface ProjectDetailProps {
  project: PublicProject;
  onHelp: (projectId: string) => void;
}

export function ProjectDetail({ onHelp, project }: ProjectDetailProps) {
  return (
    <section className="detail-layout" aria-labelledby="detail-title">
      <div className="detail-main">
        <p className="section-kicker">脱敏项目档案</p>
        <h2 id="detail-title">{project.patientAlias} · {project.disease}</h2>
        <p>{project.story}</p>
        <div className="detail-stat-row">
          <div>
            <span>资源缺口</span>
            <strong>{project.resourceGap > 0 ? `${project.resourceGap.toLocaleString('zh-CN')}元` : '阶段完成'}</strong>
          </div>
          <div>
            <span>帮助意向</span>
            <strong>{project.matchedIntentions}条</strong>
          </div>
        </div>
        <section className="detail-block">
          <div className="section-title-row">
            <ClipboardList aria-hidden="true" size={18} />
            <h3>当前真实需要</h3>
          </div>
          <ul className="need-list">
            {project.needs.map((need) => (
              <li key={need.id}>
                <strong>{need.label}</strong>
                <span>{need.description}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="detail-block">
          <div className="section-title-row">
            <CheckCircle2 aria-hidden="true" size={18} />
            <h3>救助进展</h3>
          </div>
          <ol className="timeline">
            {project.progress.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>
        <section className="detail-block">
          <div className="section-title-row">
            <ClipboardList aria-hidden="true" size={18} />
            <h3>项目证据</h3>
          </div>
          <ul className="plain-list">
            {project.evidenceSummary.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <button className="primary-button wide-action" type="button" onClick={() => onHelp(project.id)}>
          <HeartHandshake aria-hidden="true" size={17} />
          我要帮助
        </button>
      </div>
      <FeedbackPreview project={project} />
    </section>
  );
}
