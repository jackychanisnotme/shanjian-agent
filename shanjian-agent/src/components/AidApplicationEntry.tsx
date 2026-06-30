import { FilePlus2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { structureAidApplication } from '../domain/agents';
import type { AidApplication, CaseFile } from '../domain/types';

interface AidApplicationEntryProps {
  application: AidApplication;
}

const supportOptions = [
  '治疗费用',
  '药品/营养',
  '异地住宿',
  '交通陪诊',
  '医保/救助政策咨询',
  '心理支持',
  '传播支持',
];

export function AidApplicationEntry({ application }: AidApplicationEntryProps) {
  const [caseFile, setCaseFile] = useState<CaseFile | null>(null);

  return (
    <section className="view-panel module-page" aria-labelledby="application-title">
      <div className="module-heading">
        <p className="eyebrow">低门槛求助材料整理 · 虚构/脱敏 demo</p>
        <h1 id="application-title">求助申请入口</h1>
        <p>
          面向家属、志愿者或机构工作人员。AI 只把材料整理成机构可复核的申请包，不自动批准救助。
        </p>
      </div>

      <form className="form-grid" onSubmit={(event) => event.preventDefault()}>
        <label>
          申请人身份
          <select defaultValue={application.applicantRole}>
            <option value="family">家属</option>
            <option value="patient">本人</option>
            <option value="volunteer">志愿者</option>
            <option value="institution_staff">机构工作人员</option>
          </select>
        </label>
        <label>
          患者脱敏称呼
          <input defaultValue={application.patientAlias} />
        </label>
        <label className="span-2">
          病情摘要
          <textarea defaultValue={`${application.disease}，${application.treatmentStage}`} rows={3} />
        </label>
        <label>
          所在地区/医院范围
          <input defaultValue={application.hospitalRegion} />
        </label>
        <label>
          费用缺口
          <input defaultValue={application.remainingGap} inputMode="numeric" />
        </label>
        <label>
          总费用
          <input defaultValue={application.expenseTotal} inputMode="numeric" />
        </label>
        <label>
          医保/商保预估
          <input defaultValue={application.reimbursementEstimate} inputMode="numeric" />
        </label>
        <label className="span-2">
          家庭负担说明
          <textarea defaultValue={application.familyBurden} rows={3} />
        </label>

        <fieldset className="span-2 checkbox-group" aria-label="当前最需要的支持">
          <legend>当前最需要的支持</legend>
          <p>尊重受助人真实需要和选择权，可同时登记钱、物、服。</p>
          <div className="chip-grid">
            {supportOptions.map((option, index) => (
              <label className="check-chip" key={option}>
                <input defaultChecked={index < 5} type="checkbox" />
                {option}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="span-2">
          材料说明
          <textarea defaultValue={application.materialNotes.join('\n')} rows={5} />
        </label>
        <label className="span-2">
          我不会整理材料，先写一段话
          <textarea defaultValue={application.rawNarrative} rows={5} />
        </label>
        <label className="check-line span-2">
          <input defaultChecked={application.consentForInstitutionReview} type="checkbox" />
          同意提交给有资质机构进行人工复核
        </label>
        <label className="check-line span-2">
          <input defaultChecked={application.consentForDeidentifiedDisplay} type="checkbox" />
          同意机构审核通过后进行脱敏公开展示
        </label>
        <button className="primary-button form-submit" type="button" onClick={() => setCaseFile(structureAidApplication(application))}>
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
        </section>
      )}
    </section>
  );
}
