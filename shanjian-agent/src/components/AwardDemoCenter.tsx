import { BadgeCheck, Bot, BrainCircuit, Building2, Clock3, FileScan, Rocket, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { buildLocalLlmConfig, runAwardDemoAgent } from '../domain/localLlmAgent';
import type { AidApplication, PublicProject } from '../domain/types';

interface AwardDemoCenterProps {
  application: AidApplication;
  projects: PublicProject[];
}

const demoSteps = [
  {
    title: '混乱求助材料',
    text: '家属文字、费用数字、材料备注和隐私线索混在一起。',
    icon: FileScan,
  },
  {
    title: '证据链与四辨',
    text: '抽取缺失票据、报销状态、金额矛盾和人工核查清单。',
    icon: BrainCircuit,
  },
  {
    title: '脱敏公示',
    text: '生成公开项目页，只保留事实、需要、进展和机构复核边界。',
    icon: BadgeCheck,
  },
  {
    title: '钱物服匹配',
    text: '把资金、物资、服务意向匹配到受助人真实需要。',
    icon: Rocket,
  },
];

const proofPoints = [
  { value: '70分钟', label: '单个个案材料整理节省', note: '从访谈整理、缺项检查到公开草稿' },
  { value: '6类', label: '评分抓手全覆盖', note: 'Demo、价值、技术、创新、商业、表达' },
  { value: '4岗', label: '直接受益岗位', note: '一线救助、项目执行、筹款、宣传' },
];

const materialSignals = [
  {
    label: 'OCR抽取',
    value: '诊断摘要、费用清单、医保预估、监护关系',
    note: '把照片和扫描件转成机构可复核字段。',
  },
  {
    label: '金额矛盾',
    value: '总费用、已支付、报销预估、费用缺口',
    note: '自动提示需要票据复核的数字链路。',
  },
  {
    label: '隐私脱敏',
    value: '学校、病房楼层、电话、详细地址',
    note: '公开前移除可识别信息，降低二次伤害。',
  },
];

const scoringHooks = [
  '现场可用：一键跑完混乱材料到反馈草稿的完整闭环。',
  '技术实现：本地 LLM Agent 接入，失败时保留离线可演示兜底。',
  '创新性：不做平台收款，把合规帮助意向拆成钱、物、服。',
  '商业潜力：从大病救助切入，再复制到助学、助老、救灾。',
];

export function AwardDemoCenter({ application, projects }: AwardDemoCenterProps) {
  const localLlmConfig = buildLocalLlmConfig();
  const [judgeQuestion, setJudgeQuestion] = useState('5分钟内如何证明这个项目值得获奖？');
  const [agentOutput, setAgentOutput] = useState('');
  const [agentSource, setAgentSource] = useState<'local-llm' | 'fallback' | null>(null);
  const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle');

  async function runAgent() {
    setStatus('running');
    const result = await runAwardDemoAgent({
      application,
      judgeQuestion,
      projects,
    });
    setAgentOutput(result.content);
    setAgentSource(result.source);
    setStatus('done');
  }

  return (
    <section className="award-center" aria-labelledby="award-demo-title">
      <div className="award-hero">
        <div>
          <p className="section-kicker">Demo Day 冲奖版</p>
          <h2 id="award-demo-title">获奖 Demo 中心</h2>
          <p>
            把评委最关心的六个维度压进一个现场流程：可用、价值、技术、创新、商业、表达。
          </p>
        </div>
        <div className="agent-console" aria-label="本地LLM Agent 控制台">
          <div className="section-title-row">
            <Bot aria-hidden="true" size={19} />
            <h3>本地LLM Agent</h3>
          </div>
          <p className="endpoint-line">本地端点：{localLlmConfig.chatCompletionsUrl}</p>
          <label>
            评委追问
            <textarea
              onChange={(event) => setJudgeQuestion(event.target.value)}
              rows={3}
              value={judgeQuestion}
            />
          </label>
          <button className="primary-button" disabled={status === 'running'} onClick={runAgent} type="button">
            <Sparkles aria-hidden="true" size={17} />
            {status === 'running' ? 'Agent 运行中' : '运行本地LLM Agent'}
          </button>
          {agentOutput && (
            <div className="agent-output" aria-live="polite">
              <span>{agentSource === 'local-llm' ? '来源：本地LLM' : '来源：离线兜底'}</span>
              <pre>{agentOutput}</pre>
            </div>
          )}
        </div>
      </div>

      <div className="demo-step-grid" aria-label="5分钟演示链路">
        {demoSteps.map((step) => {
          const Icon = step.icon;
          return (
            <article key={step.title}>
              <Icon aria-hidden="true" size={21} />
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          );
        })}
      </div>

      <section className="material-lab" aria-labelledby="material-lab-title">
        <div>
          <div className="section-title-row">
            <FileScan aria-hidden="true" size={19} />
            <h3 id="material-lab-title">材料智能处理台</h3>
          </div>
          <p>把评委能理解的 AI 技术点前置展示：OCR、结构化抽取、矛盾发现、隐私脱敏。</p>
        </div>
        <div className="material-signal-grid">
          {materialSignals.map((signal) => (
            <article key={signal.label}>
              <span>{signal.label}</span>
              <strong>{signal.value}</strong>
              <p>{signal.note}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="proof-grid" aria-label="用户价值与商业证明">
        {proofPoints.map((point) => (
          <article key={point.label}>
            <strong>{point.value}</strong>
            <h3>{point.label}</h3>
            <p>{point.note}</p>
          </article>
        ))}
        <article className="business-card">
          <Building2 aria-hidden="true" size={22} />
          <h3>商业落地</h3>
          <p>机构年费 + 项目包 + 私有化部署，优先服务中小慈善机构、基金会和医院社工部。</p>
        </article>
        <article>
          <Rocket aria-hidden="true" size={22} />
          <h3>加分项</h3>
          <p>按比赛规则准备 ClawHunt 上架材料和游园展示话术，争取额外曝光。</p>
        </article>
      </div>

      <section className="scoring-hooks" aria-labelledby="scoring-hooks-title">
        <div className="section-title-row">
          <Clock3 aria-hidden="true" size={19} />
          <h3 id="scoring-hooks-title">评分抓手</h3>
        </div>
        <ul>
          {scoringHooks.map((hook) => (
            <li key={hook}>{hook}</li>
          ))}
        </ul>
      </section>
    </section>
  );
}
