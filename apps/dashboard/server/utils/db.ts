/* eslint-disable node/prefer-global/process */

import * as schema from '@@/server/database/schema'
import { createClient } from '@libsql/client'
import { drizzle as drizzleSqlite } from 'drizzle-orm/libsql'

// const {
//   NUXT_LIBSQL_URL = 'file:database/data.db',
//   NUXT_LIBSQL_AUTH_TOKEN = undefined,
// } = useRuntimeConfig()

const {
  NUXT_LIBSQL_URL = 'file:database/data.db',
  NUXT_LIBSQL_AUTH_TOKEN = undefined,
} = process.env

const db = createClient({
  url: NUXT_LIBSQL_URL,
  authToken: NUXT_LIBSQL_AUTH_TOKEN,
})

export function useDrizzle() {
  return drizzleSqlite(db, { schema })
}
