import { formatAdminURL } from 'payload/shared'

interface BuildAdminLogoutHrefArgs {
  adminRoute: string
  logoutRoute: string
}

export function buildAdminLogoutHref({ adminRoute, logoutRoute }: BuildAdminLogoutHrefArgs): string {
  return formatAdminURL({
    adminRoute: toSlashPath(adminRoute),
    path: toSlashPath(logoutRoute),
  })
}

function toSlashPath(path: string): `/${string}` {
  return path.startsWith('/') ? (path as `/${string}`) : `/${path}`
}
