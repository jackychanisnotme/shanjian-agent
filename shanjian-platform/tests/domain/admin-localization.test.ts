import { describe, expect, it } from 'vitest'

import { AidApplications } from '../../src/collections/AidApplications'
import { CaseReviews } from '../../src/collections/CaseReviews'
import { DonationIntentions } from '../../src/collections/DonationIntentions'
import { FeedbackReports } from '../../src/collections/FeedbackReports'
import { Media } from '../../src/collections/Media'
import { PublicProjects } from '../../src/collections/PublicProjects'
import { Users } from '../../src/collections/Users'
import configPromise from '../../src/payload.config'

describe('Payload admin localization', () => {
  it('uses Chinese as the default admin language', async () => {
    const config = await configPromise

    expect(config.i18n?.fallbackLanguage).toBe('zh')
  })

  it('localizes operational collections and visible fields', () => {
    expect(AidApplications.labels).toEqual({ plural: '求助申请', singular: '求助申请' })
    expect(CaseReviews.labels).toEqual({ plural: '四辨审核', singular: '四辨审核' })
    expect(PublicProjects.labels).toEqual({ plural: '公开项目', singular: '公开项目' })
    expect(DonationIntentions.labels).toEqual({ plural: '帮助意向', singular: '帮助意向' })
    expect(FeedbackReports.labels).toEqual({ plural: '反馈报告', singular: '反馈报告' })
    expect(Users.labels).toEqual({ plural: '机构用户', singular: '机构用户' })
    expect(Media.labels).toEqual({ plural: '媒体文件', singular: '媒体文件' })

    expect(fieldLabel(AidApplications, 'patientAlias')).toBe('患者脱敏称呼')
    expect(fieldLabel(AidApplications, 'status')).toBe('申请状态')
    expect(selectOptionLabel(AidApplications, 'status', 'needs_materials')).toBe('需补充材料')
    expect(fieldLabel(CaseReviews, 'goodAndHarm')).toBe('辨善恶')
    expect(fieldLabel(PublicProjects, 'verifiedNeed')).toBe('已核实需求')
    expect(fieldLabel(DonationIntentions, 'followUpScript')).toBe('机构跟进话术')
    expect(fieldLabel(FeedbackReports, 'requiresInstitutionReview')).toBe('发布前需机构复核')
  })
})

function fieldLabel(collection: { fields: unknown[] }, name: string): unknown {
  const field = collection.fields.find((item) => isNamedField(item) && item.name === name)
  return isLabeledField(field) ? field.label : undefined
}

function selectOptionLabel(collection: { fields: unknown[] }, name: string, value: string): unknown {
  const field = collection.fields.find((item) => isNamedField(item) && item.name === name)
  if (!isSelectField(field)) return undefined

  return field.options.find((option) => option.value === value)?.label
}

function isNamedField(field: unknown): field is { name: string } {
  return typeof field === 'object' && field !== null && 'name' in field
}

function isLabeledField(field: unknown): field is { label: string } {
  return typeof field === 'object' && field !== null && 'label' in field
}

function isSelectField(field: unknown): field is { options: Array<{ label: string; value: string }> } {
  return typeof field === 'object' && field !== null && 'options' in field && Array.isArray(field.options)
}
