import type { Payload } from 'payload'

import {
  type AidApplication as DomainAidApplication,
  type DonationIntention,
  type HelpCategory,
  type NeedType,
  type ResourceNeed,
} from '../domain/charity'
import { buildFourDiscernmentReport } from '../domain/discernment'
import { classifyDonationIntention } from '../domain/intentions'
import type {
  AidApplication as PayloadAidApplication,
  CaseReview,
  DonationIntention as PayloadDonationIntention,
  PublicProject,
} from '../payload-types'
import { asEvidenceItems, asResourceNeeds, asStringArray, payloadPublicProjectToDomain } from './publicProjects'

type WorkflowPayload = Pick<Payload, 'create' | 'find' | 'findByID' | 'update'>

export async function createAidApplicationFromForm(
  payload: WorkflowPayload,
  formData: FormData,
): Promise<PayloadAidApplication> {
  const expenseTotal = numberField(formData, 'expenseTotal')
  const paidAmount = numberField(formData, 'paidAmount')
  const reimbursementEstimate = numberField(formData, 'reimbursementEstimate')
  const remainingGap = Math.max(0, expenseTotal - paidAmount - reimbursementEstimate)

  return payload.create({
    collection: 'aid-applications',
    data: {
      patientAlias: textField(formData, 'patientAlias', '未命名求助申请'),
      applicantRole: selectField(formData, 'applicantRole', [
        'family',
        'patient',
        'volunteer',
        'institution_staff',
      ]),
      diseaseSummary: textField(formData, 'diseaseSummary', '待机构补充病情摘要'),
      treatmentStage: textField(formData, 'treatmentStage', '待机构确认治疗阶段'),
      region: textField(formData, 'region', '未填写地区'),
      expenseTotal,
      paidAmount,
      reimbursementEstimate,
      remainingGap,
      familyBurden: textField(formData, 'familyBurden', '待机构访谈确认家庭负担'),
      requestedNeeds: parseNeeds(textField(formData, 'requestedNeeds', '治疗费用缺口')),
      materialNotes: splitLines(textField(formData, 'materialNotes', '待补充材料说明')),
      evidence: buildEvidence(formData),
      rawNarrative: textField(formData, 'rawNarrative', '待机构补充原始叙事'),
      consentForInstitutionReview: formData.has('consentForInstitutionReview'),
      consentForDeidentifiedDisplay: formData.has('consentForDeidentifiedDisplay'),
      status: 'submitted',
    },
  })
}

export async function createDonationIntentionFromForm(
  payload: WorkflowPayload,
  formData: FormData,
): Promise<PayloadDonationIntention> {
  const projectId = optionalTextField(formData, 'projectId')
  const projects = projectId
    ? [
        payloadPublicProjectToDomain(
          await payload.findByID({
            collection: 'public-projects',
            depth: 0,
            id: projectId,
          }),
        ),
      ]
    : []
  const intention: DonationIntention = {
    projectId: projectId ? String(projectId) : undefined,
    helpCategory: selectField(formData, 'helpCategory', ['money', 'materials', 'services']),
    helpType: selectField(formData, 'helpType', [
      'funding_intention',
      'medical_resource',
      'drug_resource',
      'nutrition',
      'accommodation',
      'transportation',
      'volunteer',
      'policy_consultation',
      'psychological_support',
      'propagation',
      'corporate_support',
    ]),
    amountOrResource: textField(formData, 'amountOrResource', '愿意由机构联系确认帮助方式'),
    city: textField(formData, 'city', '未填写地区'),
    contact: textField(formData, 'contact', '未填写联系方式'),
    receiptNeed: formData.has('receiptNeed'),
    message: textField(formData, 'message', '希望由机构匹配合适项目。'),
  }
  const classification = classifyDonationIntention(intention, projects)

  return payload.create({
    collection: 'donation-intentions',
    data: {
      project: projectId ? Number(projectId) : null,
      helpCategory: intention.helpCategory,
      helpType: intention.helpType,
      amountOrResource: intention.amountOrResource,
      city: intention.city,
      contact: intention.contact,
      receiptNeed: intention.receiptNeed,
      message: intention.message,
      classification: classification.categoryLabel,
      matchedNeedLabels: classification.matchedNeedLabels,
      followUpScript: classification.followUpScript,
      status: 'new',
    },
  })
}

export async function generateCaseReview(
  payload: WorkflowPayload,
  applicationId: number | string,
): Promise<{ created: boolean; review: CaseReview }> {
  const existing = await payload.find({
    collection: 'case-reviews',
    depth: 0,
    limit: 1,
    where: {
      application: {
        equals: applicationId,
      },
    },
  })
  const existingReview = existing.docs[0]
  if (existingReview) {
    return { created: false, review: existingReview }
  }

  const application = await payload.findByID({
    collection: 'aid-applications',
    depth: 0,
    id: applicationId,
  })
  const report = buildFourDiscernmentReport(payloadAidApplicationToDomain(application))
  const review = await payload.create({
    collection: 'case-reviews',
    data: {
      reviewTitle: `${application.patientAlias} 四辨审核`,
      application: Number(application.id),
      goodAndHarm: report.goodAndHarm,
      truth: report.truth,
      scaleUrgency: report.scaleUrgency,
      scaleRationale: report.scaleRationale,
      resourceGap: report.resourceGap,
      proximity: report.proximity,
      humanChecklist: report.humanChecklist,
      reviewSource: 'deterministic',
    },
  })

  return { created: true, review }
}

