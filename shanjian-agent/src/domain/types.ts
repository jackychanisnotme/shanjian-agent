export type AidStatus =
  | 'draft'
  | 'needs_materials'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'published';

export type ProjectStatus =
  | 'urgent'
  | 'in_treatment'
  | 'awaiting_materials'
  | 'receiving_intentions'
  | 'completed';

export type HelpCategory = 'money' | 'materials' | 'services';

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
  | 'corporate_support';

export type NeedType =
  | 'treatment_cost'
  | 'medicine'
  | 'nutrition'
  | 'accommodation'
  | 'transportation'
  | 'escort'
  | 'policy_consultation'
  | 'psychological_support'
  | 'propagation';

export interface ResourceNeed {
  id: string;
  type: NeedType;
  category: HelpCategory;
  label: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

export interface EvidenceItem {
  id: string;
  label: string;
  status: 'received' | 'missing' | 'conflicting' | 'needs_manual_check';
  note: string;
}

export interface AidApplication {
  id: string;
  patientAlias: string;
  applicantRole: 'family' | 'patient' | 'volunteer' | 'institution_staff';
  disease: string;
  treatmentStage: string;
  hospitalRegion: string;
  expenseTotal: number;
  paidAmount: number;
  reimbursementEstimate: number;
  remainingGap: number;
  familyBurden: string;
  requestedNeeds: ResourceNeed[];
  materialNotes: string[];
  evidence: EvidenceItem[];
  rawNarrative: string;
  consentForInstitutionReview: boolean;
  consentForDeidentifiedDisplay: boolean;
  status: AidStatus;
}

export interface MissingMaterial {
  id: string;
  label: string;
  reason: string;
  severity: 'low' | 'medium' | 'high';
}

export interface RiskSignal {
  id: string;
  category:
    | 'fraud'
    | 'privacy'
    | 'amount_conflict'
    | 'timeline'
    | 'overstatement'
    | 'medical_boundary';
  label: string;
  evidence: string;
  severity: 'low' | 'medium' | 'high';
}

export interface CaseFile {
  id: string;
  summary: string;
  normalizedExpense: {
    total: number;
    paid: number;
    reimbursementEstimate: number;
    remainingGap: number;
  };
  requestedNeeds: ResourceNeed[];
  missingMaterials: MissingMaterial[];
  consistencyHints: string[];
  privacyHints: string[];
}

export interface FourDiscernmentReport {
  goodAndHarm: RiskSignal[];
  truth: RiskSignal[];
  scale: {
    urgency: 'low' | 'medium' | 'high';
    resourceGap: number;
    rationale: string;
  };
  proximity: string[];
  humanChecklist: string[];
}

export type ReviewDecision = 'request_materials' | 'reject' | 'approve_display' | 'offline_follow_up';

export interface PublicProject {
  id: string;
  patientAlias: string;
  disease: string;
  status: ProjectStatus;
  region: string;
  verifiedNeed: string;
  resourceGap: number;
  matchedIntentions: number;
  needs: ResourceNeed[];
  progress: string[];
  story: string;
  evidenceSummary: string[];
  feedback: string[];
}

export interface DonationIntention {
  id: string;
  projectId: string;
  helpCategory: HelpCategory;
  helpType: HelpType;
  amountOrResource: string;
  city: string;
  contact: string;
  receiptNeed: boolean;
  message: string;
  status: 'new' | 'matched' | 'contacted' | 'closed';
}

export interface DonationClassification {
  priority: 'normal' | 'high';
  categoryLabel: '钱' | '物' | '服';
  matchingRationale: string;
  matchedNeedLabels: string[];
  tags: string[];
  followUpScript: string;
}

export interface ProjectQuestion {
  id: string;
  question: string;
}

export interface ProjectAnswer {
  question: string;
  answer: string;
  sourceLabels: string[];
}

export interface FollowUpTask {
  id: string;
  intentionId: string;
  projectId: string;
  title: string;
  owner: string;
  status: 'todo' | 'done';
}

export interface FeedbackReport {
  projectId: string;
  draft: string;
  requiresInstitutionReview: boolean;
}
