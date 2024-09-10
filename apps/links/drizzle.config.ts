/* eslint-disable node/prefer-global/process */

import { defineConfig } from 'drizzle-kit'

/**
 * Define environment variables with default values
 */
const {
  CLOUDFLARE_ACCOUNT_ID = '',
  CLOUDFLARE_DATABASE_ID = '',
  CLOUDFLARE_API_TOKEN = '',
  NUXT_LIBSQL_URL = 'file:database/data.db',
  NUXT_LIBSQL_AUTH_TOKEN = undefined,
  NUXT_DB_TYPE = 'd1-http',
} = process.env

/**
 * Configure Cloudflare and LibSQL credentials
 */
const d1 = {
  accountId: CLOUDFLARE_ACCOUNT_ID,
  databaseId: CLOUDFLARE_DATABASE_ID,
  token: CLOUDFLARE_API_TOKEN,
}
const libsql = {
  url: NUXT_LIBSQL_URL,
  authToken: NUXT_LIBSQL_AUTH_TOKEN,
}

/**
 * Determine the database driver and credentials
 */
const driver = NUXT_DB_TYPE === 'libsql' ? 'turso' : 'd1-http'
const dbCredentials = NUXT_DB_TYPE === 'libsql' ? libsql : d1

// eslint-disable-next-line no-console
console.log('Using:', driver)

export default defineConfig({
  schema: './server/database/schema.ts',
  out: './server/database',
  dialect: 'sqlite',
  driver,
  dbCredentials,
})
