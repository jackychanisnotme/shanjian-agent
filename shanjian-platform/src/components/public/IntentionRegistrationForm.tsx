import Link from 'next/link'

import type { HelpCategory, HelpType, PublicProject } from '../../domain/charity'
import { Button } from '../ui/Button'

interface IntentionRegistrationFormProps {
  action?: (formData: FormData) => void | Promise<void>
  project?: PublicProject
  submissionId?: string
}

const helpCategories: Array<{ label: string; value: HelpCategory }> = [
  { label: '钱', value: 'money' },
  { label: '物', value: 'materials' },
  { label: '服', value: 'services' },
]

const helpTypes: Array<{ label: string; value: HelpType }> = [
  { label: '资金支持意向', value: 'funding_intention' },
  { label: '医疗资源', value: 'medical_resource' },
  { label: '药品资源', value: 'drug_resource' },
  { label: '营养支持', value: 'nutrition' },
  { label: '住宿支持', value: 'accommodation' },
  { label: '交通支持', value: 'transportation' },
  { label: '陪诊志愿', value: 'volunteer' },
  { label: '政策咨询', value: 'policy_consultation' },
  { label: '心理支持', value: 'psychological_support' },
  { label: '传播支持', value: 'propagation' },
  { label: '企业支持', value: 'corporate_support' },
]

export function IntentionRegistrationForm({ action, project, submissionId }: IntentionRegistrationFormProps) {
  return (
    <section className="form-shell" aria-labelledby="intention-title">
      {project ? (
        <Link className="back-link" href={`/projects/${project.slug}`}>
          返回项目
        </Link>
      ) : (
        <Link className="back-link" href="/projects">
          返回公开项目
        </Link>
      )}
      <div className="form-heading">
        <p className="section-label">
          {project ? `${project.patientAlias} · ${project.verifiedNeed}` : '通用意向池'}
        </p>
        <h1 id="intention-title">登记帮助意向</h1>
        <p>
          {project
            ? '平台仅登记帮助意向，不在平台内收款。后续由有资质机构工作人员确认支持方式、票据需求、隐私边界和项目反馈。'
            : '平台仅登记帮助意向，不在平台内收款。机构工作人员会在后台匹配具体项目，再确认支持方式、隐私边界和项目反馈。'}
        </p>
      </div>

      {submissionId && (
        <section className="success-panel" role="status">
          <h2>已提交，等待机构跟进</h2>
          <p>后台记录编号：{submissionId}</p>
        </section>
      )}

      <form action={action} className="intention-form">
        {project && <input name="projectId" type="hidden" value={project.id} />}
        <label>
          帮助类别
          <select name="helpCategory" defaultValue="money">
            {helpCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          帮助类型
          <select name="helpType" defaultValue="funding_intention">
            {helpTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>
        <label className="span-2">
          金额或资源说明
          <textarea name="amountOrResource" defaultValue="愿意支持5000元，由机构联系确认" rows={3} />
        </label>
        <label>
          城市/地区
          <input name="city" defaultValue="深圳" />
        </label>
        <label>
          联系方式
          <input name="contact" defaultValue="contact@example.org" />
        </label>
        <label className="check-line span-2">
          <input name="receiptNeed" type="checkbox" defaultChecked />
          需要机构提供票据/项目信息说明
        </label>
        <label className="span-2">
          留言
          <textarea name="message" defaultValue="希望了解项目进展，并尊重受助人真实需要。" rows={3} />
        </label>
        <Button className="span-2" type="submit">
          提交帮助意向
        </Button>
      </form>
    </section>
  )
}
