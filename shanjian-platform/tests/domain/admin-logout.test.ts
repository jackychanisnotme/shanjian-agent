import { describe, expect, it } from 'vitest'

import { buildAdminLogoutHref } from '../../src/components/admin/logoutHref'
import configPromise from '../../src/payload.config'

describe('Payload admin logout', () => {
  it('uses a visible Chinese logout button in the admin shell', async () => {
    const config = await configPromise

    expect(config.admin.components?.actions ?? []).toContain('/components/admin/LogoutButton#LogoutButton')
  })

  it('builds the logout href from Payload admin routes', () => {
    expect(buildAdminLogoutHref({ adminRoute: '/admin', logoutRoute: '/logout' })).toBe('/admin/logout')
  })
})
