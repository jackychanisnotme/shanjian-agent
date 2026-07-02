import type { ServerFunction } from 'payload'

import { generateCaseReview, generatePublicProject } from './workflow'

interface WorkflowActionResult {
  collection: 'case-reviews' | 'public-projects'
  created: boolean
  id: number | string
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

export const adminServerFunctions = {
  'shanjian-generate-case-review': generateCaseReviewServerFunction,
  'shanjian-generate-public-project': generatePublicProjectServerFunction,
}
