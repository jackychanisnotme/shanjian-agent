# Shanjian Agent MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, demo-ready web MVP for 善见 Agent: a serious-illness aid project system that turns aid applications, institutional review, public questions, money/material/service help intentions and feedback into a verifiable “善意精准抵达” workflow.

**Architecture:** Create a standalone Vite + React + TypeScript app under `shanjian-agent/`. Keep it frontend-only for the hackathon demo: React state and local deterministic “agent” functions simulate AI workflows, with clean interfaces so real LLM APIs can be swapped in later. The app uses in-memory demo data plus `localStorage` persistence so the full demo loop works without a backend.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, CSS modules or plain CSS, lucide-react icons, optional Playwright for visual verification.

---

## Context And Constraints

Read these files before implementing:

- `docs/superpowers/specs/2026-06-30-shanjian-agent-mvp-design.md`
- `ai-charity-hackathon-pack.md`
- `charity-operations-research.md`

Build a new standalone app inside the current hackathon workspace:

```text
/Users/pc/Documents/shanjian-7.3/shanjian-agent
```

Hard product boundaries:

- No real payment.
- No platform-side money custody.
- No self-operated public fundraising.
- No real patient data upload in the demo.
- No AI-only approval.
- No medical diagnosis or treatment advice.
- Donation/help is “捐助意向登记”, followed up by qualified institution staff.

## Target File Structure

```text
shanjian-agent/
  package.json
  index.html
  vite.config.ts
  tsconfig.json
  src/
    main.tsx
    App.tsx
    app/
      navigation.ts
      storage.ts
      demoStore.ts
    domain/
      types.ts
      demoData.ts
      agents.ts
      agents.test.ts
    components/
      AppShell.tsx
      ComplianceNotice.tsx
      MetricStrip.tsx
      ProjectCard.tsx
      ProjectDetail.tsx
      ProjectQuestionPanel.tsx
      AidApplicationEntry.tsx
      FourDiscernmentWorkbench.tsx
      DonationIntentionManagement.tsx
      FeedbackPreview.tsx
    styles/
      global.css
  tests/
    app-flow.test.tsx
```

File responsibilities:

- `domain/types.ts`: shared domain models only.
- `domain/demoData.ts`: fictional acute leukemia aid case and seeded public projects.
- `domain/agents.ts`: deterministic AI-like functions for intake, four-discernment, privacy redaction, public project generation, AI问项目, money/material/service donation-intention classification, real-need matching and feedback drafting.
- `app/demoStore.ts`: state transitions for demo flow.
- `components/*`: focused UI components, each with one visible responsibility.
- `styles/global.css`: restrained healthcare/public-service UI; no one-note purple/blue-gradient theme, no decorative orb backgrounds.

## Task 1: Scaffold The Standalone Web App

**Files:**

- Create: `shanjian-agent/package.json`
- Create: `shanjian-agent/index.html`
- Create: `shanjian-agent/vite.config.ts`
- Create: `shanjian-agent/tsconfig.json`
- Create: `shanjian-agent/src/main.tsx`
- Create: `shanjian-agent/src/App.tsx`
- Create: `shanjian-agent/src/styles/global.css`

- [x] **Step 1: Create Vite React TypeScript app**

Run:

```bash
cd /Users/pc/Documents/shanjian-7.3
npm create vite@latest shanjian-agent -- --template react-ts
cd shanjian-agent
npm install
npm install lucide-react
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Expected: `shanjian-agent/package.json` exists and dependencies install without errors.

- [x] **Step 2: Configure tests**

Modify `shanjian-agent/vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
```

Create `shanjian-agent/src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

Modify `shanjian-agent/package.json` scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [x] **Step 3: Replace starter app with a smoke shell**

Create `src/App.tsx`:

```tsx
import './styles/global.css';

export default function App() {
  return (
    <main className="app-root">
      <h1>善见 Agent</h1>
      <p>大病救助项目系统 MVP</p>
    </main>
  );
}
```

Create `src/styles/global.css`:

```css
:root {
  color: #202426;
  background: #f6f4ef;
  font-family: Inter, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

button,
input,
select,
textarea {
  font: inherit;
}

.app-root {
  min-height: 100vh;
  padding: 32px;
}
```

- [x] **Step 4: Verify scaffold**

Run:

```bash
npm test
npm run build
```

Expected: both commands exit 0.

- [x] **Step 5: Commit scaffold**

```bash
git add shanjian-agent
git commit -m "feat: scaffold Shanjian Agent app"
```

## Task 2: Define Domain Models And Demo Data

**Files:**

- Create: `shanjian-agent/src/domain/types.ts`
- Create: `shanjian-agent/src/domain/demoData.ts`
- Create: `shanjian-agent/src/domain/agents.test.ts`

- [x] **Step 1: Write tests for seeded demo data**

Create `src/domain/agents.test.ts`:

```ts
import { demoAidApplication, seedPublicProjects } from './demoData';

describe('demo data', () => {
  it('uses fictional de-identified serious-illness data', () => {
    expect(demoAidApplication.patientAlias).toBe('患儿A');
    expect(demoAidApplication.disease).toContain('急性淋巴细胞白血病');
    expect(demoAidApplication.rawNarrative).not.toMatch(/\d{11}/);
    expect(demoAidApplication.rawNarrative).not.toContain('身份证');
  });

  it('seeds public projects for the home page', () => {
    expect(seedPublicProjects).toHaveLength(3);
    expect(seedPublicProjects[0].status).toBe('receiving_intentions');
  });
});
```

