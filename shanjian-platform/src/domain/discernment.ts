import type { AidApplication, FourDiscernmentReport, RiskSignal } from './charity'

export function buildFourDiscernmentReport(application: AidApplication): FourDiscernmentReport {
  const goodAndHarm: RiskSignal[] = [
    {
      id: 'privacy-public-copy',
      category: 'privacy',
      label: '公开表达存在隐私暴露风险',
      evidence: '原始叙事提示需要删除学校、病房、联系方式等可识别信息。',
      severity: 'high',
    },
    {
      id: 'medical-boundary',
      category: 'medical_boundary',
      label: '不得提供诊疗建议',
      evidence: '系统只能整理救助资料，治疗方案必须由医疗专业人员判断。',
      severity: 'medium',
    },
  ]

  const truth: RiskSignal[] = [
    {
      id: 'missing-latest-invoice',
      category: 'missing_material',
      label: '最新费用凭证缺失',
      evidence: '材料备注显示缺少最新医疗费用发票，费用缺口需要人工复核。',
      severity: 'high',
    },
    {
      id: 'reimbursement-unclear',
      category: 'reimbursement',
      label: '医保/商保报销状态不清',
      evidence: '当前只有报销预估，没有确认回执或机构访谈记录。',
      severity: 'high',
    },
    {
      id: 'guardian-proof-missing',
      category: 'missing_material',
      label: '监护关系证明未提交',
      evidence: '儿童大病救助需要确认申请人与患儿关系。',
      severity: 'medium',
    },
  ]

  return {
    goodAndHarm,
    truth,
    scaleUrgency: application.remainingGap > 50000 ? 'high' : 'medium',
    scaleRationale: '处于连续治疗或复诊阶段，费用缺口和关键证明会影响机构后续跟进优先级。',
    resourceGap: application.remainingGap,
    proximity: [
      '联系医院社工核实治疗阶段',
      '联系属地民政确认家庭负担',
      '匹配同城政策咨询志愿者',
      '匹配陪诊和交通志愿者',
    ],
    humanChecklist: [
      '人工核对最新发票与费用清单金额是否一致',
      '确认医保/商保报销状态',
      '核验监护关系证明',
      '删除公开材料中的学校、病房、电话和详细地址',
      '确认是否已有其他公开募捐或救助渠道',
      '由机构工作人员作出最终救助和展示决定',
    ],
  }
}
