import type { Payload } from 'payload'

import type {
  EvidenceItem,
  ProjectStatus,
  PublicProject as DomainPublicProject,
  ResourceNeed,
} from '../domain/charity'
import type { PublicProject as PayloadPublicProject } from '../payload-types'

export async function getPublishedPublicProjects(payload: Payload): Promise<DomainPublicProject[]> {
  const result = await payload.find({
    collection: 'public-projects',
    depth: 0,
    limit: 100,
    sort: '-updatedAt',
    where: {
      isPublished: {
        equals: true,
      },
    },
  })

  return result.docs.map(payloadPublicProjectToDomain)
}

export async function findPublishedPublicProjectBySlug(
  payload: Payload,
  slug: string,
): Promise<DomainPublicProject | null> {
  const result = await payload.find({
    collection: 'public-projects',
    depth: 0,
    limit: 1,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        {
          isPublished: {
            equals: true,
          },
        },
      ],
    },
  })

  const project = result.docs[0]
  return project ? payloadPublicProjectToDomain(project) : null
}

export function payloadPublicProjectToDomain(project: PayloadPublicProject): DomainPublicProject {
  return {
    id: String(project.id),
    slug: project.slug,
    patientAlias: project.patientAlias,
    diseaseLabel: project.diseaseLabel,
    status: project.status as ProjectStatus,
    region: project.region,
    verifiedNeed: project.verifiedNeed,
    resourceGap: project.resourceGap,
    matchedIntentions: project.matchedIntentions,
    needs: asResourceNeeds(project.needs),
    progress: asStringArray(project.progress),
    story: project.story,
    evidenceSummary: asStringArray(project.evidenceSummary),
    feedback: asStringArray(project.feedback),
    isPublished: Boolean(project.isPublished),
  }
}

export function asResourceNeeds(value: unknown): ResourceNeed[] {
  return Array.isArray(value) ? (value.filter(isResourceNeed) as ResourceNeed[]) : []
}

export function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

export function asEvidenceItems(value: unknown): EvidenceItem[] {
  return Array.isArray(value) ? (value.filter(isEvidenceItem) as EvidenceItem[]) : []
}

function isResourceNeed(value: unknown): value is ResourceNeed {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'type' in value &&
    'category' in value &&
    'label' in value &&
    'description' in value &&
    'priority' in value
  )
}

function isEvidenceItem(value: unknown): value is EvidenceItem {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'label' in value &&
    'status' in value &&
    'note' in value
  )
}
