import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  AidApplicationReadableSummary,
  CaseReviewReadableSummary,
} from '../../src/components/admin/ReadableReviewFields'

describe('admin readable review fields', () => {
  it('renders aid application structured JSON as Chinese business cards', () => {
    render(
      <AidApplicationReadableSummary
        data={{
          remainingGap: 58000,
          requestedNeeds: [
            {
              id: 'need-1',
              type: 'treatment_cost',
              category: 'money',
              label: '治疗费用缺口',
              description: '治疗费用缺口，由机构工作人员复核后匹配资源。',
              priority: 'high',
            },
          ],
          materialNotes: ['已有诊断摘要', '缺少最新医疗费用发票'],
          evidence: [
            {
              id: 'evidence-diagnosis',
              label: '诊断摘要',
              status: 'received',
              note: '由申请人勾选提交，需机构复核原始材料。',
            },
          ],
        }}
      />,
    )

    expect(screen.getByText('结构化求助摘要')).toBeInTheDocument()
    expect(screen.getByText('治疗费用缺口')).toBeInTheDocument()
    expect(screen.getByText('高优先级')).toBeInTheDocument()
    expect(screen.getByText('已有诊断摘要')).toBeInTheDocument()
    expect(screen.getByText('已收到')).toBeInTheDocument()
    expect(screen.queryByText('"type"')).not.toBeInTheDocument()
    expect(screen.queryByText('treatment_cost')).not.toBeInTheDocument()
  })

  it('renders case review JSON as readable four-discernment sections', () => {
    render(
      <CaseReviewReadableSummary
        data={{
          goodAndHarm: [
            {
              id: 'privacy-public-copy',
              category: 'privacy',
              label: '公开表达存在隐私暴露风险',
              evidence: '原始叙事提示需要删除学校、病房、联系方式等可识别信息。',
              severity: 'high',
            },
          ],
          truth: [
            {
              id: 'missing-latest-invoice',
              category: 'missing_material',
              label: '最新费用凭证缺失',
              evidence: '材料备注显示缺少最新医疗费用发票，费用缺口需要人工复核。',
              severity: 'high',
            },
          ],
          scaleUrgency: 'high',
          scaleRationale: '处于连续治疗或复诊阶段。',
          resourceGap: 58000,
          proximity: ['联系医院社工核实治疗阶段'],
          humanChecklist: ['人工核对最新发票与费用清单金额是否一致'],
        }}
      />,
    )

    expect(screen.getByText('四辨审核摘要')).toBeInTheDocument()
    expect(screen.getByText('辨善恶')).toBeInTheDocument()
    expect(screen.getByText('公开表达存在隐私暴露风险')).toBeInTheDocument()
    expect(screen.getByText('辨真伪')).toBeInTheDocument()
    expect(screen.getByText('最新费用凭证缺失')).toBeInTheDocument()
    expect(screen.getByText('紧急程度：高')).toBeInTheDocument()
    expect(screen.queryByText('"severity"')).not.toBeInTheDocument()
    expect(screen.queryByText('missing_material')).not.toBeInTheDocument()
  })

  it('shows a blank review state before any Agent suggestions are generated', () => {
    render(
      <CaseReviewReadableSummary
        data={{
          goodAndHarm: [],
          truth: [],
          scaleUrgency: 'low',
          scaleRationale: '',
          resourceGap: 0,
          proximity: [],
          humanChecklist: [],
        }}
      />,
    )

    expect(screen.getByText('暂无四辨建议')).toBeInTheDocument()
    expect(screen.getByText('请先在本页选择 Agent 并生成建议，或由机构人员手动填写。')).toBeInTheDocument()
    expect(screen.queryByText('紧急程度：低')).not.toBeInTheDocument()
    expect(screen.queryByText('0元')).not.toBeInTheDocument()
  })
})
