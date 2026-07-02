import { notFound } from 'next/navigation'
import React from 'react'

import { IntentionRegistrationForm } from '../../../../components/public/IntentionRegistrationForm'
import { seedPublicProjects } from '../../../../domain/demoSeed'

interface NewIntentionPageProps {
  searchParams: Promise<{
    project?: string
  }>
}

export default async function NewIntentionPage({ searchParams }: NewIntentionPageProps) {
  const { project: projectSlug } = await searchParams
  const project =
    seedPublicProjects.find((item) => item.slug === projectSlug) ?? seedPublicProjects[0]

  if (!project) {
    notFound()
  }

  return <IntentionRegistrationForm project={project} />
}