- [x] **Step 2: Run test and verify it fails**

Run:

```bash
npm test -- src/domain/agents.test.ts
```

Expected: FAIL because `demoData` does not exist.

- [x] **Step 3: Implement domain types**

Create `src/domain/types.ts`:

```ts
export type AidStatus =
  | 'draft'
  | 'needs_materials'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'published';

export type ProjectStatus =
  | 'urgent'
  | 'in_treatment'
  | 'awaiting_materials'
  | 'receiving_intentions'
  | 'completed';

export type HelpType =
  | 'funding_intention'
  | 'medical_resource'
  | 'drug_resource'
  | 'nutrition'
  | 'accommodation'
  | 'transportation'
  | 'volunteer'
  | 'policy_consultation'
  | 'psychological_support'
  | 'propagation'
  | 'corporate_support';

export type HelpCategory = 'money' | 'materials' | 'services';

export type NeedType =
  | 'treatment_cost'
  | 'medicine'
  | 'nutrition'
  | 'accommodation'
  | 'transportation'
  | 'escort'
  | 'policy_consultation'
  | 'psychological_support'
  | 'propagation';

export interface ResourceNeed {
  id: string;
  type: NeedType;
  label: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

export interface AidApplication {
  id: string;
  patientAlias: string;
  applicantRole: 'family' | 'patient' | 'volunteer' | 'institution_staff';
  disease: string;
  treatmentStage: string;
  hospitalRegion: string;
  expenseTotal: number;
  paidAmount: number;
  reimbursementEstimate: number;
  remainingGap: number;
  familyBurden: string;
  requestedNeeds: ResourceNeed[];
  materialNotes: string[];
  rawNarrative: string;
  consentForInstitutionReview: boolean;
  consentForDeidentifiedDisplay: boolean;
  status: AidStatus;
}

export interface MissingMaterial {
  id: string;
  label: string;
  reason: string;
  severity: 'low' | 'medium' | 'high';
}

export interface RiskSignal {
  id: string;
  category: 'fraud' | 'privacy' | 'amount_conflict' | 'timeline' | 'overstatement' | 'medical_boundary';
  label: string;
  evidence: string;
  severity: 'low' | 'medium' | 'high';
}

export interface FourDiscernmentReport {
  goodAndHarm: RiskSignal[];
  truth: RiskSignal[];
  scale: {
    urgency: 'low' | 'medium' | 'high';
    resourceGap: number;
    rationale: string;
  };
  proximity: string[];
  humanChecklist: string[];
}

export interface PublicProject {
  id: string;
  patientAlias: string;
  disease: string;
  status: ProjectStatus;
  region: string;
  verifiedNeed: string;
  resourceGap: number;
  matchedIntentions: number;
  needs: ResourceNeed[];
  progress: string[];
  story: string;
}

export interface DonationIntention {
  id: string;
  projectId: string;
  helpCategory: HelpCategory;
  helpType: HelpType;
  amountOrResource: string;
  city: string;
  contact: string;
  receiptNeed: boolean;
  message: string;
  status: 'new' | 'matched' | 'contacted' | 'closed';
}

export interface ProjectQuestion {
  id: string;
  question: string;
}

export interface ProjectAnswer {
  question: string;
  answer: string;
  sourceLabels: string[];
}
```

- [x] **Step 4: Implement demo data**

Create `src/domain/demoData.ts`:

