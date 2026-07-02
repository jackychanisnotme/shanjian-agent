import { HandHeart, Sparkles } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { classifyDonationIntention } from '../domain/agents';
import type {
  DonationClassification,
  DonationIntention,
  HelpCategory,
  HelpType,
  PublicProject,
} from '../domain/types';

interface DonationIntentionManagementProps {
  intentions: DonationIntention[];
  project: PublicProject;
  projects: PublicProject[];
  onRegister?: (intention: DonationIntention) => void;
}

const categoryOptions: Array<{ value: HelpCategory; label: string }> = [
  { value: 'money', label: '钱' },
  { value: 'materials', label: '物' },
  { value: 'services', label: '服' },
];

const helpTypeOptions: Array<{ value: HelpType; label: string }> = [
  { value: 'funding_intention', label: '资金支持意向' },
  { value: 'medical_resource', label: '医疗资源' },
  { value: 'drug_resource', label: '药品资源' },
  { value: 'nutrition', label: '营养支持' },
  { value: 'accommodation', label: '住宿支持' },
  { value: 'transportation', label: '交通支持' },
  { value: 'volunteer', label: '陪诊志愿' },
  { value: 'policy_consultation', label: '政策咨询' },
  { value: 'psychological_support', label: '心理支持' },
  { value: 'propagation', label: '传播支持' },
  { value: 'corporate_support', label: '企业支持' },
];

export function DonationIntentionManagement({
  intentions,
  onRegister,
  project,
  projects,
}: DonationIntentionManagementProps) {
  const [helpCategory, setHelpCategory] = useState<HelpCategory>('money');
  const [helpType, setHelpType] = useState<HelpType>('funding_intention');
  const [classification, setClassification] = useState<DonationClassification | null>(null);

  function classify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const selectedCategory = stringValue(formData, 'helpCategory', helpCategory) as HelpCategory;
    const selectedHelpType = stringValue(formData, 'helpType', helpType) as HelpType;
    const intention: DonationIntention = {
      id: `intent-demo-${Date.now()}`,
      projectId: project.id,
      helpCategory: selectedCategory,
      helpType: selectedHelpType,
      amountOrResource: stringValue(formData, 'amountOrResource', '愿意由机构联系确认帮助方式'),
      city: stringValue(formData, 'city', '未填写地区'),
      contact: stringValue(formData, 'contact', '未填写联系方式'),
      receiptNeed: formData.has('receiptNeed'),
      message: stringValue(formData, 'message', '希望了解项目进展，并尊重受助人真实需要。'),
      status: 'new',
    };

    setClassification(classifyDonationIntention(intention, projects));
    onRegister?.(intention);
  }

  return (
    <section className="view-panel module-page" aria-labelledby="intentions-title">
      <div className="module-heading">
        <p className="section-kicker">钱/物/服帮助意向登记</p>
        <h1 id="intentions-title">捐助意向管理</h1>
        <p>项目：{project.patientAlias} · {project.verifiedNeed}</p>
        <p className="review-note">平台仅登记意向，不在平台内收款。不自营公开募捐，不代收善款，不建立资金池。</p>
      </div>

      <section className="prompt-card" aria-label="资源匹配提示词">
        <span>资源匹配不是收款</span>
        <p>
          请将公众意向分类为钱、物、服，匹配项目真实需要，并生成机构联系话术。不得生成支付入口，不得承诺受助结果。
        </p>
      </section>

      <section className="intentions-layout" aria-label="捐助意向工作区">
        <form className="form-grid intention-form" onSubmit={classify}>
          <label>
            帮助类别
            <select name="helpCategory" value={helpCategory} onChange={(event) => setHelpCategory(event.target.value as HelpCategory)}>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label>
            帮助类型
            <select name="helpType" value={helpType} onChange={(event) => setHelpType(event.target.value as HelpType)}>
              {helpTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label className="span-2">
            金额或资源说明
            <textarea defaultValue="愿意定向支持5000元，由机构联系确认" name="amountOrResource" rows={3} />
          </label>
          <label>
            城市/地区
            <input defaultValue="深圳" name="city" />
          </label>
          <label>
            联系方式
            <input defaultValue="contact@example.org" name="contact" />
          </label>
          <label className="check-line span-2">
            <input defaultChecked name="receiptNeed" type="checkbox" />
            需要机构提供票据/项目信息说明
          </label>
          <label className="span-2">
            留言
            <textarea defaultValue="希望了解项目进展，并尊重受助人真实需要。" name="message" rows={3} />
          </label>
          <button className="primary-button form-submit" type="submit">
            <Sparkles aria-hidden="true" size={17} />
            AI分类并生成跟进建议
          </button>
        </form>

        <aside className="result-panel">
          <div className="section-title-row">
            <HandHeart aria-hidden="true" size={19} />
            <h2>已有帮助意向</h2>
          </div>
          <ul className="intention-list">
            {intentions.map((intention) => (
              <li key={intention.id}>
                <strong>{labelForCategory(intention.helpCategory)} · {labelForHelpType(intention.helpType)}</strong>
                <span>{intention.amountOrResource}</span>
              </li>
            ))}
          </ul>
          <h3>项目真实需要</h3>
          <ul className="plain-list">
            {project.needs.map((need) => (
              <li key={need.id}>{need.label}</li>
            ))}
          </ul>
        </aside>
      </section>

      {classification && (
        <section className="classification-box" aria-label="AI分类结果">
          <div className="section-title-row">
            <Sparkles aria-hidden="true" size={19} />
            <h2>AI 分类与机构跟进建议</h2>
          </div>
          <p>
            帮助类别：<strong>{classification.categoryLabel}</strong> · 优先级：{classification.priority}
          </p>
          <p>{classification.matchingRationale}</p>
          <div className="tag-row">
            {classification.tags.map((tag) => (
              <span className="tag-pill" key={tag}>{tag}</span>
            ))}
          </div>
          <p className="follow-script">{classification.followUpScript}</p>
        </section>
      )}
    </section>
  );
}

function labelForCategory(category: HelpCategory) {
  return categoryOptions.find((option) => option.value === category)?.label ?? category;
}

function labelForHelpType(type: HelpType) {
  return helpTypeOptions.find((option) => option.value === type)?.label ?? type;
}

function stringValue(formData: FormData, key: string, fallback: string): string {
  const value = formData.get(key);
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}
