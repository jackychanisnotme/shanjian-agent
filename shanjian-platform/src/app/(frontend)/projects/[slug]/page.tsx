import { notFound } from 'next/navigation'
import React from 'react'

import { ProjectDetailView } from '../../../../components/public/ProjectDetailView'
import { seedPublicProjects } from '../../../../domain/demoSeed'

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params
  const project = seedPublicProjects.find((item) => item.slug === slug)

  if (!project) {
    notFound()
  }

  return <ProjectDetailView project={project} />
}
