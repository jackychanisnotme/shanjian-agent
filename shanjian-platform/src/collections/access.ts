import type { Access } from 'payload'

export const isInstitutionUser: Access = ({ req }) => Boolean(req.user)

export const isAdminUser: Access = ({ req }) => {
  const role = typeof req.user === 'object' && req.user && 'role' in req.user ? req.user.role : undefined

  return role === 'admin'
}

export const institutionOnlyAccess = {
  read: isInstitutionUser,
  create: isInstitutionUser,
  update: isInstitutionUser,
  delete: isInstitutionUser,
}

export const adminOnlyAccess = {
  read: isAdminUser,
  create: isAdminUser,
  update: isAdminUser,
  delete: isAdminUser,
}

export const readPublishedOrInstitutionUser: Access = ({ req }) => {
  if (req.user) return true

  return {
    isPublished: {
      equals: true,
    },
  }
}
