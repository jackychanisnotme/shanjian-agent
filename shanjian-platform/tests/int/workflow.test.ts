import { beforeAll, describe, expect, it } from 'vitest'
import { getPayload, type Payload } from 'payload'

import config from '../../src/payload.config'
import {
  createAidApplicationFromForm,
  createDonationIntentionFromForm,
  generateCaseReview,
  generatePublicProject,
} from '../../src/server/workflow'

let payload: Payload

describe('public submissions and institutional workflow', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  it('creates aid applications in the Payload backend from public form data', async () => {
    const created = await createAidApplicationFromForm(payload, aidApplicationFormData('入库测试A'))

    expect(created.id).toBeDefined()
    expect(created.status).toBe('submitted')
    expect(created.remainingGap).toBe(58000)

    const found = await payload.findByID({
      collection: 'aid-applications',
      id: created.id,
    })
    expect(found.patientAlias).toContain('入库测试A')
  })

  it('creates general-pool donation intentions without a project', async () => {
    const created = await createDonationIntentionFromForm(payload, donationIntentionFormData())

    expect(created.id).toBeDefined()
    expect(created.status).toBe('new')
    expect(created.project).toBeNull()
    expect(created.followUpScript).toContain('机构工作人员会先匹配具体项目')
  })

  it('generates a case review idempotently from one aid application', async () => {
    const application = await createAidApplicationFromForm(payload, aidApplicationFormData('审核测试B'))

    const first = await generateCaseReview(payload, application.id)
    const second = await generateCaseReview(payload, application.id)

    expect(first.created).toBe(true)
    expect(second.created).toBe(false)
    expect(second.review.id).toBe(first.review.id)
    expect(relationshipId(first.review.application)).toBe(application.id)
  })

  it('generates an unpublished public project only after approval', async () => {
    const application = await createAidApplicationFromForm(payload, aidApplicationFormData('公开测试C'))
    const { review } = await generateCaseReview(payload, application.id)

    await expect(generatePublicProject(payload, review.id)).rejects.toThrow('批准展示')

    await payload.update({
      collection: 'case-reviews',
      id: review.id,
      data: {
        decision: 'approve_display',
      },
    })

    const first = await generatePublicProject(payload, review.id)
    const second = await generatePublicProject(payload, review.id)

    expect(first.created).toBe(true)
    expect(second.created).toBe(false)
    expect(second.project.id).toBe(first.project.id)
    expect(relationshipId(first.project.application)).toBe(application.id)
    expect(first.project.isPublished).toBe(false)
  })
})

function relationshipId(value: number | { id: number }): number {
  return typeof value === 'object' ? value.id : value
}

function aidApplicationFormData(label: string): FormData {
  const formData = new FormData()
  formData.set('patientAlias', `${label}-${Date.now()}`)
  formData.set('applicantRole', 'family')
  formData.set('diseaseSummary', '儿童血液病治疗支持')
  formData.set('treatmentStage', '连续治疗与复诊阶段')
  formData.set('region', '华南')
  formData.set('expenseTotal', '186000')
  formData.set('paidAmount', '76000')
  formData.set('reimbursementEstimate', '52000')
  formData.set('familyBurden', '家庭主要收入来自临时务工，前期治疗已产生借款。')
  formData.set('requestedNeeds', '治疗费用缺口\n医保/救助政策咨询\n复诊交通协助')
  formData.set('materialNotes', '已有诊断摘要\n缺少最新医疗费用发票')
  formData.set('evidenceDiagnosis', 'on')
  formData.set('evidenceLatestInvoice', 'missing')
  formData.set('rawNarrative', '公开材料需要删除学校、病房和联系方式。')
  formData.set('consentForInstitutionReview', 'on')
  formData.set('consentForDeidentifiedDisplay', 'on')
  return formData
}

function donationIntentionFormData(): FormData {
  const formData = new FormData()
  formData.set('helpCategory', 'services')
  formData.set('helpType', 'volunteer')
  formData.set('amountOrResource', '每周可陪诊半天')
  formData.set('city', '广州')
  formData.set('contact', 'contact@example.org')
  formData.set('message', '希望由机构匹配合适项目')
  return formData
}
