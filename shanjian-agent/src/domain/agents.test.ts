import { describe, expect, it } from 'vitest';
import { demoAidApplication, seedPublicProjects } from './demoData';
import {
  answerProjectQuestion,
  classifyDonationIntention,
  generateFeedbackDraft,
  generatePublicProject,
  runFourDiscernment,
  structureAidApplication,
} from './agents';

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

describe('deterministic agents', () => {
  it('structures intake and flags missing materials', () => {
    const result = structureAidApplication(demoAidApplication);

    expect(result.summary).toContain('费用缺口');
    expect(result.missingMaterials.map((item) => item.label)).toContain('最新医疗费用发票');
    expect(result.missingMaterials.map((item) => item.label)).toContain('监护关系证明');
    expect(result.requestedNeeds.map((need) => need.label)).toContain('医保/救助政策咨询');
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
    expect(project.needs.map((need) => need.category)).toContain('services');
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
    expect(draft).toContain('需机构工作人员复核');
  });
});