```ts
import type { AidApplication, PublicProject } from './types';

export const demoAidApplication: AidApplication = {
  id: 'case-leukemia-child-a',
  patientAlias: '患儿A',
  applicantRole: 'family',
  disease: '儿童急性淋巴细胞白血病',
  treatmentStage: '诱导治疗后进入巩固治疗准备期',
  hospitalRegion: '华南地区某三甲医院',
  expenseTotal: 318000,
  paidAmount: 126000,
  reimbursementEstimate: 92000,
  remainingGap: 100000,
  familyBurden: '家庭主要收入来自父亲零工，母亲陪护停工，已有亲友借款。',
  requestedNeeds: [
    {
      id: 'need-treatment-cost',
      type: 'treatment_cost',
      label: '治疗费用缺口',
      description: '巩固治疗阶段仍有约10万元费用缺口，需要机构核验后对接资金支持意向。',
      priority: 'high',
    },
    {
      id: 'need-transportation',
      type: 'transportation',
      label: '复诊交通协助',
      description: '家庭异地就医，后续复诊需要交通和陪同安排。',
      priority: 'medium',
    },
    {
      id: 'need-policy-consultation',
      type: 'policy_consultation',
      label: '医保/救助政策咨询',
      description: '报销状态不清，需要志愿者或机构工作人员协助梳理政策路径。',
      priority: 'high',
    },
  ],
  materialNotes: [
    '模拟诊断摘要已提供',
    '住院费用清单已提供',
    '医保报销预估说明不完整',
    '最新发票缺失',
    '监护关系证明未上传',
  ],
  rawNarrative:
    '患儿A正在接受白血病治疗，家庭已承担前期费用。叙事草稿中曾出现学校、病房楼层等可识别信息，需脱敏后才能展示。',
  consentForInstitutionReview: true,
  consentForDeidentifiedDisplay: true,
  status: 'under_review',
};

export const seedPublicProjects: PublicProject[] = [
  {
    id: 'project-child-a',
    patientAlias: '患儿A',
    disease: '急性淋巴细胞白血病',
    status: 'receiving_intentions',
    region: '华南',
    verifiedNeed: '巩固治疗阶段费用缺口',
    resourceGap: 100000,
    matchedIntentions: 6,
    needs: [
      {
        id: 'need-treatment-cost',
        type: 'treatment_cost',
        label: '治疗费用缺口',
        description: '巩固治疗阶段费用缺口，需机构核验后对接资金支持意向。',
        priority: 'high',
      },
      {
        id: 'need-policy-consultation',
        type: 'policy_consultation',
        label: '医保/救助政策咨询',
        description: '协助家属确认医保和属地救助报销路径。',
        priority: 'high',
      },
    ],
    progress: ['机构已完成初审', '等待补充最新发票', '已匹配2名本地志愿者'],
    story:
      '患儿A正在接受规范治疗，家庭已完成前期自筹和医保申请。项目当前重点是补齐费用证明并匹配后续治疗阶段的社会支持。',
  },
  {
    id: 'project-parent-b',
    patientAlias: '患者B',
    disease: '重症再生障碍性贫血',
    status: 'in_treatment',
    region: '华东',
    verifiedNeed: '移植前支持治疗与陪护资源',
    resourceGap: 68000,
    matchedIntentions: 3,
    needs: [
      {
        id: 'need-drug-resource',
        type: 'medicine',
        label: '药品资源信息',
        description: '需要机构确认可合规对接的药品资源信息。',
        priority: 'medium',
      },
    ],
    progress: ['医院社工已复核病情摘要', '药品资源意向待确认'],
    story: '患者B处于移植前准备阶段，机构正在协调治疗费用缺口和陪护支持。',
  },
  {
    id: 'project-child-c',
    patientAlias: '患儿C',
    disease: '罕见病长期治疗',
    status: 'completed',
    region: '西南',
    verifiedNeed: '阶段性药品与复查交通支持',
    resourceGap: 0,
    matchedIntentions: 9,
    needs: [
      {
        id: 'need-follow-up-transportation',
        type: 'transportation',
        label: '复查交通提醒',
        description: '阶段性援助完成后继续记录复查交通需求。',
        priority: 'low',
      },
    ],
    progress: ['阶段援助已完成', '反馈报告已生成', '后续复查提醒已登记'],
    story: '患儿C已完成本阶段救助，机构已生成脱敏反馈报告并继续跟进复查。',
  },
];
```

- [x] **Step 5: Verify tests pass and commit**

Run:

```bash
npm test -- src/domain/agents.test.ts
```

Expected: PASS.

Commit:

```bash
git add shanjian-agent/src/domain
git commit -m "feat: add charity aid domain data"
```

## Task 3: Implement Deterministic Agent Functions

**Files:**

- Modify: `shanjian-agent/src/domain/agents.test.ts`
- Create: `shanjian-agent/src/domain/agents.ts`

- [x] **Step 1: Add tests for AI-like outputs**

Append to `src/domain/agents.test.ts`:

```ts
import {
  answerProjectQuestion,
  classifyDonationIntention,
  generateFeedbackDraft,
  generatePublicProject,
  runFourDiscernment,
  structureAidApplication,
} from './agents';

describe('deterministic agents', () => {
  it('structures intake and flags missing materials', () => {
    const result = structureAidApplication(demoAidApplication);
    expect(result.summary).toContain('费用缺口');
    expect(result.missingMaterials.map((item) => item.label)).toContain('最新医疗费用发票');
    expect(result.missingMaterials.map((item) => item.label)).toContain('监护关系证明');
  });

  it('runs four-discernment review with human checklist', () => {
    const report = runFourDiscernment(demoAidApplication);
    expect(report.truth.some((risk) => risk.category === 'amount_conflict')).toBe(true);
    expect(report.goodAndHarm.some((risk) => risk.category === 'privacy')).toBe(true);
    expect(report.scale.urgency).toBe('high');
    expect(report.humanChecklist).toContain('人工核对最新发票与费用清单金额是否一致');
  });

  it('generates de-identified public project copy', () => {
    const project = generatePublicProject(demoAidApplication);
    expect(project.story).toContain('患儿A');
    expect(project.story).not.toContain('病房');
    expect(project.status).toBe('receiving_intentions');
  });

  it('classifies public help intention', () => {
    const result = classifyDonationIntention({
      id: 'intent-1',
      projectId: 'project-child-a',
      helpCategory: 'money',
      helpType: 'funding_intention',
      amountOrResource: '愿意定向支持5000元，由机构联系确认',
      city: '深圳',
      contact: 'demo@example.com',
      receiptNeed: true,
      message: '希望了解项目进展',
      status: 'new',
    });
    expect(result.priority).toBe('high');
    expect(result.categoryLabel).toBe('钱');
    expect(result.matchingRationale).toContain('治疗费用缺口');
    expect(result.followUpScript).toContain('不在平台内收款');
  });

  it('answers public project questions from verified facts', () => {
    const answer = answerProjectQuestion(seedPublicProjects[0], '这个项目目前最需要什么？');
    expect(answer.answer).toContain('治疗费用缺口');
    expect(answer.answer).toContain('医保/救助政策咨询');
    expect(answer.sourceLabels).toContain('项目当前需求');
  });

  it('drafts transparent feedback', () => {
    const draft = generateFeedbackDraft(seedPublicProjects[0]);
    expect(draft).toContain('阶段进展');
    expect(draft).toContain('不含可识别个人隐私');
  });
});
```

