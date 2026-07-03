import Link from 'next/link'

import { NEED_TYPE_LABELS, type NeedType } from '../../domain/charity'
import { Button } from '../ui/Button'

interface AidApplicationFormProps {
  action?: (formData: FormData) => void | Promise<void>
  submissionId?: string
}

const PUBLIC_NEED_TYPES: NeedType[] = [
  'treatment_cost',
  'medicine',
  'nutrition',
  'accommodation',
  'transportation',
  'escort',
  'policy_consultation',
  'psychological_support',
]

export function AidApplicationForm({ action, submissionId }: AidApplicationFormProps) {
  return (
    <section className="form-shell" aria-labelledby="application-title">
      <Link className="back-link" href="/projects">
        返回公开项目
      </Link>
      <div className="form-heading">
        <p className="section-label">求助申请 · 机构复核入口</p>
        <h1 id="application-title">提交求助申请</h1>
        <p>
          提交后进入机构后台待复核。平台只整理材料和真实需要，不处理资金，由有资质机构完成审核与后续决策。
        </p>
      </div>

      {submissionId && (
        <section className="success-panel" role="status">
          <h2>已提交，等待机构复核</h2>
          <p>后台记录编号：{submissionId}</p>
        </section>
      )}

      <form action={action} className="intention-form" encType="multipart/form-data">
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
          病情与治疗情况
          <textarea
            name="conditionAndTreatment"
            defaultValue="儿童血液病治疗中，近期需要连续复诊和用药。"
            rows={4}
            required
          />
        </label>
        <label>
          所在城市/地区
          <input name="region" defaultValue="广州" required />
        </label>
        <label>
          目前最主要的费用缺口/压力
          <textarea
            name="expensePressure"
            defaultValue="后续复诊和药费压力较大，已向亲友借款。"
            rows={4}
            required
          />
        </label>
        <label className="span-2">
          家庭情况与求助原因
          <textarea
            name="familySituation"
            defaultValue="父亲临时务工，母亲主要陪护，家庭收入不稳定。"
            rows={4}
            required
          />
        </label>
        <fieldset className="span-2 need-fieldset">
          <legend>需要哪些帮助</legend>
          <div className="need-options">
            {PUBLIC_NEED_TYPES.map((type) => (
              <label key={type}>
                <input
                  defaultChecked={type === 'treatment_cost' || type === 'policy_consultation'}
                  name="needTypes"
                  type="checkbox"
                  value={type}
                />
                {NEED_TYPE_LABELS[type]}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="span-2 upload-field">
          <label htmlFor="materialFiles">上传证明材料</label>
          <p>可上传诊断摘要、医疗费用发票、医保或商保回执等材料，提交后仅供机构后台复核。</p>
          <input
            accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*"
            id="materialFiles"
            multiple
            name="materialFiles"
            type="file"
          />
        </div>
        <label className="span-2">
          补充说明
          <textarea
            name="additionalNotes"
            defaultValue="希望公开时隐去学校信息和详细住址。"
            rows={4}
            required
          />
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
