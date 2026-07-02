'use client'

import { Link, LogOutIcon, useConfig } from '@payloadcms/ui'

import { buildAdminLogoutHref } from './logoutHref'

export function LogoutButton() {
  const {
    config: {
      admin: {
        routes: { logout: logoutRoute },
      },
      routes: { admin: adminRoute },
    },
  } = useConfig()

  return (
    <Link
      aria-label="退出登录"
      className="shanjian-admin-logout"
      href={buildAdminLogoutHref({ adminRoute, logoutRoute })}
      prefetch={false}
    >
      <LogOutIcon />
      <span>退出登录</span>
    </Link>
  )
}
