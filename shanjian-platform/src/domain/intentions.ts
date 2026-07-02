import { helpCategoryLabels, type DonationClassification, type DonationIntention, type PublicProject, type ResourceNeed } from './charity'

export function classifyDonationIntention(
  intention: DonationIntention,
  projects: PublicProject[],
): DonationClassification {
  const project = projects.find((item) => item.id === intention.projectId) ?? projects[0]
  const matchedNeeds = matchNeeds(intention, project.needs)
  const categoryLabel = helpCategoryLabels[intention.helpCategory]
  const priority =
    matchedNeeds.some((need) => need.priority === 'high') ||
    /[5-9]\d{3,}|[1-9]\d{4,}/.test(intention.amountOrResource)
      ? 'high'
      : 'normal'

  return {
    priority,
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
      '您好，感谢您对该救助项目表达帮助意向。平台仅登记意向、不在平台内收款，后续将由有资质机构工作人员与您确认支持方式、票据需求、隐私边界和项目反馈。',
  }
}

function matchNeeds(intention: DonationIntention, needs: ResourceNeed[]): ResourceNeed[] {
  const byCategory = needs.filter((need) => need.category === intention.helpCategory)
  const byType = needs.filter((need) => {
    if (intention.helpType === 'funding_intention') return need.type === 'treatment_cost'
    if (intention.helpType === 'policy_consultation') return need.type === 'policy_consultation'
    if (intention.helpType === 'transportation' || intention.helpType === 'volunteer') {
      return need.type === 'transportation' || need.type === 'escort'
    }
    if (intention.helpType === 'nutrition') return need.type === 'nutrition'
    if (intention.helpType === 'accommodation') return need.type === 'accommodation'
    if (intention.helpType === 'drug_resource' || intention.helpType === 'medical_resource') {
      return need.type === 'medicine'
    }
    return false
  })

  const unique = new Map([...byType, ...byCategory].map((need) => [need.id, need]))
  return [...unique.values()].slice(0, 3)
}

function buildMatchingRationale(intention: DonationIntention, needs: ResourceNeed[]): string {
  const needText = needs.length > 0 ? needs.map((need) => need.label).join('、') : '项目登记的真实需要'

  if (intention.helpCategory === 'money') {
    return `与${needText}匹配，需由机构线下确认合规收款路径、票据需求和拨付安排。`
  }

  if (intention.helpCategory === 'materials') {
    return `与${needText}匹配，需确认资源来源、适用范围、交付方式和受助人选择权。`
  }

  return `与${needText}匹配，适合作为机构跟进的服务型帮助意向，需确认时间、地点和受助人意愿。`
}
