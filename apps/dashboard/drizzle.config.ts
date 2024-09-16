/* eslint-disable node/prefer-global/process */

import { defineConfig } from 'drizzle-kit'

/**
 * Define environment variables with default values
 */
const {
  NUXT_LIBSQL_URL = 'file:database/data.db',
  NUXT_LIBSQL_AUTH_TOKEN = undefined,
} = process.env

export default defineConfig({
  schema: './server/database/schema.ts',
  out: './server/database',
  dialect: 'sqlite',
  driver: 'turso',
  dbCredentials: {
    url: NUXT_LIBSQL_URL,
    authToken: NUXT_LIBSQL_AUTH_TOKEN,
  },
})