- [x] **Step 2: Run tests and verify failure**

Run:

```bash
npm test -- src/domain/agents.test.ts
```

Expected: FAIL because `agents.ts` does not exist.

- [x] **Step 3: Implement agents**

Create `src/domain/agents.ts`:

```ts
import type { AidApplication, DonationIntention, FourDiscernmentReport, MissingMaterial, ProjectAnswer, PublicProject } from './types';

export function structureAidApplication(application: AidApplication) {
  const missingMaterials: MissingMaterial[] = [
    {
      id: 'missing-latest-invoice',
      label: '最新医疗费用发票',
      reason: '材料备注显示最新发票缺失，无法确认当前费用缺口。',
      severity: 'high',
    },
    {
      id: 'missing-guardian-proof',
      label: '监护关系证明',
      reason: '大病儿童救助需要确认申请人与患儿关系。',
      severity: 'medium',
    },
    {
      id: 'missing-reimbursement-status',
      label: '医保/商保报销状态确认',
      reason: '报销预估不完整，会影响真实缺口判断。',
      severity: 'high',
    },
  ];

  return {
    summary: `患儿${application.patientAlias.replace('患儿', '')}处于${application.treatmentStage}，当前费用缺口约${application.remainingGap.toLocaleString()}元。`,
    normalizedExpense: {
      total: application.expenseTotal,
      paid: application.paidAmount,
      reimbursementEstimate: application.reimbursementEstimate,
      remainingGap: application.remainingGap,
    },
    requestedNeeds: application.requestedNeeds,
    missingMaterials,
  };
}

export function runFourDiscernment(application: AidApplication): FourDiscernmentReport {
  return {
    goodAndHarm: [
      {
        id: 'privacy-school-room',
        category: 'privacy',
        label: '传播草稿存在隐私暴露',
        evidence: '原始叙事提到学校、病房楼层等可识别信息。',
        severity: 'high',
      },
      {
        id: 'emotional-overstatement',
        category: 'overstatement',
        label: '求助表达需要避免情绪化过度承诺',
        evidence: '公开文案应保留事实，不使用绝对化疗效或悲情刺激表达。',
        severity: 'medium',
      },
    ],
    truth: [
      {
        id: 'amount-conflict',
        category: 'amount_conflict',
        label: '费用缺口需要人工复核',
        evidence: '费用总额、已支付、报销预估与剩余缺口之间需要最新发票确认。',
        severity: 'high',
      },
      {
        id: 'reimbursement-unclear',
        category: 'timeline',
        label: '医保/商保报销状态不清',
        evidence: '当前仅有预估说明，没有确认回执。',
        severity: 'high',
      },
    ],
    scale: {
      urgency: 'high',
      resourceGap: application.remainingGap,
      rationale: '处于连续治疗阶段，费用缺口影响后续治疗安排，需优先补齐关键证明并跟进资源。',
    },
    proximity: ['联系医院社工核实治疗阶段', '联系属地民政确认家庭负担', '匹配深圳本地捐助意向', '匹配陪诊和交通志愿者'],
    humanChecklist: [
      '人工核对最新发票与费用清单金额是否一致',
      '确认医保/商保报销状态',
      '核验监护关系证明',
      '删除公开材料中的学校、病房、电话和详细地址',
      '确认是否已有其他公开募捐或救助渠道',
    ],
  };
}

export function generatePublicProject(application: AidApplication): PublicProject {
  return {
    id: `project-${application.id}`,
    patientAlias: application.patientAlias,
    disease: '儿童血液病治疗支持',
    status: 'receiving_intentions',
    region: application.hospitalRegion.replace('某三甲医院', ''),
    verifiedNeed: '连续治疗阶段费用缺口与陪护支持',
    resourceGap: application.remainingGap,
    matchedIntentions: 0,
    needs: application.requestedNeeds,
    progress: ['机构完成初步材料整理', '等待补充最新发票和报销确认', '公开展示已完成脱敏处理'],
    story:
      `${application.patientAlias}正在接受规范治疗，家庭已承担前期费用并申请医保报销。` +
      '机构正在核实最新费用凭证，并收集社会帮助意向用于后续合规跟进。',
  };
}

export function classifyDonationIntention(intention: DonationIntention) {
  const isHighValue =
    intention.helpType === 'medical_resource' ||
    intention.helpType === 'corporate_support' ||
    /[5-9]\d{3,}|[1-9]\d{4,}/.test(intention.amountOrResource);

  const categoryLabel = intention.helpCategory === 'money' ? '钱' : intention.helpCategory === 'materials' ? '物' : '服';
  const matchingRationale =
    intention.helpCategory === 'money'
      ? '与项目的治疗费用缺口匹配，需由机构线下确认收款路径。'
      : intention.helpCategory === 'materials'
        ? '与项目的药品、营养或住宿交通等物资需求匹配，需确认合规交付方式。'
        : '与项目的陪诊、政策咨询、心理支持或传播等服务需求匹配，需由机构安排后续协作。';

  return {
    priority: isHighValue ? 'high' : 'normal',
    categoryLabel,
    matchingRationale,
    tags: [categoryLabel, intention.helpType, intention.city, intention.receiptNeed ? 'needs_receipt_info' : 'no_receipt_need'],
    followUpScript:
      `您好，感谢您对该救助项目表达帮助意向。平台仅登记意向、不在平台内收款，` +
      `后续将由有资质机构工作人员与您确认支持方式、票据需求和项目反馈。`,
  };
}

export function answerProjectQuestion(project: PublicProject, question: string): ProjectAnswer {
  const needsText = project.needs.map((need) => `${need.label}：${need.description}`).join('；');

  if (question.includes('为什么') || question.includes('收款') || question.includes('付款')) {
    return {
      question,
      answer: '平台只登记帮助意向，不在平台内收款。真实募捐主体、资金账户、票据和拨付由有资质机构负责。',
      sourceLabels: ['合规边界', '机构复核'],
    };
  }

  if (question.includes('需要') || question.includes('缺')) {
    return {
      question,
      answer: `当前最需要的是：${needsText}。这些需求会进入机构后台，由工作人员匹配钱、物、服三类社会支持。`,
      sourceLabels: ['项目当前需求', '机构工作台'],
    };
  }

  return {
    question,
    answer: `该项目处于${project.status}状态，已记录${project.progress.length}条阶段进展。AI回答只基于脱敏项目事实，不能替代机构判断。`,
    sourceLabels: ['项目进展', 'AI辅助说明'],
  };
}

export function generateFeedbackDraft(project: PublicProject) {
  return [
    `项目：${project.patientAlias} ${project.verifiedNeed}`,
    `阶段进展：${project.progress.join('；')}`,
    `当前资源缺口：${project.resourceGap.toLocaleString()}元或等值资源支持。`,
    '说明：本反馈为机构工作人员复核前草稿，不含可识别个人隐私，不代表平台收款或拨付。',
  ].join('\n');
}
```

