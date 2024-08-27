import type { EventHandlerRequest, H3Event } from 'h3'
import { drizzle as drizzleSqlite } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import { drizzle as drizzleD1 } from 'drizzle-orm/d1'

import * as schema from '@@/database/schema'

export function initializeDrizzle(event: H3Event<EventHandlerRequest>) {
  const nuxt = useRuntimeConfig()

  switch (nuxt.dbType) {
    case 'libsql': {
      const db = createClient({
        url: nuxt.libsqlUrl,
        authToken: nuxt.libsqlAuthToken,
      })
      return drizzleSqlite(db, { schema })
    }
    case 'cf': {
      const { DB = '' } = event.context.cloudflare?.env || {}
      if (!DB) {
        logger.error('D1 database not found')
        return false
      }
      return drizzleD1(DB, { schema })
    }
    default: {
      logger.error(`Unsupported DB type: ${nuxt.dbType}`)
    }
  }
}

let drizzleDB: ReturnType<typeof initializeDrizzle>

export default defineEventHandler(async (event) => {
  if (!drizzleDB) {
    drizzleDB = initializeDrizzle(event)
  }

  event.context.db = drizzleDB
})

declare module 'h3' {
  interface H3EventContext {
    db: ReturnType<typeof initializeDrizzle>
  }
}
