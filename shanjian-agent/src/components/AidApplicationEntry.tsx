import { FilePlus2, Sparkles } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { structureAidApplication } from '../domain/agents';
import type { AidApplication, CaseFile, HelpCategory, NeedType, ResourceNeed } from '../domain/types';

interface AidApplicationEntryProps {
  application: AidApplication;
}

const supportOptions: Array<{ category: HelpCategory; label: string; type: NeedType }> = [
  { category: 'money', label: '治疗费用', type: 'treatment_cost' },
  { category: 'materials', label: '药品/营养', type: 'nutrition' },
  { category: 'materials', label: '异地住宿', type: 'accommodation' },
  { category: 'services', label: '交通陪诊', type: 'transportation' },
  { category: 'services', label: '医保/救助政策咨询', type: 'policy_consultation' },
  { category: 'services', label: '心理支持', type: 'psychological_support' },
  { category: 'services', label: '传播支持', type: 'propagation' },
];

export function AidApplicationEntry({ application }: AidApplicationEntryProps) {
  const [caseFile, setCaseFile] = useState<CaseFile | null>(null);

  function generateCaseFile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCaseFile(structureAidApplication(buildApplicationFromForm(event.currentTarget, application)));
  }

  return (
    <section className="view-panel module-page" aria-labelledby="application-title">
      <div className="module-heading">
        <p className="section-kicker">低门槛求助材料整理</p>
        <h1 id="application-title">求助申请入口</h1>
        <p>
          面向家属、志愿者或机构工作人员。AI 只把材料整理成机构可复核的申请包，不自动批准救助。
        </p>
      </div>

      <section className="prompt-card" aria-label="AI 整理提示词">
        <span>AI 整理提示词</span>
        <p>
          请只使用申请人提供的虚构/脱敏信息，将叙事整理为机构复核用档案，列出缺失材料、金额矛盾和隐私风险。不得给出医疗建议，不得判断是否批准救助。
        </p>
      </section>

      <form className="form-grid" onSubmit={generateCaseFile}>
        <label>
          申请人身份
          <select defaultValue={application.applicantRole} name="applicantRole">
            <option value="family">家属</option>
            <option value="patient">本人</option>
            <option value="volunteer">志愿者</option>
            <option value="institution_staff">机构工作人员</option>
          </select>
        </label>
        <label>
          患者脱敏称呼
          <input defaultValue={application.patientAlias} name="patientAlias" />
        </label>
        <label className="span-2">
          病情摘要
          <textarea defaultValue={`${application.disease}，${application.treatmentStage}`} name="conditionSummary" rows={3} />
        </label>
        <label>
          所在地区/医院范围
          <input defaultValue={application.hospitalRegion} name="hospitalRegion" />
        </label>
        <label>
          费用缺口
          <input defaultValue={application.remainingGap} inputMode="numeric" name="remainingGap" />
        </label>
        <label>
          总费用
          <input defaultValue={application.expenseTotal} inputMode="numeric" name="expenseTotal" />
        </label>
        <label>
          医保/商保预估
          <input defaultValue={application.reimbursementEstimate} inputMode="numeric" name="reimbursementEstimate" />
        </label>
        <label className="span-2">
          家庭负担说明
          <textarea defaultValue={application.familyBurden} name="familyBurden" rows={3} />
        </label>

        <fieldset className="span-2 checkbox-group" aria-label="当前最需要的支持">
          <legend>当前最需要的支持</legend>
          <p>尊重受助人真实需要和选择权，可同时登记钱、物、服。</p>
          <div className="chip-grid">
            {supportOptions.map((option, index) => (
              <label className="check-chip" key={option.label}>
                <input defaultChecked={index < 5} name="requestedNeeds" type="checkbox" value={option.label} />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="span-2">
          材料说明
          <textarea defaultValue={application.materialNotes.join('\n')} name="materialNotes" rows={5} />
        </label>
        <label className="span-2">
          我不会整理材料，先写一段话
          <textarea defaultValue={application.rawNarrative} name="rawNarrative" rows={5} />
        </label>
        <label className="check-line span-2">
          <input defaultChecked={application.consentForInstitutionReview} name="consentForInstitutionReview" type="checkbox" />
          同意提交给有资质机构进行人工复核
        </label>
        <label className="check-line span-2">
          <input defaultChecked={application.consentForDeidentifiedDisplay} name="consentForDeidentifiedDisplay" type="checkbox" />
          同意机构审核通过后进行脱敏公开展示
        </label>
        <button className="primary-button form-submit" type="submit">
          <Sparkles aria-hidden="true" size={17} />
          生成机构申请包
        </button>
      </form>

      {caseFile && (
        <section className="result-panel" aria-label="机构申请包">
          <div className="section-title-row">
            <FilePlus2 aria-hidden="true" size={19} />
            <h2>AI 结构化档案</h2>
          </div>
          <p>{caseFile.summary}</p>
          <div className="result-columns">
            <div>
              <h3>受助人真实需要</h3>
              <ul className="plain-list">
                {caseFile.requestedNeeds.map((need) => (
                  <li key={need.id}>{need.label}：{need.description}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>缺失材料清单</h3>
              <ul className="plain-list">
                {caseFile.missingMaterials.map((item) => (
                  <li key={item.id}>{item.label}：{item.reason}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="review-note">{caseFile.privacyHints.join(' ')}</p>
          <p className="review-note">人工复核前不可公开。</p>
        </section>
      )}
    </section>
  );
}

function buildApplicationFromForm(form: HTMLFormElement, baseApplication: AidApplication): AidApplication {
  const formData = new FormData(form);
  const conditionSummary = stringValue(formData, 'conditionSummary', `${baseApplication.disease}，${baseApplication.treatmentStage}`);
  const [disease, treatmentStage] = splitConditionSummary(conditionSummary);
  const expenseTotal = numberValue(formData, 'expenseTotal', baseApplication.expenseTotal);
  const reimbursementEstimate = numberValue(formData, 'reimbursementEstimate', baseApplication.reimbursementEstimate);
  const remainingGap = numberValue(formData, 'remainingGap', baseApplication.remainingGap);

  return {
    ...baseApplication,
    applicantRole: stringValue(formData, 'applicantRole', baseApplication.applicantRole) as AidApplication['applicantRole'],
    patientAlias: stringValue(formData, 'patientAlias', baseApplication.patientAlias),
    disease,
    treatmentStage,
    hospitalRegion: stringValue(formData, 'hospitalRegion', baseApplication.hospitalRegion),
    expenseTotal,
    paidAmount: Math.max(0, expenseTotal - reimbursementEstimate - remainingGap),
    reimbursementEstimate,
    remainingGap,
    familyBurden: stringValue(formData, 'familyBurden', baseApplication.familyBurden),
    requestedNeeds: selectedNeeds(formData.getAll('requestedNeeds'), baseApplication.requestedNeeds),
    materialNotes: stringValue(formData, 'materialNotes', baseApplication.materialNotes.join('\n'))
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean),
    rawNarrative: stringValue(formData, 'rawNarrative', baseApplication.rawNarrative),
    consentForInstitutionReview: formData.has('consentForInstitutionReview'),
    consentForDeidentifiedDisplay: formData.has('consentForDeidentifiedDisplay'),
  };
}

function selectedNeeds(values: FormDataEntryValue[], baseNeeds: ResourceNeed[]): ResourceNeed[] {
  const labels = values.map(String);
  const needs = labels.map((label) => {
    const option = supportOptions.find((item) => item.label === label);
    const existingNeed = baseNeeds.find((need) => need.label.includes(label) || label.includes(need.label));

    if (existingNeed) return existingNeed;

    return {
      id: `need-${label}`,
      type: option?.type ?? 'treatment_cost',
      category: option?.category ?? 'money',
      label,
      description: `${label}由申请人主动登记，需机构人工复核后再对接资源。`,
      priority: option?.category === 'money' ? 'high' : 'medium',
    } satisfies ResourceNeed;
  });

  return needs.length > 0 ? needs : baseNeeds;
}

function splitConditionSummary(summary: string): [string, string] {
  const [disease, ...rest] = summary.split(/[，,]/).map((part) => part.trim()).filter(Boolean);
  return [disease || '大病救助申请', rest.join('，') || '材料整理阶段'];
}

function stringValue(formData: FormData, key: string, fallback: string): string {
  const value = formData.get(key);
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function numberValue(formData: FormData, key: string, fallback: number): number {
  const raw = String(formData.get(key) ?? '').replace(/,/g, '').trim();
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}
