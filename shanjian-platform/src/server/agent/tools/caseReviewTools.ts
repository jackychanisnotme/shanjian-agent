import { z } from 'zod'
import type { Payload } from 'payload'

import { payloadAidApplicationToDomain } from '../../workflow'
import { buildFourDiscernmentReportWithAgent } from '../fourDiscernmentAgent'
import { defineAgentTool } from '../toolDefine'
import type { AnyAgentToolDefinition } from '../types'

const relationshipIdSchema = z.union([z.string().min(1), z.number()])

export const caseReviewTools: AnyAgentToolDefinition[] = [
  defineAgentTool({
    name: 'case_review_generate_suggestions',
    description: '根据求助申请运行四辨审核 Agent，创建或刷新四辨审核建议字段，不修改人工决策。',
    safety: 'write',
    inputSchema: z
      .object({
        agentConfigId: relationshipIdSchema.optional(),
        applicationId: relationshipIdSchema.optional(),
        reviewId: relationshipIdSchema.optional(),
      })
      .refine((value) => value.applicationId || value.reviewId, {
        message: 'applicationId 和 reviewId 至少需要提供一个。',
      }),
    handler: async ({ agentConfigId, applicationId, reviewId }, context) => {
      if (!context.payload) {
        throw new Error('缺少 Payload 上下文，无法写入四辨审核。')
      }

      const existingReview = reviewId
        ? await context.payload.findByID({
            collection: 'case-reviews',
            depth: 0,
            id: reviewId,
          })
        : await findReviewByApplicationId(context.payload, applicationId!)

      const resolvedApplicationId = applicationId ?? relationshipId(existingReview?.application)
      if (!resolvedApplicationId) {
        throw new Error('无法定位关联求助申请。')
      }

      const application = await context.payload.findByID({
        collection: 'aid-applications',
        depth: 0,
        id: resolvedApplicationId,
      })
      const { agentError, configName, report, source } = await buildFourDiscernmentReportWithAgent(
        payloadAidApplicationToDomain(application),
        context,
        { agentConfigId },
      )
      const reviewData = {
        reviewTitle: `${application.patientAlias} 四辨审核`,
        application: Number(application.id),
        goodAndHarm: report.goodAndHarm,
        truth: report.truth,
        scaleUrgency: report.scaleUrgency,
        scaleRationale: report.scaleRationale,
        resourceGap: report.resourceGap,
        proximity: report.proximity,
        humanChecklist: report.humanChecklist,
        reviewSource: source,
      }
      const review = existingReview
        ? await context.payload.update({
            collection: 'case-reviews',
            id: existingReview.id,
            data: reviewData,
          })
        : await context.payload.create({
            collection: 'case-reviews',
            data: reviewData,
          })

      return {
        agentConfigured: Boolean(configName),
        agentError,
        configName,
        created: !existingReview,
        reviewId: review.id,
        source,
      }
    },
  }),
]

async function findReviewByApplicationId(payload: Payload, applicationId: number | string) {
  const reviews = await payload.find({
    collection: 'case-reviews',
    depth: 0,
    limit: 1,
    where: {
      application: {
        equals: applicationId,
      },
    },
  })

  return reviews.docs[0]
}

function relationshipId(value: unknown): number | string | undefined {
  if (typeof value === 'number' || typeof value === 'string') return value
  if (typeof value === 'object' && value && 'id' in value) {
    const id = value.id
    return typeof id === 'number' || typeof id === 'string' ? id : undefined
  }

  return undefined
}
