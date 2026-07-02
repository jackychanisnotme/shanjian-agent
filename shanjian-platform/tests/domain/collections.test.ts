import { describe, expect, it } from 'vitest'

import { AidApplications } from '../../src/collections/AidApplications'
import { DonationIntentions } from '../../src/collections/DonationIntentions'
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
})
