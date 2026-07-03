import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { getPayload, type Payload } from 'payload'

import config from '../../src/payload.config'
import { executeAgentTool } from '../../src/server/agent/toolService'
import { createAidApplicationFromForm, generatePublicProject } from '../../src/server/workflow'

let payload: Payload
const cleanup = {
  agentConfigIds: [] as Array<number | string>,
  applicationIds: [] as Array<number | string>,
  projectIds: [] as Array<number | string>,
  reviewIds: [] as Array<number | string>,
}

describe('case review agent integration', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  afterAll(async () => {
    vi.unstubAllGlobals()

    for (const projectId of cleanup.projectIds) {
      await payload.delete({ collection: 'public-projects', id: projectId })
    }
    for (const reviewId of cleanup.reviewIds) {
      await payload.delete({ collection: 'case-reviews', id: reviewId })
    }
    for (const applicationId of cleanup.applicationIds) {
      await payload.delete({ collection: 'aid-applications', id: applicationId })
    }
    for (const agentConfigId of cleanup.agentConfigIds) {
      await payload.delete({ collection: 'agent-configs', id: agentConfigId })
    }
  })

  it('uses active Agent config to generate readable four-discernment suggestions without changing human decision', async () => {
    const application = await createAidApplicationFromForm(payload, aidApplicationFormData())
    cleanup.applicationIds.push(application.id)
    const agentConfig = await payload.create({
      collection: 'agent-configs',
      data: {
        configName: `四辨 Agent 接入测试 ${Date.now()}`,
        isActive: true,
        provider: 'openai_compatible',
        baseUrl: 'https://llm.example.test/v1',
        apiKey: 'sk-agent-case-review-test',
        modelName: 'case-review-model',
        temperature: 0.1,
        maxOutputTokens: 1200,
        timeoutSeconds: 15,
        systemPrompt: '只做机构四辨审核辅助。',
      },
    })
    cleanup.agentConfigIds.push(agentConfig.id)
    const fetchMock = vi.fn(async () => {
      return new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  goodAndHarm: [
                    {
                      id: 'agent-privacy-risk',
                      category: 'privacy',
                      label: 'Agent 提示公开材料需继续脱敏',
                      evidence: '原始叙事中存在可识别线索。',
                      severity: 'high',
                    },
                  ],
                  truth: [
                    {
                      id: 'agent-invoice-check',
                      category: 'missing_material',
                      label: 'Agent 提示最新发票需核验',
                      evidence: '材料说明中提到缺少最新医疗费用发票。',
                      severity: 'high',
                    },
                  ],
                  scaleUrgency: 'high',
                  scaleRationale: '费用缺口较高，且处于连续治疗阶段。',
                  resourceGap: 58000,
                  proximity: ['联系医院社工复核治疗阶段'],
                  humanChecklist: ['核验最新发票与费用清单金额是否一致'],
                }),
              },
            },
          ],
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      )
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await executeAgentTool({
      payload,
      toolName: 'case_review_generate_suggestions',
      args: { applicationId: application.id },
    })

    expect(result.ok).toBe(true)
    const data = result.ok ? (result.data as { reviewId: number | string; source: string }) : undefined
    expect(data).toMatchObject({ source: 'local_llm' })
    cleanup.reviewIds.push(data!.reviewId)

    const review = await payload.findByID({
      collection: 'case-reviews',
      id: data!.reviewId,
    })
    expect(review.reviewSource).toBe('local_llm')
    expect(review.goodAndHarm).toMatchObject([
      expect.objectContaining({ label: 'Agent 提示公开材料需继续脱敏' }),
    ])
    expect(review.truth).toMatchObject([expect.objectContaining({ label: 'Agent 提示最新发票需核验' })])
    expect(review.decision).toBeNull()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, request] = fetchMock.mock.calls[0]
    expect(url).toBe('https://llm.example.test/v1/chat/completions')
    expect(request?.headers).toMatchObject({
      Authorization: 'Bearer sk-agent-case-review-test',
    })

    const logs = await payload.find({
      collection: 'agent-runtime-logs',
      where: {
        toolName: {
          equals: 'case_review_generate_suggestions',
        },
      },
      sort: '-createdAt',
      limit: 1,
    })
    expect(logs.docs[0]).toMatchObject({
      toolName: 'case_review_generate_suggestions',
      safety: 'write',
      success: true,
    })
    expect(JSON.stringify(logs.docs[0])).not.toContain('sk-agent-case-review-test')
  })

  it('can run a manually selected Agent config instead of the active one', async () => {
    const application = await createAidApplicationFromForm(payload, aidApplicationFormData())
    cleanup.applicationIds.push(application.id)
    const activeConfig = await payload.create({
      collection: 'agent-configs',
      data: {
        configName: `默认 Agent ${Date.now()}`,
        isActive: true,
        provider: 'openai_compatible',
        baseUrl: 'https://active-agent.example.test/v1',
        apiKey: 'sk-active-agent-test',
        modelName: 'active-agent-model',
        maxOutputTokens: 1200,
        timeoutSeconds: 15,
      },
    })
    const selectedConfig = await payload.create({
      collection: 'agent-configs',
      data: {
        configName: `手动选择 Agent ${Date.now()}`,
        isActive: false,
        provider: 'openai_compatible',
        baseUrl: 'https://selected-agent.example.test/v1',
        apiKey: 'sk-selected-agent-test',
        modelName: 'selected-agent-model',
        maxOutputTokens: 1200,
        timeoutSeconds: 15,
      },
    })
    cleanup.agentConfigIds.push(activeConfig.id, selectedConfig.id)
    const fetchMock = vi.fn(async () => {
      return new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  goodAndHarm: [],
                  truth: [],
                  scaleUrgency: 'medium',
                  scaleRationale: '由手动选择的 Agent 生成。',
                  resourceGap: 58000,
                  proximity: ['人工确认 Agent 来源'],
                  humanChecklist: ['确认本次使用的是手动选择的 Agent'],
                }),
              },
            },
          ],
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      )
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await executeAgentTool({
      payload,
      toolName: 'case_review_generate_suggestions',
      args: {
        agentConfigId: selectedConfig.id,
        applicationId: application.id,
      },
    })

    expect(result.ok).toBe(true)
    const data = result.ok
      ? (result.data as { configName: string; reviewId: number | string; source: string })
      : undefined
    cleanup.reviewIds.push(data!.reviewId)
    expect(data).toMatchObject({
      configName: selectedConfig.configName,
      source: 'local_llm',
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, request] = fetchMock.mock.calls[0]
    expect(url).toBe('https://selected-agent.example.test/v1/chat/completions')
    expect(request?.headers).toMatchObject({
      Authorization: 'Bearer sk-selected-agent-test',
    })
    expect(JSON.stringify(request?.body)).toContain('selected-agent-model')
  })

  it('can generate an unpublished public project draft from an approved Agent review', async () => {
    const application = await createAidApplicationFromForm(payload, aidApplicationFormData())
    cleanup.applicationIds.push(application.id)
    const result = await executeAgentTool({
      payload,
      toolName: 'case_review_generate_suggestions',
      args: { applicationId: application.id },
    })

    expect(result.ok).toBe(true)
    const data = result.ok ? (result.data as { reviewId: number | string }) : undefined
    cleanup.reviewIds.push(data!.reviewId)

    await payload.update({
      collection: 'case-reviews',
      id: data!.reviewId,
      data: {
        decision: 'approve_display',
      },
    })

    const { created, project } = await generatePublicProject(payload, data!.reviewId)
    cleanup.projectIds.push(project.id)
    const found = await payload.findByID({
      collection: 'public-projects',
      depth: 0,
      id: project.id,
    })

    expect(created).toBe(true)
    expect(found.application).toBe(application.id)
    expect(found.isPublished).toBe(false)
    expect(found.needs).toEqual(expect.arrayContaining([expect.objectContaining({ label: '治疗费用缺口' })]))
  })
})

function aidApplicationFormData(): FormData {
  const formData = new FormData()
  formData.set('patientAlias', `Agent测试患儿-${Date.now()}`)
  formData.set('applicantRole', 'family')
  formData.set('diseaseSummary', '儿童血液病治疗支持')
  formData.set('treatmentStage', '连续治疗与复诊阶段')
  formData.set('region', '华南')
  formData.set('expenseTotal', '186000')
  formData.set('paidAmount', '76000')
  formData.set('reimbursementEstimate', '52000')
  formData.set('familyBurden', '家庭主要收入来自临时务工，前期治疗已产生借款。')
  formData.set('requestedNeeds', '治疗费用缺口\n医保/救助政策咨询\n复诊交通协助')
  formData.set('materialNotes', '已有诊断摘要\n缺少最新医疗费用发票')
  formData.set('evidenceDiagnosis', 'on')
  formData.set('rawNarrative', '公开材料需要删除学校、病房和联系方式。')
  formData.set('consentForInstitutionReview', 'on')
  formData.set('consentForDeidentifiedDisplay', 'on')
  return formData
}