- [x] **Step 4: Verify tests pass and commit**

Run:

```bash
npm test -- src/domain/agents.test.ts
```

Expected: PASS.

Commit:

```bash
git add shanjian-agent/src/domain
git commit -m "feat: add deterministic charity agents"
```

## Task 4: Build Demo Store And Navigation

**Files:**

- Create: `shanjian-agent/src/app/navigation.ts`
- Create: `shanjian-agent/src/app/storage.ts`
- Create: `shanjian-agent/src/app/demoStore.ts`
- Create: `shanjian-agent/tests/app-flow.test.tsx`
- Modify: `shanjian-agent/src/App.tsx`

- [ ] **Step 1: Write app flow test**

Create `tests/app-flow.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';

describe('Shanjian Agent flow', () => {
  it('starts on public project home and navigates to all three backends', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole('heading', { name: /公众项目展示/ })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /求助申请入口/ }));
    expect(screen.getByRole('heading', { name: /求助申请入口/ })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /机构四辨工作台/ }));
    expect(screen.getByRole('heading', { name: /机构四辨工作台/ })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /捐助意向管理/ }));
    expect(screen.getByRole('heading', { name: /捐助意向管理/ })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test and verify failure**

Run:

```bash
npm test -- tests/app-flow.test.tsx
```

Expected: FAIL because navigation UI does not exist.

- [ ] **Step 3: Implement navigation and store**

Create `src/app/navigation.ts`:

```ts
export type ViewKey = 'home' | 'application' | 'workbench' | 'intentions';

export const navItems: Array<{ key: ViewKey; label: string }> = [
  { key: 'application', label: '求助申请入口' },
  { key: 'workbench', label: '机构四辨工作台' },
  { key: 'intentions', label: '捐助意向管理' },
];
```

Create `src/app/storage.ts`:

```ts
export function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJson<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}
```

Create `src/app/demoStore.ts`:

```ts
import { demoAidApplication, seedPublicProjects } from '../domain/demoData';
import type { AidApplication, DonationIntention, PublicProject } from '../domain/types';

export interface DemoState {
  applications: AidApplication[];
  projects: PublicProject[];
  intentions: DonationIntention[];
}

export const initialDemoState: DemoState = {
  applications: [demoAidApplication],
  projects: seedPublicProjects,
  intentions: [
    {
      id: 'intent-seed-1',
      projectId: 'project-child-a',
      helpCategory: 'money',
      helpType: 'funding_intention',
      amountOrResource: '愿意支持5000元，由机构联系确认',
      city: '深圳',
      contact: 'demo@example.com',
      receiptNeed: true,
      message: '希望收到阶段反馈',
      status: 'new',
    },
  ],
};
```

- [ ] **Step 4: Implement App navigation**

Modify `src/App.tsx`:

```tsx
import { useState } from 'react';
import { navItems, type ViewKey } from './app/navigation';
import { initialDemoState } from './app/demoStore';
import './styles/global.css';

