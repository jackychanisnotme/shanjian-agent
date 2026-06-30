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
        <p className="eyebrow">项目详情 · 脱敏展示</p>
        <h2 id="detail-title">{project.patientAlias} · {project.disease}</h2>
        <p>{project.story}</p>
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
        <div className="section-title-row">
          <CheckCircle2 aria-hidden="true" size={18} />
          <h3>救助进展</h3>
        </div>
        <ol className="timeline">
          {project.progress.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
        <div className="section-title-row">
          <ClipboardList aria-hidden="true" size={18} />
          <h3>证据摘要</h3>
        </div>
        <ul className="plain-list">
          {project.evidenceSummary.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <button className="primary-button wide-action" type="button" onClick={() => onHelp(project.id)}>
          <HeartHandshake aria-hidden="true" size={17} />
          我要帮助
        </button>
      </div>
      <FeedbackPreview project={project} />
    </section>
  );
}
