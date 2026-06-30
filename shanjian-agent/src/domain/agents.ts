import { seedPublicProjects } from './demoData';
import type {
  AidApplication,
  CaseFile,
  DonationClassification,
  DonationIntention,
  FourDiscernmentReport,
  HelpCategory,
  MissingMaterial,
  ProjectAnswer,
  PublicProject,
  ResourceNeed,
} from './types';

const categoryLabels: Record<HelpCategory, '钱' | '物' | '服'> = {
  money: '钱',
  materials: '物',
  services: '服',
};

export function structureAidApplication(application: AidApplication): CaseFile {
  const missingMaterials: MissingMaterial[] = [
    {
      id: 'missing-latest-invoice',
      label: '最新医疗费用发票',
      reason: '材料备注显示最新发票缺失，无法确认当前费用缺口。',
      severity: 'high',
    },
    {
      id: 'missing-guardian-proof',
      label: '监护关系证明',
      reason: '大病儿童救助需要确认申请人与患儿关系。',
      severity: 'medium',
    },
    {
      id: 'missing-reimbursement-status',
      label: '医保/商保报销状态确认',
      reason: '报销预估不完整，会影响真实缺口判断。',
      severity: 'high',
    },
  ];

  return {
    id: `case-file-${application.id}`,
    summary:
      `${application.patientAlias}处于${application.treatmentStage}，` +
      `已支付${formatCurrency(application.paidAmount)}，预计报销${formatCurrency(application.reimbursementEstimate)}，` +
      `当前费用缺口约${formatCurrency(application.remainingGap)}。`,
    normalizedExpense: {
      total: application.expenseTotal,
      paid: application.paidAmount,
      reimbursementEstimate: application.reimbursementEstimate,
      remainingGap: application.remainingGap,
    },
    requestedNeeds: application.requestedNeeds,
    missingMaterials,
    consistencyHints: [
      '费用总额、已支付、报销预估与剩余缺口需要用最新票据复核。',
      '家庭负担说明应由属地民政或机构访谈记录补强。',
    ],
    privacyHints: [
      '公开材料不得出现学校、病房、电话、详细地址或可识别照片。',
      'demo 仅使用虚构/脱敏材料，不上传真实患者隐私数据。',
    ],
  };
}

export function runFourDiscernment(application: AidApplication): FourDiscernmentReport {
  return {
    goodAndHarm: [
      {
        id: 'privacy-school-room',
        category: 'privacy',
        label: '传播草稿存在隐私暴露',
        evidence: '原始叙事提到学校、病房楼层等可识别信息。',
        severity: 'high',
      },
      {
        id: 'emotional-overstatement',
        category: 'overstatement',
        label: '公开表达需要避免情绪化过度承诺',
        evidence: '公开文案应保留事实，不使用绝对化疗效或悲情刺激表达。',
        severity: 'medium',
      },
      {
        id: 'medical-boundary',
        category: 'medical_boundary',
        label: '不得提供诊疗建议',
        evidence: '系统只能整理救助资料，治疗方案必须由医疗专业人员判断。',
        severity: 'medium',
      },
    ],
    truth: [
      {
        id: 'amount-conflict',
        category: 'amount_conflict',
        label: '费用缺口需要人工复核',
        evidence: '费用总额、已支付、报销预估与剩余缺口之间需要最新发票确认。',
        severity: 'high',
      },
      {
        id: 'reimbursement-unclear',
        category: 'timeline',
        label: '医保/商保报销状态不清',
        evidence: '当前仅有预估说明，没有确认回执。',
        severity: 'high',
      },
    ],
    scale: {
      urgency: 'high',
      resourceGap: application.remainingGap,
      rationale: '处于连续治疗阶段，费用缺口影响后续安排，需优先补齐关键证明并跟进资源。',
    },
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
  };
}

export function generatePublicProject(application: AidApplication): PublicProject {
  return {
    id: `project-${application.id}`,
    patientAlias: application.patientAlias,
    disease: '儿童血液病治疗支持',
    status: 'receiving_intentions',
    region: application.hospitalRegion.replace('某三甲医院', '').trim(),
    verifiedNeed: '连续治疗阶段费用缺口、政策咨询和复诊交通协助',
    resourceGap: application.remainingGap,
    matchedIntentions: 0,
    needs: application.requestedNeeds,
    progress: ['机构完成初步材料整理', '等待补充最新发票和报销确认', '公开展示已完成脱敏处理'],
    story:
      `${application.patientAlias}正在接受规范治疗，家庭已承担前期费用并申请医保报销。` +
      '机构正在核实最新费用凭证，并收集社会帮助意向用于后续合规跟进。',
    evidenceSummary: ['诊断摘要为模拟资料', '费用缺口需人工复核最新票据', '公开内容已移除可识别地点信息'],
    feedback: ['机构将根据实际跟进情况生成反馈草稿', '反馈发布前需人工复核'],
  };
}

