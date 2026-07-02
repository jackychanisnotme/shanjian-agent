'use client'

import { Button, toast, useDocumentInfo, useServerFunctions } from '@payloadcms/ui'
import { useState } from 'react'

interface WorkflowActionResult {
  created: boolean
  id: number | string
  path: string
}

export function GenerateCaseReviewButton() {
  const { id } = useDocumentInfo()

  return (
    <WorkflowActionButton
      disabled={!id}
      missingDocumentMessage="保存求助申请后才能生成四辨审核。"
      name="shanjian-generate-case-review"
      payload={{ applicationId: id }}
    >
      生成/查看四辨审核
    </WorkflowActionButton>
  )
}

export function GeneratePublicProjectButton() {
  const { id } = useDocumentInfo()

  return (
    <WorkflowActionButton
      disabled={!id}
      missingDocumentMessage="保存四辨审核后才能生成公开项目草稿。"
      name="shanjian-generate-public-project"
      payload={{ reviewId: id }}
    >
      生成/查看公开项目草稿
    </WorkflowActionButton>
  )
}

function WorkflowActionButton({
  children,
  disabled,
  missingDocumentMessage,
  name,
  payload,
}: {
  children: string
  disabled?: boolean
  missingDocumentMessage: string
  name: string
  payload: Record<string, unknown>
}) {
  const [isRunning, setIsRunning] = useState(false)
  const { serverFunction } = useServerFunctions()

  async function runWorkflowAction() {
    if (disabled) {
      toast.error(missingDocumentMessage)
      return
    }

    try {
      setIsRunning(true)
      const result = (await serverFunction({
        args: payload,
        name,
      })) as WorkflowActionResult

      toast.success(result.created ? '已生成记录' : '已找到已有记录')
      window.location.href = result.path
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '操作失败，请稍后重试。')
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="shanjian-workflow-action">
      <Button buttonStyle="secondary" disabled={isRunning || disabled} onClick={runWorkflowAction} type="button">
        {isRunning ? '处理中...' : children}
      </Button>
    </div>
  )
}
