export type AidStatus =
  'draft' | 'submitted' | 'needs_materials' | 'under_review' | 'approved' | 'rejected' | 'published'

export type ProjectStatus =
  'urgent' | 'in_treatment' | 'awaiting_materials' | 'receiving_intentions' | 'completed'

export type HelpCategory = 'money' | 'materials' | 'services'

export type HelpType =
  | 'funding_intention'
  | 'medical_resource'
  | 'drug_resource'
  | 'nutrition'
  | 'accommodation'
  | 'transportation'
  | 'volunteer'
  | 'policy_consultation'
  | 'psychological_support'
  | 'propagation'
  | 'corporate_support'

export type NeedType =
  | 'treatment_cost'
  | 'medicine'
  | 'nutrition'
  | 'accommodation'
  | 'transportation'
  | 'escort'
  | 'policy_consultation'
  | 'psychological_support'
  | 'propagation'

export const NEED_TYPE_LABELS: Record<NeedType, string> = {
  treatment_cost: '治疗费用缺口',
  medicine: '药品/医疗资源',
  nutrition: '营养支持',
  accommodation: '异地住宿',
  transportation: '交通/复诊往返',
  escort: '陪诊/陪护',
  policy_consultation: '医保/救助政策咨询',
  psychological_support: '心理支持',
  propagation: '传播协助',
}

export interface ResourceNeed {
  id: string
  type: NeedType
  category: HelpCategory
  label: string
  description: string
  priority: 'low' | 'medium' | 'high'
}

export interface EvidenceItem {
  id: string
  label: string
  status: 'received' | 'missing' | 'conflicting' | 'needs_manual_check'
  note: string
}

export interface AidApplication {
  id: string
  patientAlias: string
  applicantRole: 'family' | 'patient' | 'volunteer' | 'institution_staff'
  diseaseSummary: string
  treatmentStage: string
  region: string
  expenseTotal: number
  paidAmount: number
  reimbursementEstimate: number
  remainingGap: number
  familyBurden: string
  requestedNeeds: ResourceNeed[]
  materialNotes: string[]
  evidence: EvidenceItem[]
  rawNarrative: string
  consentForInstitutionReview: boolean
  consentForDeidentifiedDisplay: boolean
  status: AidStatus
}

export interface RiskSignal {
  id: string
  category:
    | 'fraud'
    | 'privacy'
    | 'reimbursement'
    | 'missing_material'
    | 'amount_conflict'
    | 'timeline'
    | 'overstatement'
    | 'medical_boundary'
  label: string
  evidence: string
  severity: 'low' | 'medium' | 'high'
}

export interface FourDiscernmentReport {
  goodAndHarm: RiskSignal[]
  truth: RiskSignal[]
  scaleUrgency: 'low' | 'medium' | 'high'
  scaleRationale: string
  resourceGap: number
  proximity: string[]
  humanChecklist: string[]
}

export interface PublicProject {
  id: string
  slug: string
  patientAlias: string
  diseaseLabel: string
  status: ProjectStatus
  region: string
  verifiedNeed: string
  resourceGap: number
  matchedIntentions: number
  needs: ResourceNeed[]
  progress: string[]
  story: string
  evidenceSummary: string[]
  feedback: string[]
  isPublished: boolean
}

export interface DonationIntention {
  projectId?: string
  helpCategory: HelpCategory
  helpType: HelpType
  amountOrResource: string
  city: string
  contact: string
  receiptNeed: boolean
  message: string
}

export interface DonationClassification {
  priority: 'normal' | 'high'
  categoryLabel: '钱' | '物' | '服'
  matchingRationale: string
  matchedNeedLabels: string[]
  tags: string[]
  followUpScript: string
}

export const helpCategoryLabels: Record<HelpCategory, '钱' | '物' | '服'> = {
  money: '钱',
  materials: '物',
  services: '服',
}

export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('zh-CN')}元`
}
