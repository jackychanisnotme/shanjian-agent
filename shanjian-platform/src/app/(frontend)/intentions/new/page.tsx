import { notFound } from 'next/navigation'
import Link from 'next/link'
import React from 'react'
import { getPayload } from 'payload'

import { IntentionRegistrationForm } from '../../../../components/public/IntentionRegistrationForm'
import { PublicSidebar } from '../../../../components/public/PublicSidebar'
import config from '../../../../payload.config'
import { findPublishedPublicProjectBySlug } from '../../../../server/publicProjects'
import { submitDonationIntention } from './actions'

interface NewIntentionPageProps {
  searchParams: Promise<{
    project?: string
    submitted?: string
  }>
}

export default async function NewIntentionPage({ searchParams }: NewIntentionPageProps) {
  const { project: projectSlug, submitted } = await searchParams
  const payload = await getPayload({ config: await config })
  const project = projectSlug ? await findPublishedPublicProjectBySlug(payload, projectSlug) : undefined

  if (projectSlug && !project) {
    notFound()
  }

  return (
    <section className="public-console" aria-labelledby="intention-title">
      <PublicSidebar current="intentions" />
      <div className="public-workspace">
        <header className="public-topbar">
          <div>
            <span className="breadcrumb">控制台 / 帮助意向</span>
            <h1>帮助意向</h1>
          </div>
          <Link className="button button-secondary" href="/admin">
            机构后台
          </Link>
        </header>
        <IntentionRegistrationForm action={submitDonationIntention} project={project ?? undefined} submissionId={submitted} />
      </div>
    </section>
  )
}
