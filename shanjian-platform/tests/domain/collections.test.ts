import { describe, expect, it } from 'vitest'

import { AidApplications } from '../../src/collections/AidApplications'
import { CaseReviews } from '../../src/collections/CaseReviews'
import { DonationIntentions } from '../../src/collections/DonationIntentions'
import { FeedbackReports } from '../../src/collections/FeedbackReports'
import { PublicProjects } from '../../src/collections/PublicProjects'

describe('charity collection configs', () => {
  it('defines the core operational collection slugs', () => {
    expect(AidApplications.slug).toBe('aid-applications')
    expect(PublicProjects.slug).toBe('public-projects')
    expect(DonationIntentions.slug).toBe('donation-intentions')
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
    const protectedCollections = [AidApplications, CaseReviews, DonationIntentions, FeedbackReports]

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
