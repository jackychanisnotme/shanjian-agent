import type { ReactNode } from 'react'

import { formatCurrency } from '../../domain/charity'
import { asEvidenceItems, asResourceNeeds, asStringArray } from '../../server/publicProjects'

type ReadableSummaryProps = {
  data?: Record<string, unknown>
}

const priorityLabels: Record<string, string> = {
  high: '高优先级',
  medium: '中优先级',
  low: '低优先级',
}

const evidenceStatusLabels: Record<string, string> = {
  received: '已收到',
  missing: '缺失',
  conflicting: '存在冲突',
  needs_manual_check: '待人工核验',
}

const urgencyLabels: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低',
}

const severityLabels: Record<string, string> = {
  high: '高风险',
  medium: '中风险',
  low: '低风险',
}

export function AidApplicationReadableSummary({ data = {} }: ReadableSummaryProps) {
  const needs = asResourceNeeds(data.requestedNeeds)
  const materialNotes = asStringArray(data.materialNotes)
  const evidenceItems = asEvidenceItems(data.evidence)
  const remainingGap = typeof data.remainingGap === 'number' ? data.remainingGap : null

  return (
    <section className="shanjian-readable-panel" aria-label="结构化求助摘要">
      <header className="shanjian-readable-panel__header">
        <div>
          <p>机构可读视图</p>
          <h3>结构化求助摘要</h3>
        </div>
        {remainingGap !== null && <strong>费用缺口：{formatCurrency(remainingGap)}</strong>}
      </header>

      <div className="shanjian-readable-grid">
        <ReadableCard title="受助人真实需要">
          {needs.length > 0 ? (
            <ul className="shanjian-readable-list">
              {needs.map((need) => (
                <li key={need.id}>
                  <div>
                    <strong>{need.label}</strong>
                    <span>{need.description}</span>
                  </div>
                  <Badge>{priorityLabels[need.priority] ?? need.priority}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyText>暂无真实需要。</EmptyText>
          )}
        </ReadableCard>

        <ReadableCard title="材料说明">
          {materialNotes.length > 0 ? (
            <ul className="shanjian-readable-plain-list">
              {materialNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          ) : (
            <EmptyText>暂无材料说明。</EmptyText>
          )}
        </ReadableCard>

        <ReadableCard title="证据材料">
          {evidenceItems.length > 0 ? (
            <ul className="shanjian-readable-list">
              {evidenceItems.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.label}</strong>
                    <span>{item.note}</span>
                  </div>
                  <Badge>{evidenceStatusLabels[item.status] ?? item.status}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyText>暂无证据材料。</EmptyText>
          )}
        </ReadableCard>
      </div>
    </section>
  )
}

export function CaseReviewReadableSummary({ data = {} }: ReadableSummaryProps) {
  const goodAndHarm = asRiskSignals(data.goodAndHarm)
  const truth = asRiskSignals(data.truth)
  const proximity = asStringArray(data.proximity)
  const humanChecklist = asStringArray(data.humanChecklist)
  const urgency = typeof data.scaleUrgency === 'string' ? data.scaleUrgency : null
  const resourceGap = typeof data.resourceGap === 'number' ? data.resourceGap : null
  const scaleRationale = typeof data.scaleRationale === 'string' ? data.scaleRationale : ''
  const hasReviewContent =
    goodAndHarm.length > 0 ||
    truth.length > 0 ||
    proximity.length > 0 ||
    humanChecklist.length > 0 ||
    scaleRationale.trim().length > 0 ||
    (urgency !== null && urgency !== 'low') ||
    (resourceGap !== null && resourceGap > 0)

  if (!hasReviewContent) {
    return (
      <section className="shanjian-readable-panel" aria-label="四辨审核摘要">
        <header className="shanjian-readable-panel__header">
          <div>
            <p>Agent / 规则建议</p>
            <h3>四辨审核摘要</h3>
          </div>
        </header>

        <section className="shanjian-readable-card">
          <h4>暂无四辨建议</h4>
          <EmptyText>请先在本页选择 Agent 并生成建议，或由机构人员手动填写。</EmptyText>
        </section>
      </section>
    )
  }

  return (
    <section className="shanjian-readable-panel" aria-label="四辨审核摘要">
      <header className="shanjian-readable-panel__header">
        <div>
          <p>Agent / 规则建议</p>
          <h3>四辨审核摘要</h3>
        </div>
        <div className="shanjian-readable-meta">
          {urgency && <Badge>紧急程度：{urgencyLabels[urgency] ?? urgency}</Badge>}
          {resourceGap !== null && <strong>{formatCurrency(resourceGap)}</strong>}
        </div>
      </header>

      {scaleRationale && <p className="shanjian-readable-rationale">{scaleRationale}</p>}

      <div className="shanjian-readable-grid">
        <RiskSection title="辨善恶" items={goodAndHarm} />
        <RiskSection title="辨真伪" items={truth} />
        <ReadableCard title="辨远近">
          {proximity.length > 0 ? (
            <ol className="shanjian-readable-plain-list">
              {proximity.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          ) : (
            <EmptyText>暂无远近建议。</EmptyText>
          )}
        </ReadableCard>
        <ReadableCard title="人工复核清单">
          {humanChecklist.length > 0 ? (
            <ol className="shanjian-readable-plain-list">
              {humanChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          ) : (
            <EmptyText>暂无复核清单。</EmptyText>
          )}
        </ReadableCard>
      </div>
    </section>
  )
}

function RiskSection({ items, title }: { items: RiskSignalView[]; title: string }) {
  return (
    <ReadableCard title={title}>
      {items.length > 0 ? (
        <ul className="shanjian-readable-list">
          {items.map((item) => (
            <li key={item.id}>
              <div>
                <strong>{item.label}</strong>
                <span>{item.evidence}</span>
              </div>
              <Badge>{severityLabels[item.severity] ?? item.severity}</Badge>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyText>暂无风险提示。</EmptyText>
      )}
    </ReadableCard>
  )
}

function ReadableCard({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="shanjian-readable-card">
      <h4>{title}</h4>
      {children}
    </section>
  )
}

function Badge({ children }: { children: ReactNode }) {
  return <span className="shanjian-readable-badge">{children}</span>
}

function EmptyText({ children }: { children: ReactNode }) {
  return <p className="shanjian-readable-empty">{children}</p>
}

type RiskSignalView = {
  id: string
  label: string
  evidence: string
  severity: string
}

function asRiskSignals(value: unknown): RiskSignalView[] {
  if (!Array.isArray(value)) return []

  return value.filter((item): item is RiskSignalView => {
    return (
      typeof item === 'object' &&
      item !== null &&
      'id' in item &&
      'label' in item &&
      'evidence' in item &&
      'severity' in item
    )
  })
}
