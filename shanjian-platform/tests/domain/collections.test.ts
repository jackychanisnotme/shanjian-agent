import { describe, expect, it } from 'vitest'

import { AgentConfigs } from '../../src/collections/AgentConfigs'
import { AidApplications } from '../../src/collections/AidApplications'
import { CaseReviews } from '../../src/collections/CaseReviews'
import { DonationIntentions } from '../../src/collections/DonationIntentions'
import { FeedbackReports } from '../../src/collections/FeedbackReports'
import { PublicProjects } from '../../src/collections/PublicProjects'
import config from '../../src/payload.config'

describe('charity collection configs', () => {
  it('defines the core operational collection slugs', () => {
    expect(AidApplications.slug).toBe('aid-applications')
    expect(PublicProjects.slug).toBe('public-projects')
    expect(DonationIntentions.slug).toBe('donation-intentions')
    expect(AgentConfigs.slug).toBe('agent-configs')
  })

  it('registers Agent 配置 under system management with LLM connection fields', () => {
    expect(AgentConfigs.labels).toMatchObject({
      singular: 'Agent 配置',
      plural: 'Agent 配置',
    })
    expect(AgentConfigs.admin).toMatchObject({
      group: '系统管理',
      useAsTitle: 'configName',
    })
    expect(AgentConfigs.admin?.defaultColumns).not.toContain('apiKey')

    const fieldNames = AgentConfigs.fields.map((field) => ('name' in field ? field.name : undefined))

    expect(fieldNames).toEqual(
      expect.arrayContaining([
        'configName',
        'isActive',
        'provider',
        'baseUrl',
        'apiKey',
        'modelName',
        'temperature',
        'maxOutputTokens',
        'timeoutSeconds',
        'systemPrompt',
        'notes',
      ]),
    )
  })

  it('limits Agent 配置 access to administrator users', async () => {
    const reviewerArgs = { req: { user: { id: 2, role: 'reviewer' } } }
    const adminArgs = { req: { user: { id: 1, role: 'admin' } } }

    await expect(resolveAccess(AgentConfigs.access?.read?.(reviewerArgs))).resolves.toBe(false)
    await expect(resolveAccess(AgentConfigs.access?.create?.(reviewerArgs))).resolves.toBe(false)
    await expect(resolveAccess(AgentConfigs.access?.update?.(reviewerArgs))).resolves.toBe(false)
    await expect(resolveAccess(AgentConfigs.access?.delete?.(reviewerArgs))).resolves.toBe(false)

    await expect(resolveAccess(AgentConfigs.access?.read?.(adminArgs))).resolves.toBe(true)
    await expect(resolveAccess(AgentConfigs.access?.create?.(adminArgs))).resolves.toBe(true)
    await expect(resolveAccess(AgentConfigs.access?.update?.(adminArgs))).resolves.toBe(true)
    await expect(resolveAccess(AgentConfigs.access?.delete?.(adminArgs))).resolves.toBe(true)
  })

  it('includes Agent 配置 in the Payload backend collection registry', async () => {
    const resolvedConfig = await config
    const collectionSlugs = resolvedConfig.collections?.map((collection) => collection.slug)

    expect(collectionSlugs).toContain('agent-configs')
  })

  it('keeps public project publishing explicit', () => {
    const publicProjectFields = PublicProjects.fields.map((field) => ('name' in field ? field.name : undefined))

    expect(publicProjectFields).toContain('slug')
    expect(publicProjectFields).toContain('isPublished')
  })

  it('allows donation intentions to enter a general pool without a project', () => {
    const projectField = DonationIntentions.fields.find((field) => 'name' in field && field.name === 'project')

    expect(projectField).toMatchObject({
      type: 'relationship',
      required: false,
    })
  })

  it('requires an institution user before browsers can read or write operational collections', async () => {
    const anonymousArgs = { req: { user: undefined } }
    const protectedCollections = [AidApplications, CaseReviews, DonationIntentions, FeedbackReports, AgentConfigs]

    for (const collection of protectedCollections) {
      await expect(resolveAccess(collection.access?.read?.(anonymousArgs))).resolves.toBe(false)
      await expect(resolveAccess(collection.access?.create?.(anonymousArgs))).resolves.toBe(false)
      await expect(resolveAccess(collection.access?.update?.(anonymousArgs))).resolves.toBe(false)
      await expect(resolveAccess(collection.access?.delete?.(anonymousArgs))).resolves.toBe(false)
    }
  })

  it('only exposes published public projects to anonymous readers', async () => {
    await expect(resolveAccess(PublicProjects.access?.read?.({ req: { user: undefined } }))).resolves.toEqual({
      isPublished: {
        equals: true,
      },
    })
    await expect(resolveAccess(PublicProjects.access?.read?.({ req: { user: { id: 1 } } }))).resolves.toBe(true)
  })
})

function resolveAccess<T>(value: T | Promise<T>): Promise<T> {
  return Promise.resolve(value)
}
