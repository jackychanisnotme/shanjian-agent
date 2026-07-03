import { z } from 'zod'

import type { AidApplication, FourDiscernmentReport } from '../../domain/charity'
import { buildFourDiscernmentReport } from '../../domain/discernment'
import { getActiveAgentConfig, getAgentConfigById, type ActiveAgentConfig } from './configService'
import type { AgentToolContext } from './types'

const riskSignalSchema = z.object({
  id: z.string().min(1),
  category: z.enum([
    'fraud',
    'privacy',
    'reimbursement',
    'missing_material',
    'amount_conflict',
    'timeline',
    'overstatement',
    'medical_boundary',
  ]),
  label: z.string().min(1),
  evidence: z.string().min(1),
  severity: z.enum(['low', 'medium', 'high']),
})

const fourDiscernmentReportSchema = z.object({
  goodAndHarm: z.array(riskSignalSchema),
  truth: z.array(riskSignalSchema),
  scaleUrgency: z.enum(['low', 'medium', 'high']),
  scaleRationale: z.string().min(1),
  resourceGap: z.number().nonnegative(),
  proximity: z.array(z.string().min(1)),
  humanChecklist: z.array(z.string().min(1)),
})

type AgentReviewResult = {
  agentError?: string
  configName?: string
  report: FourDiscernmentReport
  source: 'deterministic' | 'local_llm'
}

export async function buildFourDiscernmentReportWithAgent(
  application: AidApplication,
  context: AgentToolContext,
  options: { agentConfigId?: number | string } = {},
): Promise<AgentReviewResult> {
  const deterministicReport = buildFourDiscernmentReport(application)
  const config = context.payload
    ? options.agentConfigId
      ? await getAgentConfigById(context.payload, options.agentConfigId)
      : await getActiveAgentConfig(context.payload)
    : null

  if (!config) {
    return {
      report: deterministicReport,
      source: 'deterministic',
    }
  }

  try {
    const report = await requestAgentReport(config, application, context.signal)

    return {
      configName: config.configName,
      report,
      source: 'local_llm',
    }
  } catch (error) {
    return {
      agentError: error instanceof Error ? error.message : String(error),
      configName: config.configName,
      report: deterministicReport,
      source: 'deterministic',
    }
  }
}

async function requestAgentReport(
  config: ActiveAgentConfig,
  application: AidApplication,
  signal?: AbortSignal,
): Promise<FourDiscernmentReport> {
  const response = await fetch(toChatCompletionsUrl(config.baseUrl), {
    body: JSON.stringify({
      model: config.modelName,
      temperature: config.temperature ?? 0.2,
      max_tokens: config.maxOutputTokens ?? 2000,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            config.systemPrompt ||
            '你是善见平台的四辨审核辅助 Agent。只做材料整理、风险提示和人工复核建议，不承诺救助结果，不自动公开项目。',
        },
        {
          role: 'user',
          content: buildReviewPrompt(application),
        },
      ],
    }),
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    signal,
  })

  if (!response.ok) {
    throw new Error(`Agent 接口返回 ${response.status}`)
  }

  const payload = await response.json()
  const content = extractMessageContent(payload)
  const parsed = fourDiscernmentReportSchema.safeParse(parseJsonContent(content))

  if (!parsed.success) {
    throw new Error(`Agent 输出格式不符合四辨结构：${z.prettifyError(parsed.error)}`)
  }

  return parsed.data
}

function buildReviewPrompt(application: AidApplication): string {
  return [
    '请基于以下求助申请输出严格 JSON，不要输出 Markdown。',
    'JSON 字段必须为 goodAndHarm、truth、scaleUrgency、scaleRationale、resourceGap、proximity、humanChecklist。',
    '只生成机构内部审核建议，不修改人工决策，不承诺救助结果，不给诊疗建议。',
    JSON.stringify(
      {
        patientAlias: application.patientAlias,
        applicantRole: application.applicantRole,
        diseaseSummary: application.diseaseSummary,
        treatmentStage: application.treatmentStage,
        region: application.region,
        expenseTotal: application.expenseTotal,
        paidAmount: application.paidAmount,
        reimbursementEstimate: application.reimbursementEstimate,
        remainingGap: application.remainingGap,
        familyBurden: application.familyBurden,
        requestedNeeds: application.requestedNeeds,
        materialNotes: application.materialNotes,
        evidence: application.evidence,
        rawNarrative: application.rawNarrative,
        consentForInstitutionReview: application.consentForInstitutionReview,
        consentForDeidentifiedDisplay: application.consentForDeidentifiedDisplay,
      },
      null,
      2,
    ),
  ].join('\n\n')
}

function extractMessageContent(payload: unknown): string {
  const content = (payload as { choices?: Array<{ message?: { content?: unknown } }> }).choices?.[0]?.message?.content

  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('Agent 接口没有返回可解析内容。')
  }

  return content
}

function parseJsonContent(content: string): unknown {
  const trimmed = content.trim()
  const unfenced = trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  return JSON.parse(unfenced)
}

function toChatCompletionsUrl(baseUrl: string): string {
  const normalized = baseUrl.replace(/\/+$/, '')

  if (normalized.endsWith('/chat/completions')) return normalized
  if (normalized.endsWith('/v1')) return `${normalized}/chat/completions`

  return `${normalized}/v1/chat/completions`
}
