/* eslint-disable no-console */
import { defineConfig } from 'drizzle-kit'

const cf = {
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID || '',
  databaseId: process.env.CLOUDFLARE_DATABASE_ID || '',
  token: process.env.CLOUDFLARE_API_TOKEN || '',
}
const libsql = {
  url: process.env.LIBSQL_URL || 'file:database/data.db',
  authToken: process.env.LIBSQL_AUTH_TOKEN,
}
const driver = process.env.NUXT_DB_TYPE === 'libsql' ? 'turso' : 'd1-http'
const dbCredentials = process.env.NUXT_DB_TYPE === 'libsql' ? libsql : cf

console.log('Using:', driver)

export default defineConfig({
  schema: './database/schema.ts',
  out: './database',
  dialect: 'sqlite',
  driver,
  dbCredentials,
})
