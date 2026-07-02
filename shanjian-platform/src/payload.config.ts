import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { zh } from 'payload/i18n/zh'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { AidApplications } from './collections/AidApplications'
import { CaseReviews } from './collections/CaseReviews'
import { DonationIntentions } from './collections/DonationIntentions'
import { FeedbackReports } from './collections/FeedbackReports'
import { PublicProjects } from './collections/PublicProjects'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      actions: ['/components/admin/LogoutButton#LogoutButton'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  i18n: {
    fallbackLanguage: 'zh',
    supportedLanguages: { zh },
  },
  collections: [
    Users,
    Media,
    AidApplications,
    CaseReviews,
    PublicProjects,
    DonationIntentions,
    FeedbackReports,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
