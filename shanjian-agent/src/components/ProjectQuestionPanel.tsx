import { MessageCircleQuestion } from 'lucide-react';
import { useState } from 'react';
import { answerProjectQuestion } from '../domain/agents';
import type { ProjectAnswer, PublicProject } from '../domain/types';

interface ProjectQuestionPanelProps {
  project: PublicProject;
}

const questions = ['这个项目目前最需要什么？', '为什么不能直接付款？', '我能提供的资源适合吗？'];

export function ProjectQuestionPanel({ project }: ProjectQuestionPanelProps) {
  const [answer, setAnswer] = useState<ProjectAnswer>(() => answerProjectQuestion(project, questions[0]));

  return (
    <section className="question-panel" aria-labelledby="question-title">
      <div className="section-title-row">
        <MessageCircleQuestion aria-hidden="true" size={20} />
        <h2 id="question-title">AI问项目</h2>
      </div>
      <p className="muted">只基于脱敏项目事实、当前需求和合规边界回答，不替代机构判断。</p>
      <div className="question-buttons">
        {questions.map((question) => (
          <button key={question} type="button" onClick={() => setAnswer(answerProjectQuestion(project, question))}>
            {question}
          </button>
        ))}
      </div>
      <div className="answer-box">
        <strong>{answer.question}</strong>
        <p>{answer.answer}</p>
        <p className="source-line">依据：{answer.sourceLabels.join('、')}</p>
      </div>
    </section>
  );
}
