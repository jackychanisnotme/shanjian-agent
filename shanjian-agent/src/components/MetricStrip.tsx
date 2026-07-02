import { FileText, HandHeart, MessageSquareText } from 'lucide-react';

const metrics = [
  { label: '展示项目', value: '3个', icon: FileText },
  { label: '捐助意向', value: '18条', icon: HandHeart },
  { label: '反馈草稿', value: '7份', icon: MessageSquareText },
];

export function MetricStrip() {
  return (
    <section className="metric-strip" aria-label="运营概览">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div className="metric-item" key={metric.label}>
            <Icon aria-hidden="true" size={19} />
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        );
      })}
    </section>
  );
}
