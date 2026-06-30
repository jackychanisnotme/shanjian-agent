import { AlertTriangle, Gauge, Network, SearchCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { runFourDiscernment } from '../domain/agents';
import type { AidApplication, FourDiscernmentReport, ReviewDecision } from '../domain/types';

interface FourDiscernmentWorkbenchProps {
  application: AidApplication;
  onDecision?: (decision: ReviewDecision) => void;
}

const panelMeta = [
  { key: 'goodAndHarm', title: '辨善恶', icon: AlertTriangle, note: '欺诈风险、隐私伤害、二次伤害和过度叙事风险。' },
  { key: 'truth', title: '辨真伪', icon: SearchCheck, note: '票据、诊断、时间线、报销状态和证明链。' },
  { key: 'scale', title: '辨大小', icon: Gauge, note: '紧急程度、资源缺口和救助边际改善。' },
  { key: 'proximity', title: '辨远近', icon: Network, note: '属地机构、医院社工、志愿者和帮助意向匹配距离。' },
] as const;

const decisionLabels: Array<{ decision: ReviewDecision; label: string }> = [
  { decision: 'request_materials', label: '要求补充材料' },
  { decision: 'reject', label: '拒绝' },
  { decision: 'approve_display', label: '批准展示' },
  { decision: 'offline_follow_up', label: '线下跟进' },
];

export function FourDiscernmentWorkbench({ application, onDecision }: FourDiscernmentWorkbenchProps) {
  const [report, setReport] = useState<FourDiscernmentReport | null>(null);
  const [decision, setDecision] = useState<ReviewDecision | null>(null);

  function chooseDecision(nextDecision: ReviewDecision) {
    setDecision(nextDecision);
    onDecision?.(nextDecision);
  }

  return (
    <section className="view-panel module-page" aria-labelledby="workbench-title">
      <div className="module-heading">
        <p className="eyebrow">机构人工复核工作台</p>
        <h1 id="workbench-title">机构四辨工作台</h1>
        <p>AI 仅生成证据结构、风险提示、优先级和复核清单。最终判断由机构工作人员完成。</p>
      </div>

      <section className="case-summary" aria-label="待审案例摘要">
        <div>
          <p className="eyebrow">{application.patientAlias} · {application.hospitalRegion}</p>
          <h2>{application.disease}</h2>
          <p>{application.treatmentStage}</p>
        </div>
        <dl className="compact-stats">
          <div>
            <dt>费用缺口</dt>
            <dd>{application.remainingGap.toLocaleString('zh-CN')}元</dd>
          </div>
          <div>
            <dt>材料状态</dt>
            <dd>需补充</dd>
          </div>
        </dl>
      </section>

      <section className="evidence-map" aria-label="证据地图">
        <h2>证据地图</h2>
        <div className="evidence-list">
          {application.evidence.map((item) => (
            <div className={`evidence-item status-${item.status}`} key={item.id}>
              <strong>{item.label}</strong>
              <span>{item.note}</span>
            </div>
          ))}
        </div>
      </section>

      <button className="primary-button form-submit" type="button" onClick={() => setReport(runFourDiscernment(application))}>
        <Sparkles aria-hidden="true" size={17} />
        运行四辨审核
      </button>

      <section className="discernment-grid" aria-label="四辨输出">
        {panelMeta.map((panel) => {
          const Icon = panel.icon;
          return (
            <article className="discernment-panel" key={panel.key}>
              <div className="section-title-row">
                <Icon aria-hidden="true" size={19} />
                <h2>{panel.title}</h2>
              </div>
              <p className="muted">{panel.note}</p>
              {renderPanelBody(panel.key, report)}
            </article>
          );
        })}
      </section>

      {report && (
        <section className="result-panel" aria-label="人工复核清单">
          <div className="section-title-row">
            <ShieldCheck aria-hidden="true" size={19} />
            <h2>人工复核 checklist</h2>
          </div>
          <ul className="plain-list">
            {report.humanChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="decision-row" aria-label="人工决策按钮">
            {decisionLabels.map((item) => (
              <button className="secondary-button" key={item.decision} type="button" onClick={() => chooseDecision(item.decision)}>
                {item.label}
              </button>
            ))}
          </div>
          {decision === 'approve_display' && <p className="review-note">已生成脱敏项目卡片，仍需机构工作人员最终确认后公开。</p>}
        </section>
      )}
    </section>
  );
}

function renderPanelBody(key: (typeof panelMeta)[number]['key'], report: FourDiscernmentReport | null) {
  if (!report) return <p className="pending-copy">点击“运行四辨审核”生成建议。</p>;

  if (key === 'goodAndHarm') {
    return <RiskList items={report.goodAndHarm.map((risk) => `${risk.label}：${risk.evidence}`)} />;
  }

  if (key === 'truth') {
    return <RiskList items={report.truth.map((risk) => `${risk.label}：${risk.evidence}`)} />;
  }

  if (key === 'scale') {
    return (
      <p>
        紧急程度：{report.scale.urgency}；资源缺口：{report.scale.resourceGap.toLocaleString('zh-CN')}元。{report.scale.rationale}
      </p>
    );
  }

  return <RiskList items={report.proximity} />;
}

function RiskList({ items }: { items: string[] }) {
  return (
    <ul className="plain-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
