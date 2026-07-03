import type { ServerFunction } from 'payload'

import { executeAgentTool } from './agent/toolService'
import { generateCaseReview, generatePublicProject } from './workflow'

interface WorkflowActionResult {
  collection: 'case-reviews' | 'public-projects'
  created: boolean
  id: number | string
  message?: string
  path: string
}

export const generateCaseReviewServerFunction: ServerFunction<
  { applicationId?: number | string },
  Promise<WorkflowActionResult>
> = async ({ applicationId, req }) => {
  if (!applicationId) {
    throw new Error('缺少求助申请编号。')
  }

  const { created, review } = await generateCaseReview(req.payload, applicationId)
  return {
    collection: 'case-reviews',
    created,
    id: review.id,
    path: `/admin/collections/case-reviews/${review.id}`,
  }
}

export const generatePublicProjectServerFunction: ServerFunction<
  { reviewId?: number | string },
  Promise<WorkflowActionResult>
> = async ({ reviewId, req }) => {
  if (!reviewId) {
    throw new Error('缺少四辨审核编号。')
  }

  const { created, project } = await generatePublicProject(req.payload, reviewId)
  return {
    collection: 'public-projects',
    created,
    id: project.id,
    path: `/admin/collections/public-projects/${project.id}`,
  }
}

export const runCaseReviewAgentServerFunction: ServerFunction<
  { applicationId?: number | string; reviewId?: number | string },
  Promise<WorkflowActionResult>
> = async ({ applicationId, reviewId, req }) => {
  if (!applicationId && !reviewId) {
    throw new Error('缺少求助申请或四辨审核编号。')
  }

  const result = await executeAgentTool({
    args: { applicationId, reviewId },
    payload: req.payload,
    toolName: 'case_review_generate_suggestions',
  })

  if (!result.ok) {
    throw new Error(result.error)
  }

  const data = result.data as {
    agentConfigured?: boolean
    agentError?: string
    created: boolean
    reviewId: number | string
    source: 'deterministic' | 'local_llm'
  }
  const sourceLabel = data.source === 'local_llm' ? 'Agent 已生成四辨建议' : '已使用规则生成四辨建议'
  const fallbackMessage = data.agentError ? `，Agent 调用失败：${data.agentError}` : ''

  return {
    collection: 'case-reviews',
    created: data.created,
    id: data.reviewId,
    message: `${sourceLabel}${fallbackMessage}`,
    path: `/admin/collections/case-reviews/${data.reviewId}`,
  }
}

export const adminServerFunctions = {
  'shanjian-generate-case-review': generateCaseReviewServerFunction,
  'shanjian-generate-public-project': generatePublicProjectServerFunction,
  'shanjian-run-case-review-agent': runCaseReviewAgentServerFunction,
}
