import { FileCheck2 } from 'lucide-react';
import { generateFeedbackDraft } from '../domain/agents';
import type { PublicProject } from '../domain/types';

interface FeedbackPreviewProps {
  project: PublicProject;
}

export function FeedbackPreview({ project }: FeedbackPreviewProps) {
  return (
    <section className="feedback-panel" aria-labelledby="feedback-title">
      <div className="section-title-row">
        <FileCheck2 aria-hidden="true" size={19} />
        <h2 id="feedback-title">透明反馈草稿</h2>
      </div>
      <pre>{generateFeedbackDraft(project)}</pre>
      <p className="review-note">需机构工作人员复核后发布。</p>
    </section>
  );
}
