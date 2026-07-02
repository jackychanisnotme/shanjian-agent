import { describe, expect, it } from 'vitest'

import { seedPublicProjects } from '../../src/domain/demoSeed'
import { classifyDonationIntention } from '../../src/domain/intentions'

describe('classifyDonationIntention', () => {
  it('classifies money intentions as registration without payment handling', () => {
    const result = classifyDonationIntention(
      {
        projectId: seedPublicProjects[0].id,
        helpCategory: 'money',
        helpType: 'funding_intention',
        amountOrResource: '愿意支持5000元，由机构联系确认',
        city: '深圳',
        contact: 'contact@example.org',
        receiptNeed: true,
        message: '希望了解项目进展',
      },
      seedPublicProjects,
    )

    expect(result.categoryLabel).toBe('钱')
    expect(result.followUpScript).toContain('平台仅登记意向')
    expect(result.followUpScript).not.toContain('支付')
    expect(result.matchedNeedLabels.length).toBeGreaterThan(0)
  })

  it('classifies general-pool intentions without defaulting to a public project', () => {
    const result = classifyDonationIntention(
      {
        helpCategory: 'services',
        helpType: 'volunteer',
        amountOrResource: '每周可陪诊半天',
        city: '广州',
        contact: 'contact@example.org',
        receiptNeed: false,
        message: '希望由机构匹配合适项目',
      },
      seedPublicProjects,
    )

    expect(result.matchingRationale).toContain('通用意向池')
    expect(result.followUpScript).toContain('机构工作人员会先匹配具体项目')
    expect(result.matchedNeedLabels).toEqual([])
  })
})
