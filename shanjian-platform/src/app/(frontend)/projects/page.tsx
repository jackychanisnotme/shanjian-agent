import React from 'react'
import { getPayload } from 'payload'

import { ProjectRegistry } from '../../../components/public/ProjectRegistry'
import config from '../../../payload.config'
import { getPublishedPublicProjects } from '../../../server/publicProjects'

export default async function ProjectsPage() {
  const payload = await getPayload({ config: await config })
  const projects = await getPublishedPublicProjects(payload)

  return <ProjectRegistry projects={projects} />
}
