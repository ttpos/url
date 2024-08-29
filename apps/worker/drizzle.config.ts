import { defineConfig } from 'drizzle-kit'

// Define environment variables with default values
const {
  NUXT_CLOUDFLARE_ACCOUNT_ID = '',
  NUXT_CLOUDFLARE_DATABASE_ID = '',
  NUXT_CLOUDFLARE_API_TOKEN = '',
  NUXT_LIBSQL_URL = 'file:database/data.db',
  NUXT_LIBSQL_AUTH_TOKEN = '',
  NUXT_DB_TYPE = 'd1-http',
} = process.env

// Configure Cloudflare and LibSQL credentials
const d1 = {
  accountId: NUXT_CLOUDFLARE_ACCOUNT_ID,
  databaseId: NUXT_CLOUDFLARE_DATABASE_ID,
  token: NUXT_CLOUDFLARE_API_TOKEN,
}

const libsql = {
  url: NUXT_LIBSQL_URL,
  authToken: NUXT_LIBSQL_AUTH_TOKEN,
}

// Determine the database driver and credentials
const driver = NUXT_DB_TYPE === 'libsql' ? 'turso' : 'd1-http'
const dbCredentials = NUXT_DB_TYPE === 'libsql' ? libsql : d1

console.log('Using:', driver)

export default defineConfig({
  schema: './database/schema.ts',
  out: './database',
  dialect: 'sqlite',
  driver,
  dbCredentials,
})
