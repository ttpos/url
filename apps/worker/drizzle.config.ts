import { defineConfig } from 'drizzle-kit'

// Define environment variables with default values
const {
  CLOUDFLARE_ACCOUNT_ID = '',
  CLOUDFLARE_DATABASE_ID = '',
  CLOUDFLARE_API_TOKEN = '',
  LIBSQL_URL = 'file:database/data.db',
  LIBSQL_AUTH_TOKEN = '',
  NUXT_DB_TYPE = 'd1-http',
} = process.env

// Configure Cloudflare and LibSQL credentials
const cf = {
  accountId: CLOUDFLARE_ACCOUNT_ID,
  databaseId: CLOUDFLARE_DATABASE_ID,
  token: CLOUDFLARE_API_TOKEN,
}

const libsql = {
  url: LIBSQL_URL,
  authToken: LIBSQL_AUTH_TOKEN,
}

// Determine the database driver and credentials
const driver = NUXT_DB_TYPE === 'libsql' ? 'turso' : 'd1-http'
const dbCredentials = NUXT_DB_TYPE === 'libsql' ? libsql : cf

console.log('Using:', driver)

export default defineConfig({
  schema: './database/schema.ts',
  out: './database',
  dialect: 'sqlite',
  driver,
  dbCredentials,
})
