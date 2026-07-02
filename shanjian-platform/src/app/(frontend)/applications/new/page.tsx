import Link from 'next/link'
import React from 'react'

import { AidApplicationForm } from '../../../../components/public/AidApplicationForm'
import { PublicSidebar } from '../../../../components/public/PublicSidebar'
import { submitAidApplication } from './actions'

interface NewApplicationPageProps {
  searchParams: Promise<{
    submitted?: string
  }>
}

export default async function NewApplicationPage({ searchParams }: NewApplicationPageProps) {
  const { submitted } = await searchParams

  return (
    <section className="public-console" aria-labelledby="application-title">
      <PublicSidebar current="applications" />
      <div className="public-workspace">
        <header className="public-topbar">
          <div>
            <span className="breadcrumb">控制台 / 求助申请</span>
            <h1>求助申请</h1>
          </div>
          <Link className="button button-secondary" href="/admin">
            机构后台
          </Link>
        </header>
        <AidApplicationForm action={submitAidApplication} submissionId={submitted} />
      </div>
    </section>
  )
}
