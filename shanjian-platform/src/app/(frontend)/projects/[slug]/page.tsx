import { notFound } from 'next/navigation'
import React from 'react'
import { getPayload } from 'payload'

import { ProjectDetailView } from '../../../../components/public/ProjectDetailView'
import config from '../../../../payload.config'
import { findPublishedPublicProjectBySlug } from '../../../../server/publicProjects'

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params
  const payload = await getPayload({ config: await config })
  const project = await findPublishedPublicProjectBySlug(payload, slug)

  if (!project) {
    notFound()
  }

  return <ProjectDetailView project={project} />
}
