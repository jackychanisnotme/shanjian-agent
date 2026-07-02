'use server'

import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import config from '../../../../payload.config'
import { createDonationIntentionFromForm } from '../../../../server/workflow'

export async function submitDonationIntention(formData: FormData) {
  const payload = await getPayload({ config: await config })
  const created = await createDonationIntentionFromForm(payload, formData)

  redirect(`/intentions/new?submitted=${created.id}`)
}
