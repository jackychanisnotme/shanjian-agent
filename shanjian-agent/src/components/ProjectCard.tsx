import { ArrowRight, HeartHandshake } from 'lucide-react';
import type { PublicProject } from '../domain/types';

interface ProjectCardProps {
  project: PublicProject;
  active: boolean;
  onSelect: (projectId: string) => void;
  onHelp: (projectId: string) => void;
}

export function ProjectCard({ active, onHelp, onSelect, project }: ProjectCardProps) {
  return (
    <article className={`project-card${active ? ' is-active' : ''}`}>
      <div className="card-header">
        <div>
          <p className="eyebrow">{project.region} · {statusLabel(project.status)}</p>
          <h2>{project.patientAlias}</h2>
        </div>
        <span className="status-pill">{project.disease}</span>
      </div>
      <p>{project.verifiedNeed}</p>
      <dl className="compact-stats">
        <div>
          <dt>资源缺口</dt>
          <dd>{project.resourceGap > 0 ? `${project.resourceGap.toLocaleString('zh-CN')}元` : '阶段完成'}</dd>
        </div>
        <div>
          <dt>已登记意向</dt>
          <dd>{project.matchedIntentions}条</dd>
        </div>
      </dl>
      <p className="latest-progress">最新进展：{project.progress[0]}</p>
      <div className="button-row">
        <button className="secondary-button" type="button" onClick={() => onSelect(project.id)}>
          <ArrowRight aria-hidden="true" size={16} />
          查看详情
        </button>
        <button className="primary-button" type="button" onClick={() => onHelp(project.id)}>
          <HeartHandshake aria-hidden="true" size={16} />
          我要帮助
        </button>
      </div>
    </article>
  );
}

function statusLabel(status: PublicProject['status']) {
  const labels: Record<PublicProject['status'], string> = {
    urgent: '紧急',
    in_treatment: '治疗中',
    awaiting_materials: '待补材料',
    receiving_intentions: '登记意向中',
    completed: '阶段完成',
  };
  return labels[status];
}
