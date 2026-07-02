import React from 'react'

import { ProjectRegistry } from '../../components/public/ProjectRegistry'
import { seedPublicProjects } from '../../domain/demoSeed'
import './styles.css'

export default function HomePage() {
  return <ProjectRegistry projects={seedPublicProjects} />
}
