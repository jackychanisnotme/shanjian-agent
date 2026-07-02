import React from 'react'

import { ProjectRegistry } from '../../../components/public/ProjectRegistry'
import { seedPublicProjects } from '../../../domain/demoSeed'

export default function ProjectsPage() {
  return <ProjectRegistry projects={seedPublicProjects} />
}
