import Link from 'next/link'

import { Button } from '../ui/Button'

interface AidApplicationFormProps {
  action?: (formData: FormData) => void | Promise<void>
  submissionId?: string
}

export function AidApplicationForm({ action, submissionId }: AidApplicationFormProps) {
  return (
    <section className="form-shell" aria-labelledby="application-title">
      <Link className="back-link" href="/projects">
        返回公开项目
      </Link>
      <div className="form-heading">
        <p className="section-label">求助申请 · 机构复核入口</p>
        <h1 id="application-title">提交求助申请</h1>
        <p>提交后进入机构后台待复核。平台只整理材料和真实需要，不处理资金，由有资质机构完成审核与后续决策。</p>
      </div>

      {submissionId && (
        <section className="success-panel" role="status">
          <h2>已提交，等待机构复核</h2>
          <p>后台记录编号：{submissionId}</p>
        </section>
      )}

      <form action={action} className="intention-form">
        <label>
          患者脱敏称呼
          <input name="patientAlias" defaultValue="患儿A" required />
        </label>
        <label>
          申请人身份
          <select name="applicantRole" defaultValue="family" required>
            <option value="family">家属</option>
            <option value="patient">本人</option>
            <option value="volunteer">志愿者</option>
            <option value="institution_staff">机构工作人员</option>
          </select>
        </label>
        <label className="span-2">
          病情摘要
          <textarea name="diseaseSummary" defaultValue="儿童血液病治疗支持" rows={3} required />
        </label>
        <label>
          治疗阶段
          <input name="treatmentStage" defaultValue="连续治疗与复诊阶段" required />
        </label>
        <label>
          地区
          <input name="region" defaultValue="华南" required />
        </label>
        <label>
          总费用
          <input name="expenseTotal" defaultValue="186000" inputMode="numeric" required />
        </label>
        <label>
          已支付金额
          <input name="paidAmount" defaultValue="76000" inputMode="numeric" required />
        </label>
        <label>
          医保/商保预估
          <input name="reimbursementEstimate" defaultValue="52000" inputMode="numeric" required />
        </label>
        <label className="span-2">
          家庭负担说明
          <textarea name="familyBurden" defaultValue="家庭主要收入来自临时务工，前期治疗已产生借款。" rows={3} required />
        </label>
        <label className="span-2">
          受助人真实需要
          <textarea
            name="requestedNeeds"
            defaultValue={'治疗费用缺口\n医保/救助政策咨询\n复诊交通协助'}
            rows={4}
            required
          />
        </label>
        <label className="span-2">
          材料说明
          <textarea name="materialNotes" defaultValue={'已有诊断摘要\n缺少最新医疗费用发票'} rows={3} required />
        </label>
        <label className="check-line">
          <input name="evidenceDiagnosis" type="checkbox" defaultChecked />
          已有诊断摘要
        </label>
        <label className="check-line">
          <input name="evidenceLatestInvoice" type="checkbox" />
          最新医疗费用发票待补充
        </label>
        <label className="span-2">
          原始叙事
          <textarea name="rawNarrative" defaultValue="公开材料需要删除学校、病房和联系方式。" rows={4} required />
        </label>
        <label className="check-line">
          <input name="consentForInstitutionReview" type="checkbox" defaultChecked />
          同意机构复核
        </label>
        <label className="check-line">
          <input name="consentForDeidentifiedDisplay" type="checkbox" defaultChecked />
          同意脱敏展示
        </label>
        <Button className="span-2" type="submit">
          提交求助申请
        </Button>
      </form>
    </section>
  )
}
