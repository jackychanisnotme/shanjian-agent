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

  it('uploads support files and links them into aid application review fields', async () => {
    const formData = aidApplicationFormData('上传测试D')
    withMaterialFiles(formData, [
      {
        arrayBuffer: async () => new TextEncoder().encode('diagnosis summary').buffer,
        name: '诊断摘要.pdf',
        size: 17,
        type: 'application/pdf',
      },
    ])

    const created = await createAidApplicationFromForm(payload, formData)

    expect(created.materialNotes).toContain('已上传证明材料：诊断摘要.pdf')
    expect(created.evidence).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'uploaded-material-1',
          label: '上传材料：诊断摘要.pdf',
          status: 'received',
        }),
      ]),
    )
    expect((created as { uploadedMaterials?: unknown[] }).uploadedMaterials).toHaveLength(1)
    expect(JSON.stringify(created.requestedNeeds)).toContain('已随申请上传证明材料')
  })

  it('maps the simplified public aid application form into backend review fields', async () => {
    const formData = simplifiedAidApplicationFormData('精简测试E')
    withMaterialFiles(formData, [
      {
        arrayBuffer: async () => new TextEncoder().encode('invoice image').buffer,
        name: '费用票据.pdf',
        size: 13,
        type: 'application/pdf',
      },
    ])

    const created = await createAidApplicationFromForm(payload, formData)

    expect(created.id).toBeDefined()
    expect(created.status).toBe('submitted')
    expect(created.diseaseSummary).toContain('儿童血液病治疗中')
    expect(created.treatmentStage).toBe('待机构复核治疗阶段')
    expect(created.expenseTotal).toBe(0)
    expect(created.remainingGap).toBe(0)
    expect(created.familyBurden).toContain('父亲临时务工')
    expect(created.rawNarrative).toContain('希望公开时隐去学校信息')
    expect(created.requestedNeeds).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'treatment_cost',
          label: '治疗费用缺口',
        }),
        expect.objectContaining({
          type: 'policy_consultation',
          label: '医保/救助政策咨询',
        }),
      ]),
    )
    expect(created.materialNotes).toEqual(
      expect.arrayContaining([
        expect.stringContaining('费用压力说明：后续复诊和药费压力较大'),
        '已上传证明材料：费用票据.pdf',
      ]),
    )
    expect(created.evidence).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: '上传材料：费用票据.pdf',
          status: 'received',
        }),
      ]),
    )
  })

  it('creates general-pool donation intentions without a project', async () => {
    const created = await createDonationIntentionFromForm(payload, donationIntentionFormData())

    expect(created.id).toBeDefined()
    expect(created.status).toBe('new')
    expect(created.project).toBeNull()
    expect(created.followUpScript).toContain('机构工作人员会先匹配具体项目')
  })

  it('generates a case review idempotently from one aid application', async () => {
    const application = await createAidApplicationFromForm(
      payload,
      aidApplicationFormData('审核测试B'),
    )

    const first = await generateCaseReview(payload, application.id)
    const second = await generateCaseReview(payload, application.id)

    expect(first.created).toBe(true)
    expect(second.created).toBe(false)
    expect(second.review.id).toBe(first.review.id)
    expect(relationshipId(first.review.application)).toBe(application.id)
    expect(first.review).toMatchObject({
      goodAndHarm: [],
      humanChecklist: [],
      proximity: [],
      resourceGap: 0,
      scaleRationale: '',
      reviewSource: 'manual',
      truth: [],
    })
  })

  it('generates an unpublished public project only after approval', async () => {
    const application = await createAidApplicationFromForm(
      payload,
      aidApplicationFormData('公开测试C'),
    )
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

function simplifiedAidApplicationFormData(label: string): FormData {
  const formData = new FormData()
  formData.set('patientAlias', `${label}-${Date.now()}`)
  formData.set('applicantRole', 'family')
  formData.set('region', '广州')
  formData.set('conditionAndTreatment', '儿童血液病治疗中，近期需要连续复诊和用药。')
  formData.set('expensePressure', '后续复诊和药费压力较大，已向亲友借款。')
  formData.set('familySituation', '父亲临时务工，母亲主要陪护，家庭收入不稳定。')
  formData.append('needTypes', 'treatment_cost')
  formData.append('needTypes', 'policy_consultation')
  formData.set('additionalNotes', '希望公开时隐去学校信息和详细住址。')
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

function withMaterialFiles(
  formData: FormData,
  files: Array<{
    arrayBuffer: () => Promise<ArrayBuffer>
    name: string
    size: number
    type: string
  }>,
): FormData {
  const originalGetAll = formData.getAll.bind(formData)
  formData.getAll = (name: string) =>
    name === 'materialFiles' ? (files as unknown as FormDataEntryValue[]) : originalGetAll(name)
  return formData
}