export async function generatePublicProject(
  payload: WorkflowPayload,
  reviewId: number | string,
): Promise<{ created: boolean; project: PublicProject }> {
  const review = await payload.findByID({
    collection: 'case-reviews',
    depth: 0,
    id: reviewId,
  })
  if (review.decision !== 'approve_display') {
    throw new Error('只有人工决策为“批准展示”的四辨审核才能生成公开项目草稿。')
  }

  const applicationId = relationshipId(review.application)
  const existing = await payload.find({
    collection: 'public-projects',
    depth: 0,
    limit: 1,
    where: {
      application: {
        equals: applicationId,
      },
    },
  })
  const existingProject = existing.docs[0]
  if (existingProject) {
    return { created: false, project: existingProject }
  }

  const application =
    typeof review.application === 'object'
      ? review.application
      : await payload.findByID({
          collection: 'aid-applications',
          depth: 0,
          id: applicationId,
        })
  const needs = asResourceNeeds(application.requestedNeeds)
  const project = await payload.create({
    collection: 'public-projects',
    data: {
      application: applicationId,
      slug: `aid-${applicationId}`,
      patientAlias: application.patientAlias,
      diseaseLabel: application.diseaseSummary,
      region: application.region,
      status: 'receiving_intentions',
      verifiedNeed: buildVerifiedNeed(needs, review.scaleRationale),
      resourceGap: review.resourceGap,
      matchedIntentions: 0,
      needs,
      progress: ['机构已完成四辨审核', '等待公开发布前人工复核'],
      story: buildProjectStory(application),
      evidenceSummary: buildEvidenceSummary(application),
      feedback: ['暂无公开反馈'],
      isPublished: false,
    },
  })

  return { created: true, project }
}

export function payloadAidApplicationToDomain(application: PayloadAidApplication): DomainAidApplication {
  return {
    id: String(application.id),
    patientAlias: application.patientAlias,
    applicantRole: application.applicantRole,
    diseaseSummary: application.diseaseSummary,
    treatmentStage: application.treatmentStage,
    region: application.region,
    expenseTotal: application.expenseTotal,
    paidAmount: application.paidAmount,
    reimbursementEstimate: application.reimbursementEstimate,
    remainingGap: application.remainingGap,
    familyBurden: application.familyBurden,
    requestedNeeds: asResourceNeeds(application.requestedNeeds),
    materialNotes: asStringArray(application.materialNotes),
    evidence: asEvidenceItems(application.evidence),
    rawNarrative: application.rawNarrative,
    consentForInstitutionReview: Boolean(application.consentForInstitutionReview),
    consentForDeidentifiedDisplay: Boolean(application.consentForDeidentifiedDisplay),
    status: application.status,
  }
}

function textField(formData: FormData, name: string, fallback: string): string {
  const value = formData.get(name)
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

function optionalTextField(formData: FormData, name: string): string | undefined {
  const value = formData.get(name)
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function numberField(formData: FormData, name: string): number {
  const value = Number(textField(formData, name, '0'))
  return Number.isFinite(value) && value > 0 ? value : 0
}

function selectField<T extends string>(formData: FormData, name: string, values: T[]): T {
  const value = formData.get(name)
  return values.includes(value as T) ? (value as T) : values[0]
}

function splitLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

function parseNeeds(value: string): ResourceNeed[] {
  return splitLines(value).map((label, index) => {
    const type = inferNeedType(label)
    return {
      id: `need-${index + 1}`,
      type,
      category: needCategory(type),
      label,
      description: `${label}，由机构工作人员复核后匹配资源。`,
      priority: index === 0 ? 'high' : 'medium',
    }
  })
}

function inferNeedType(label: string): NeedType {
  if (/药|医疗资源/.test(label)) return 'medicine'
  if (/营养/.test(label)) return 'nutrition'
  if (/住宿/.test(label)) return 'accommodation'
  if (/交通/.test(label)) return 'transportation'
  if (/陪诊|陪护/.test(label)) return 'escort'
  if (/政策|医保|商保|救助/.test(label)) return 'policy_consultation'
  if (/心理/.test(label)) return 'psychological_support'
  if (/传播/.test(label)) return 'propagation'
  return 'treatment_cost'
}

function needCategory(type: NeedType): HelpCategory {
  if (type === 'treatment_cost') return 'money'
  if (type === 'medicine' || type === 'nutrition' || type === 'accommodation') return 'materials'
  return 'services'
}

function buildEvidence(formData: FormData) {
  return [
    {
      id: 'evidence-diagnosis',
      label: '诊断摘要',
      status: formData.has('evidenceDiagnosis') ? 'received' : 'missing',
      note: '由申请人勾选提交，需机构复核原始材料。',
    },
    {
      id: 'evidence-latest-invoice',
      label: '最新医疗费用发票',
      status: formData.has('evidenceLatestInvoice') ? 'missing' : 'needs_manual_check',
      note: '费用凭证需由机构工作人员线下核验。',
    },
  ]
}

function relationshipId(value: number | string | { id: number | string }): number {
  const id = typeof value === 'object' ? value.id : value
  return Number(id)
}

function buildVerifiedNeed(needs: ResourceNeed[], fallback: string): string {
  return needs.length > 0 ? needs.map((need) => need.label).join('、') : fallback
}

function buildProjectStory(application: PayloadAidApplication): string {
  return `${application.patientAlias}的求助申请已通过机构四辨审核草稿整理。公开内容需继续移除可识别信息，并由机构确认后手动发布。`
}

function buildEvidenceSummary(application: PayloadAidApplication): string[] {
  const evidence = asEvidenceItems(application.evidence)
  if (evidence.length === 0) return ['证据材料需由机构工作人员复核']

  return evidence.map((item) => `${item.label}：${item.note}`)
}
