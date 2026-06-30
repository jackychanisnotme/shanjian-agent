import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { answerProjectQuestion } from '../domain/agents';
import type { ProjectAnswer, PublicProject } from '../domain/types';

interface ProjectQuestionPanelProps {
  project: PublicProject;
}

const questions = [
  { label: '问当前最缺什么', prompt: '这个项目目前最需要什么？' },
  { label: '问为什么不能付款', prompt: '为什么不能直接付款？' },
  { label: '问资源是否适合', prompt: '我能提供的资源适合吗？' },
];

export function ProjectQuestionPanel({ project }: ProjectQuestionPanelProps) {
  const [answer, setAnswer] = useState<ProjectAnswer>(() => answerProjectQuestion(project, questions[0].prompt));

  return (
    <section className="question-panel" aria-labelledby="question-title">
      <div className="ai-panel-heading">
        <div>
          <p className="section-kicker">提示词库</p>
          <h2 id="question-title">AI问项目</h2>
        </div>
        <ShieldCheck aria-hidden="true" size={24} />
      </div>
      <p className="muted">AI 只基于脱敏事实、项目需要和合规边界回答。它解释项目，不劝捐，不替代机构判断。</p>
      <div className="question-buttons">
        {questions.map((question) => (
          <button key={question.prompt} type="button" onClick={() => setAnswer(answerProjectQuestion(project, question.prompt))}>
            {question.label}
          </button>
        ))}
      </div>
      <div className="answer-box">
        <span>当前提示词</span>
        <strong>{answer.question}</strong>
        <p>{answer.answer}</p>
        <div className="evidence-chips" aria-label="证据来源">
          <span>证据来源</span>
          {answer.sourceLabels.map((source) => (
            <em key={source}>{source}</em>
          ))}
        </div>
      </div>
    </section>
  );
}
