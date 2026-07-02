import { describe, expect, it } from 'vitest'

import { demoAidApplication } from '../../src/domain/demoSeed'
import { buildFourDiscernmentReport } from '../../src/domain/discernment'

describe('buildFourDiscernmentReport', () => {
  it('flags privacy, reimbursement and missing-material risks for institutional review', () => {
    const report = buildFourDiscernmentReport(demoAidApplication)

    expect(report.goodAndHarm.map((risk) => risk.category)).toContain('privacy')
    expect(report.truth.map((risk) => risk.category)).toContain('reimbursement')
    expect(report.truth.map((risk) => risk.category)).toContain('missing_material')
    expect(report.humanChecklist).toContain('由机构工作人员作出最终救助和展示决定')
  })
})