export function classifyDonationIntention(
  intention: DonationIntention,
  projects: PublicProject[] = seedPublicProjects,
): DonationClassification {
  const project = projects.find((item) => item.id === intention.projectId) ?? projects[0];
  const matchedNeeds = matchNeeds(intention, project.needs);
  const categoryLabel = categoryLabels[intention.helpCategory];
  const isHighPriority =
    matchedNeeds.some((need) => need.priority === 'high') ||
    intention.helpType === 'medical_resource' ||
    intention.helpType === 'corporate_support' ||
    /[5-9]\d{3,}|[1-9]\d{4,}/.test(intention.amountOrResource);

  return {
    priority: isHighPriority ? 'high' : 'normal',
    categoryLabel,
    matchingRationale: buildMatchingRationale(intention, matchedNeeds),
    matchedNeedLabels: matchedNeeds.map((need) => need.label),
    tags: [
      categoryLabel,
      intention.helpType,
      intention.city,
      intention.receiptNeed ? 'needs_receipt_info' : 'no_receipt_need',
    ],
    followUpScript:
      '您好，感谢您对该救助项目表达帮助意向。平台仅登记意向、不在平台内收款，' +
      '后续将由有资质机构工作人员与您确认支持方式、票据需求、隐私边界和项目反馈。',
  };
}

export function answerProjectQuestion(project: PublicProject, question: string): ProjectAnswer {
  const needsText = project.needs.map((need) => `${need.label}：${need.description}`).join('；');

  if (question.includes('为什么') || question.includes('收款') || question.includes('付款')) {
    return {
      question,
      answer:
        '平台只登记帮助意向，不在平台内收款，也不建立资金池。真实募捐主体、资金账户、票据、拨付和最终救助决策由有资质机构负责。',
      sourceLabels: ['合规边界', '机构复核'],
    };
  }

  if (question.includes('适合') || question.includes('资源')) {
    return {
      question,
      answer:
        `可以先对照当前真实需要：${needsText}。` +
        '如果您的资源属于资金意向、药品/营养/住宿交通等物资，或陪诊、政策咨询、心理支持、传播等服务，都可以登记为帮助意向，由机构判断是否匹配。',
      sourceLabels: ['项目当前需求', '钱/物/服匹配'],
    };
  }

  if (question.includes('需要') || question.includes('缺')) {
    return {
      question,
      answer: `当前最需要的是：${needsText}。这些需求会进入机构后台，由工作人员匹配钱、物、服三类社会支持。`,
      sourceLabels: ['项目当前需求', '机构工作台'],
    };
  }

  return {
    question,
    answer:
      `该项目处于${project.status}状态，已记录${project.progress.length}条阶段进展。` +
      'AI回答只基于脱敏项目事实和合规边界，不能替代机构判断，也不提供医疗诊断或治疗建议。',
    sourceLabels: ['项目进展', 'AI辅助说明'],
  };
}

export function generateFeedbackDraft(project: PublicProject): string {
  return [
    `项目：${project.patientAlias} ${project.verifiedNeed}`,
    `阶段进展：${project.progress.join('；')}`,
    `当前资源缺口：${project.resourceGap > 0 ? formatCurrency(project.resourceGap) : '本阶段已完成'}`,
    `已匹配帮助意向：${project.matchedIntentions}条`,
    '说明：本反馈为透明反馈草稿，需机构工作人员复核后发布；内容不含可识别个人隐私，不代表平台收款或拨付。',
  ].join('\n');
}

function matchNeeds(intention: DonationIntention, needs: ResourceNeed[]): ResourceNeed[] {
  const byCategory = needs.filter((need) => need.category === intention.helpCategory);
  const byType = needs.filter((need) => {
    if (intention.helpType === 'funding_intention') return need.type === 'treatment_cost';
    if (intention.helpType === 'policy_consultation') return need.type === 'policy_consultation';
    if (intention.helpType === 'transportation' || intention.helpType === 'volunteer') {
      return need.type === 'transportation' || need.type === 'escort';
    }
    if (intention.helpType === 'nutrition') return need.type === 'nutrition';
    if (intention.helpType === 'drug_resource' || intention.helpType === 'medical_resource') {
      return need.type === 'medicine';
    }
    return false;
  });

  const merged = [...byType, ...byCategory];
  const unique = new Map(merged.map((need) => [need.id, need]));
  return [...unique.values()].slice(0, 3);
}

function buildMatchingRationale(intention: DonationIntention, needs: ResourceNeed[]): string {
  const needText = needs.length > 0 ? needs.map((need) => need.label).join('、') : '项目登记的真实需要';

  if (intention.helpCategory === 'money') {
    return `与${needText}匹配，需由机构线下确认合规收款路径、票据需求和拨付安排。`;
  }

  if (intention.helpCategory === 'materials') {
    return `与${needText}匹配，需确认资源来源、适用范围、交付方式和受助人选择权。`;
  }

  return `与${needText}匹配，适合作为机构跟进的服务型帮助意向，需确认时间、地点和受助人意愿。`;
}

function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('zh-CN')}元`;
}