export default function App() {
  const [view, setView] = useState<ViewKey>('home');
  const [state] = useState(initialDemoState);

  return (
    <main className="app-root">
      <header className="topbar">
        <button className="brand" type="button" onClick={() => setView('home')}>
          善见 Agent
        </button>
        <nav className="topnav" aria-label="后台入口">
          {navItems.map((item) => (
            <button key={item.key} type="button" onClick={() => setView(item.key)}>
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {view === 'home' && <section><h1>公众项目展示</h1><p>当前项目：{state.projects.length}</p></section>}
      {view === 'application' && <section><h1>求助申请入口</h1></section>}
      {view === 'workbench' && <section><h1>机构四辨工作台</h1></section>}
      {view === 'intentions' && <section><h1>捐助意向管理</h1></section>}
    </main>
  );
}
```

- [ ] **Step 5: Add basic layout CSS**

Append to `src/styles/global.css`:

```css
.topbar {
  align-items: center;
  border-bottom: 1px solid #ded8ce;
  display: flex;
  gap: 24px;
  justify-content: space-between;
  padding: 18px 28px;
}

.brand,
.topnav button {
  background: #ffffff;
  border: 1px solid #d8d2c7;
  border-radius: 8px;
  color: #202426;
  cursor: pointer;
  min-height: 40px;
  padding: 0 14px;
}

.brand {
  border: 0;
  font-size: 18px;
  font-weight: 700;
}

.topnav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
```

- [ ] **Step 6: Verify and commit**

Run:

```bash
npm test -- tests/app-flow.test.tsx
npm run build
```

Expected: PASS and build exits 0.

Commit:

```bash
git add shanjian-agent
git commit -m "feat: add app navigation and demo store"
```

## Task 5: Build Public Project Home

**Files:**

- Create: `shanjian-agent/src/components/AppShell.tsx`
- Create: `shanjian-agent/src/components/ComplianceNotice.tsx`
- Create: `shanjian-agent/src/components/MetricStrip.tsx`
- Create: `shanjian-agent/src/components/ProjectCard.tsx`
- Create: `shanjian-agent/src/components/ProjectDetail.tsx`
- Create: `shanjian-agent/src/components/ProjectQuestionPanel.tsx`
- Modify: `shanjian-agent/src/App.tsx`
- Modify: `shanjian-agent/src/styles/global.css`
- Modify: `shanjian-agent/tests/app-flow.test.tsx`

- [ ] **Step 1: Extend app flow test for public home**

Add assertions:

```tsx
expect(screen.getByText(/不自营募捐/)).toBeInTheDocument();
expect(screen.getByText(/患儿A/)).toBeInTheDocument();
expect(screen.getByText(/AI问项目/)).toBeInTheDocument();
expect(screen.getByRole('button', { name: /这个项目目前最需要什么/ })).toBeInTheDocument();
expect(screen.getByRole('button', { name: /我要帮助/ })).toBeInTheDocument();
```

- [ ] **Step 2: Run test and verify failure**

Run:

```bash
npm test -- tests/app-flow.test.tsx
```

Expected: FAIL because home components do not exist.

- [ ] **Step 3: Create shell and home components**

Implement components with these visible requirements:

- `AppShell`: owns topbar and renders children.
- `ComplianceNotice`: text must include `不自营募捐、不代收善款、不建立资金池`.
- `MetricStrip`: shows simulated totals: `3个展示项目`, `18条捐助意向`, `7份反馈草稿`.
- `ProjectCard`: shows patient alias, disease, progress, resource gap and `我要帮助` button.
- `ProjectDetail`: shows evidence summary, current real needs, progress timeline and feedback preview.
- `ProjectQuestionPanel`: titled `AI问项目`, shows deterministic question buttons and calls `answerProjectQuestion`. Required question buttons: `这个项目目前最需要什么？`, `为什么不能直接付款？`, `我能提供的资源适合吗？`.

Use lucide icons for buttons where useful: `HeartHandshake`, `ClipboardList`, `ShieldCheck`, `Inbox`.

- [ ] **Step 4: Wire home components in App**

The home page must render:

```text
公众项目展示
合规提示
指标条
项目卡片列表
选中项目详情
AI问项目
我要帮助 button
```

Clicking `我要帮助` must switch to `捐助意向管理` and make the relevant project name visible at the top of that management view.

- [ ] **Step 5: Verify responsive CSS**

CSS requirements:

- Desktop: topbar entries on one row, project cards in responsive grid.
- Mobile: topbar wraps, cards stack, no text overflow in buttons.
- Use a restrained palette: warm neutral background, white panels, muted teal/sage accents, amber risk highlights, red only for high risk.

- [ ] **Step 6: Verify and commit**

Run:

```bash
npm test
npm run build
```

Expected: PASS and build exits 0.

Commit:

```bash
git add shanjian-agent
git commit -m "feat: build public project home"
```

## Task 6: Build Aid Application Entry

**Files:**

- Create: `shanjian-agent/src/components/AidApplicationEntry.tsx`
- Modify: `shanjian-agent/src/App.tsx`
- Modify: `shanjian-agent/tests/app-flow.test.tsx`

- [ ] **Step 1: Add intake test**

Add flow:

```tsx
await user.click(screen.getByRole('button', { name: /求助申请入口/ }));
expect(screen.getByLabelText(/病情摘要/)).toBeInTheDocument();
expect(screen.getByLabelText(/费用缺口/)).toBeInTheDocument();
expect(screen.getByLabelText(/当前最需要的支持/)).toBeInTheDocument();
expect(screen.getByLabelText(/我不会整理材料，先写一段话/)).toBeInTheDocument();
await user.click(screen.getByRole('button', { name: /生成机构申请包/ }));
expect(screen.getByText(/最新医疗费用发票/)).toBeInTheDocument();
expect(screen.getByText(/治疗费用缺口/)).toBeInTheDocument();
```

- [ ] **Step 2: Implement component**

Component requirements:

- Shows a form populated with the fictional leukemia case.
- Includes fields for applicant role, patient alias, disease, treatment stage, region, total expense, reimbursement estimate, remaining gap, family burden, current real support needs, low-barrier narrative, material notes and consent.
- Current real support needs must use checkboxes or segmented chips for `治疗费用`, `药品/营养`, `异地住宿`, `交通陪诊`, `医保/救助政策咨询`, `心理支持`, `传播支持`.
- Low-barrier narrative field label must be `我不会整理材料，先写一段话`.
- Layout principle: one step asks one class of information; use larger controls and short helper copy for stressed families and low digital-literacy applicants.
- Button: `生成机构申请包`.
- After click, call `structureAidApplication`.
- Render structured summary, current real needs, missing-material checklist and privacy notice.

- [ ] **Step 3: Verify and commit**

Run:

```bash
npm test
npm run build
```

Expected: PASS and build exits 0.

Commit:

```bash
git add shanjian-agent
git commit -m "feat: add aid application intake"
```

## Task 7: Build Institutional Four-Discernment Workbench

**Files:**

- Create: `shanjian-agent/src/components/FourDiscernmentWorkbench.tsx`
- Modify: `shanjian-agent/src/App.tsx`
- Modify: `shanjian-agent/tests/app-flow.test.tsx`

- [ ] **Step 1: Add workbench test**

Add flow:

```tsx
await user.click(screen.getByRole('button', { name: /机构四辨工作台/ }));
expect(screen.getByText(/辨善恶/)).toBeInTheDocument();
expect(screen.getByText(/辨真伪/)).toBeInTheDocument();
expect(screen.getByText(/辨大小/)).toBeInTheDocument();
expect(screen.getByText(/辨远近/)).toBeInTheDocument();
await user.click(screen.getByRole('button', { name: /运行四辨审核/ }));
expect(screen.getByText(/人工核对最新发票/)).toBeInTheDocument();
```

- [ ] **Step 2: Implement component**

Component requirements:

- Shows case summary for `demoAidApplication`.
- Button: `运行四辨审核`.
- Calls `runFourDiscernment`.
- Renders four panels:
  - 辨善恶: privacy and overstatement risks.
  - 辨真伪: amount and reimbursement issues.
  - 辨大小: urgency and resource gap.
  - 辨远近: local verification and matching suggestions.
- Shows human checklist.
- Decision buttons: `要求补充材料`, `拒绝`, `批准展示`, `线下跟进`.
- `批准展示` should show text `已生成脱敏项目卡片`.

- [ ] **Step 3: Verify and commit**

Run:

```bash
npm test
npm run build
```

Expected: PASS and build exits 0.

Commit:

```bash
git add shanjian-agent
git commit -m "feat: add four-discernment workbench"
```

## Task 8: Build Donation Intention Management

**Files:**

- Create: `shanjian-agent/src/components/DonationIntentionManagement.tsx`
- Modify: `shanjian-agent/src/App.tsx`
- Modify: `shanjian-agent/tests/app-flow.test.tsx`

- [ ] **Step 1: Add donation-intention test**

Add flow:

```tsx
await user.click(screen.getByRole('button', { name: /捐助意向管理/ }));
expect(screen.getByText(/平台仅登记意向/)).toBeInTheDocument();
expect(screen.getByLabelText(/帮助类别/)).toBeInTheDocument();
expect(screen.getByLabelText(/帮助类型/)).toBeInTheDocument();
await user.click(screen.getByRole('button', { name: /AI分类并生成跟进建议/ }));
expect(screen.getByText(/钱/)).toBeInTheDocument();
expect(screen.getByText(/治疗费用缺口/)).toBeInTheDocument();
expect(screen.getByText(/不在平台内收款/)).toBeInTheDocument();
```

- [ ] **Step 2: Implement component**

Component requirements:

- Shows existing seeded intention.
- Provides form for help category, help type, amount/resource, city, contact, receipt need, message.
- Help category must be `钱`, `物`, `服`.
- Help type options must include funding intention, medical resource, drug resource, nutrition, accommodation, transportation, volunteer escort, policy consultation, psychological support, propagation, corporate support.
- Button: `AI分类并生成跟进建议`.
- Calls `classifyDonationIntention`.
- Renders category label, priority, tags, matching rationale and follow-up script.
- Matching rationale must mention the beneficiary-stated real need, such as `治疗费用缺口`, `医保/救助政策咨询` or `复诊交通协助`.
- Visible compliance copy: `平台仅登记意向，不在平台内收款。`

- [ ] **Step 3: Verify and commit**

Run:

```bash
npm test
npm run build
```

Expected: PASS and build exits 0.

Commit:

```bash
git add shanjian-agent
git commit -m "feat: add donation intention management"
```

## Task 9: Add Feedback Preview And Demo Polish

**Files:**

- Create: `shanjian-agent/src/components/FeedbackPreview.tsx`
- Modify: `shanjian-agent/src/components/ProjectDetail.tsx`
- Modify: `shanjian-agent/src/styles/global.css`
- Modify: `shanjian-agent/tests/app-flow.test.tsx`

- [ ] **Step 1: Add feedback test**

Add:

```tsx
expect(screen.getByText(/透明反馈草稿/)).toBeInTheDocument();
expect(screen.getByText(/不含可识别个人隐私/)).toBeInTheDocument();
```

- [ ] **Step 2: Implement feedback preview**

Requirements:

- Calls `generateFeedbackDraft` for selected project.
- Shows a report-style panel titled `透明反馈草稿`.
- Adds note: `需机构工作人员复核后发布`.

- [ ] **Step 3: Polish CSS**

Requirements:

- No nested card-in-card visual clutter.
- Cards use border radius 8px or less.
- Buttons have stable height and text wrapping.
- Risk chips use restrained amber/red.
- Public home feels credible and operational, not like a dramatic donation landing page.

- [ ] **Step 4: Verify and commit**

Run:

```bash
npm test
npm run build
```

Expected: PASS and build exits 0.

Commit:

```bash
git add shanjian-agent
git commit -m "feat: add feedback preview and polish"
```

## Task 10: Final Verification And Demo Script

**Files:**

- Create: `shanjian-agent/DEMO.md`
- Modify: `shanjian-agent/README.md`

- [ ] **Step 1: Write demo script**

Create `DEMO.md` with:

```md
# 善见 Agent Demo Script

1. 打开首页，说明这是公众项目展示页，不是个人求助平台。
2. 指出右上角三个入口：求助申请入口、机构四辨工作台、捐助意向管理。
3. 在项目详情页打开 AI问项目，询问“这个项目目前最需要什么？”并说明 AI 只基于脱敏事实回答。
4. 进入求助申请入口，展示大病救助材料如何被 AI 结构化，尤其是“受助人真实需要”和“我不会整理材料，先写一段话”。
5. 进入机构四辨工作台，运行四辨审核。
6. 解释 AI 只给证据、风险、优先级和复核清单，最终由机构工作人员决定。
7. 回到首页，展示脱敏项目卡片和透明反馈草稿。
8. 点击我要帮助或进入捐助意向管理，说明平台只登记钱/物/服三类帮助意向，不在平台内收款。
9. 展示 AI 如何把帮助意向匹配到治疗费用、政策咨询、交通陪诊等真实需要，并生成机构跟进话术。
```

- [ ] **Step 2: Update README**

README must include:

```md
# 善见 Agent

大病救助项目系统 MVP。首页展示公众项目，后台承接求助申请、机构四辨审核和捐助意向管理，并通过 AI问项目、钱/物/服资源匹配和透明反馈，让善意更精准地抵达真实需要。

## Run

```bash
npm install
npm run dev
```

## Verify

```bash
npm test
npm run build
```

## Compliance Boundary

本 demo 不处理真实患者数据，不自营公开募捐，不代收善款，不建立资金池，不提供医疗诊断或治疗建议。捐助功能为意向登记，由有资质机构后续跟进。
```

- [ ] **Step 3: Full verification**

Run:

```bash
npm test
npm run build
npm run dev -- --host 127.0.0.1
```

Expected:

- Tests pass.
- Build exits 0.
- Dev server starts and prints a local URL.

Use browser verification:

- Open the local URL.
- Verify desktop viewport: no blank page, nav visible, home cards visible, three entry buttons visible.
- Verify mobile viewport around 390px width: nav wraps cleanly, buttons do not overflow, cards stack.
- Click through all four modules.

- [ ] **Step 4: Commit final docs**

```bash
git add shanjian-agent/README.md shanjian-agent/DEMO.md
git commit -m "docs: add demo script"
```

## Acceptance Checklist

- [ ] Home page is public project display, not a marketing-only landing page.
- [ ] Top-right entries exist: `求助申请入口`, `机构四辨工作台`, `捐助意向管理`.
- [ ] Aid application intake generates structured case file and missing-material checklist.
- [ ] Four-discernment workbench shows 辨善恶、辨真伪、辨大小、辨远近.
- [ ] Public project cards are de-identified and restrained.
- [ ] Project detail includes `AI问项目` with deterministic answers based on verified facts and compliance boundary.
- [ ] Aid application captures beneficiary-stated real needs and a low-barrier narrative field.
- [ ] Donation function is intention registration only.
- [ ] Donation-intention management supports money/material/service categories.
- [ ] Donation-intention management produces classification, real-need matching rationale and follow-up script.
- [ ] Feedback draft states it needs institutional review.
- [ ] Compliance boundary is visible in UI and README.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] Browser verification passes on desktop and mobile.

## Self-Review

Spec coverage:

- Public project display: Task 5 and Task 9.
- AI问项目: Task 3 and Task 5.
- Aid application intake: Task 6.
- Beneficiary dignity and real needs: Task 2 and Task 6.
- Institutional four-discernment workbench: Task 7.
- Money/material/service donation-intention management: Task 2, Task 3 and Task 8.
- Transparent feedback: Task 9.
- Compliance boundary: Tasks 5, 8, 10.
- Demo flow and verification: Task 10.

Placeholder scan:

- No placeholder markers or unfinished implementation notes are allowed in execution.
- If implementation discovers missing details, choose the smallest demo-safe behavior that preserves the compliance boundary.

Type consistency:

- Use the exact domain names from `types.ts`.
- Keep `DonationIntention.helpType` values exactly as declared.
- Keep `DonationIntention.helpCategory` values exactly as `money`, `materials`, `services`.
- Keep `ResourceNeed.type` values exactly as declared.
- Keep view keys exactly as `home`, `application`, `workbench`, `intentions`.
