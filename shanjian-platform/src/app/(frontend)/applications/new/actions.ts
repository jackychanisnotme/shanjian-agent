'use server'

import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import config from '../../../../payload.config'
import { createAidApplicationFromForm } from '../../../../server/workflow'

export async function submitAidApplication(formData: FormData) {
  const payload = await getPayload({ config: await config })
  const created = await createAidApplicationFromForm(payload, formData)

  redirect(`/applications/new?submitted=${created.id}`)
}
