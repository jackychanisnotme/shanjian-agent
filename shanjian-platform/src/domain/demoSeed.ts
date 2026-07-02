import type { AidApplication, PublicProject, ResourceNeed } from './charity'

const leukemiaNeeds: ResourceNeed[] = [
  {
    id: 'need-treatment-cost',
    type: 'treatment_cost',
    category: 'money',
    label: '治疗费用缺口',
    description: '连续治疗阶段仍有费用缺口，需由机构核实票据后合规跟进。',
    priority: 'high',
  },
  {
    id: 'need-policy-consultation',
    type: 'policy_consultation',
    category: 'services',
    label: '医保/救助政策咨询',
    description: '需要志愿者或机构工作人员协助确认医保、商保和属地救助政策。',
    priority: 'high',
  },
  {
    id: 'need-transportation',
    type: 'transportation',
    category: 'services',
    label: '复诊交通协助',
    description: '复诊期间需要同城交通和陪诊时间协调。',
    priority: 'medium',
  },
]

export const demoAidApplication: AidApplication = {
  id: 'app-leukemia-child-a',
  patientAlias: '患儿A',
  applicantRole: 'family',
  diseaseSummary: '急性淋巴细胞白血病治疗支持',
  treatmentStage: '连续治疗与复诊阶段',
  region: '华南县域医院转诊至省会医院',
  expenseTotal: 186000,
  paidAmount: 76000,
  reimbursementEstimate: 52000,
  remainingGap: 58000,
  familyBurden: '家庭主要收入来自临时务工，前期治疗已产生借款，需机构核实属地证明。',
  requestedNeeds: leukemiaNeeds,
  materialNotes: [
    '已有模拟诊断摘要和住院费用清单',
    '缺少最新医疗费用发票',
    '医保/商保报销状态仍为预估',
    '监护关系证明未随材料提交',
  ],
  evidence: [
    {
      id: 'evidence-diagnosis',
      label: '诊断摘要',
      status: 'received',
      note: '模拟资料，显示血液病治疗阶段。',
    },
    {
      id: 'evidence-latest-invoice',
      label: '最新医疗费用发票',
      status: 'missing',
      note: '无法确认当前费用缺口。',
    },
    {
      id: 'evidence-reimbursement',
      label: '医保/商保报销确认',
      status: 'needs_manual_check',
      note: '当前为预估金额，需要回执或机构访谈确认。',
    },
  ],
  rawNarrative:
    '孩子还在治疗，我们已经提交了诊断摘要和费用清单，但最新发票、报销确认和监护关系证明还没整理好。公开材料需要删除学校、病房和联系方式。',
  consentForInstitutionReview: true,
  consentForDeidentifiedDisplay: true,
  status: 'submitted',
}

export const seedPublicProjects: PublicProject[] = [
  {
    id: 'project-leukemia-child-a',
    slug: 'leukemia-child-a',
    patientAlias: '患儿A',
    diseaseLabel: '儿童血液病治疗支持',
    status: 'receiving_intentions',
    region: '华南',
    verifiedNeed: '连续治疗阶段费用缺口、政策咨询和复诊交通协助',
    resourceGap: 58000,
    matchedIntentions: 3,
    needs: leukemiaNeeds,
    progress: ['机构完成初步材料整理', '等待补充最新发票和报销确认', '公开展示已完成脱敏处理'],
    story:
      '患儿A正在接受规范治疗，家庭已承担前期费用并申请医保报销。机构正在核实最新费用凭证，并收集社会帮助意向用于后续合规跟进。',
    evidenceSummary: ['诊断摘要为模拟资料', '费用缺口需人工复核最新票据', '公开内容已移除可识别地点信息'],
    feedback: ['机构将根据实际跟进情况生成反馈草稿', '反馈发布前需人工复核'],
    isPublished: true,
  },
  {
    id: 'project-rehab-b',
    slug: 'rehab-b',
    patientAlias: '患者B',
    diseaseLabel: '康复期复诊与照护支持',
    status: 'in_treatment',
    region: '华东',
    verifiedNeed: '复诊交通、短期住宿和政策咨询',
    resourceGap: 12000,
    matchedIntentions: 1,
    needs: [
      {
        id: 'need-accommodation-b',
        type: 'accommodation',
        category: 'materials',
        label: '短期住宿支持',
        description: '复诊周期需要短期住宿资源，由机构确认适配。',
        priority: 'medium',
      },
    ],
    progress: ['机构访谈完成', '材料补充中'],
    story: '患者B处于康复复诊阶段，机构正在确认住宿和交通资源。',
    evidenceSummary: ['复诊安排为模拟资料', '住宿支持需线下核实'],
    feedback: ['暂无公开反馈'],
    isPublished: true,
  },
]
