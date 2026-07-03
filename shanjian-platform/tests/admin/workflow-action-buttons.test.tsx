import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const uiMocks = vi.hoisted(() => ({
  serverFunction: vi.fn(),
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
  useDocumentInfo: vi.fn(),
  useFormFields: vi.fn(),
  useFormModified: vi.fn(),
}))

vi.mock('@payloadcms/ui', async () => {
  const React = await vi.importActual<typeof import('react')>('react')

  return {
    Button: ({
      children,
      disabled,
      onClick,
      type,
    }: {
      children: React.ReactNode
      disabled?: boolean
      onClick?: () => void
      type?: 'button' | 'reset' | 'submit'
    }) => React.createElement('button', { disabled, onClick, type: type ?? 'button' }, children),
    toast: uiMocks.toast,
    useDocumentInfo: uiMocks.useDocumentInfo,
    useFormFields: uiMocks.useFormFields,
    useFormModified: uiMocks.useFormModified,
    useServerFunctions: () => ({ serverFunction: uiMocks.serverFunction }),
  }
})

import {
  GeneratePublicProjectButton,
  RunCaseReviewAgentButton,
} from '../../src/components/admin/WorkflowActionButtons'

describe('admin workflow action buttons', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    uiMocks.useDocumentInfo.mockReturnValue({ id: 101 })
    uiMocks.useFormFields.mockImplementation((selector) => selector([{ decision: { value: null } }, vi.fn()]))
    uiMocks.useFormModified.mockReturnValue(false)
  })

  it('blocks public project generation until the human decision is approved', async () => {
    renderGeneratePublicProjectButton({ decision: 'request_materials' })

    await userEvent.click(screen.getByRole('button', { name: '生成/查看公开项目草稿' }))

    expect(uiMocks.serverFunction).not.toHaveBeenCalled()
    expect(uiMocks.toast.error).toHaveBeenCalledWith('请先把人工决策设为“批准展示”并保存后，再生成公开项目草稿。')
  })

  it('blocks public project generation when the approved decision has not been saved', async () => {
    renderGeneratePublicProjectButton({ decision: 'approve_display', isModified: true })

    await userEvent.click(screen.getByRole('button', { name: '生成/查看公开项目草稿' }))

    expect(uiMocks.serverFunction).not.toHaveBeenCalled()
    expect(uiMocks.toast.error).toHaveBeenCalledWith('请先保存当前四辨审核后，再生成公开项目草稿。')
  })

  it('calls the server workflow for a saved approved review', async () => {
    uiMocks.serverFunction.mockRejectedValueOnce(new Error('服务端测试错误'))
    renderGeneratePublicProjectButton({ decision: 'approve_display' })

    await userEvent.click(screen.getByRole('button', { name: '生成/查看公开项目草稿' }))

    await waitFor(() => {
      expect(uiMocks.serverFunction).toHaveBeenCalledWith({
        args: { reviewId: 101 },
        name: 'shanjian-generate-public-project',
      })
    })
    expect(uiMocks.toast.error).toHaveBeenCalledWith('服务端测试错误')
  })

  it('lets an operator choose a configured Agent before generating case review suggestions', async () => {
    uiMocks.serverFunction.mockImplementation(async ({ name }: { name: string }) => {
      if (name === 'shanjian-list-agent-configs') {
        return [
          {
            id: 1,
            configName: '启用中的四辨 Agent',
            isActive: true,
            provider: 'openai_compatible',
            modelName: 'active-model',
          },
          {
            id: 2,
            configName: '备用四辨 Agent',
            isActive: false,
            provider: 'deepseek',
            modelName: 'backup-model',
          },
        ]
      }

      throw new Error('服务端测试错误')
    })

    render(<RunCaseReviewAgentButton />)

    const picker = await screen.findByLabelText('选择 Agent')
    expect(picker).toHaveValue('1')

    await userEvent.selectOptions(picker, '2')
    await userEvent.click(screen.getByRole('button', { name: 'Agent 刷新四辨建议' }))

    await waitFor(() => {
      expect(uiMocks.serverFunction).toHaveBeenCalledWith({
        args: { agentConfigId: '2', reviewId: 101 },
        name: 'shanjian-run-case-review-agent',
      })
    })
    expect(uiMocks.toast.error).toHaveBeenCalledWith('服务端测试错误')
  })
})

function renderGeneratePublicProjectButton({
  decision,
  isModified = false,
}: {
  decision: string | null
  isModified?: boolean
}) {
  uiMocks.useFormFields.mockImplementation((selector) => selector([{ decision: { value: decision } }, vi.fn()]))
  uiMocks.useFormModified.mockReturnValue(isModified)
  render(<GeneratePublicProjectButton />)
}
