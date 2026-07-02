import type { Access } from 'payload'

export const isInstitutionUser: Access = ({ req }) => Boolean(req.user)

export const institutionOnlyAccess = {
  read: isInstitutionUser,
  create: isInstitutionUser,
  update: isInstitutionUser,
  delete: isInstitutionUser,
}

export const readPublishedOrInstitutionUser: Access = ({ req }) => {
  if (req.user) return true

  return {
    isPublished: {
      equals: true,
    },
  }
}
