import * as schema from '@@/server/database/schema'
import { createClient } from '@libsql/client'
import { drizzle as drizzleD1 } from 'drizzle-orm/d1'
import { drizzle as drizzleSqlite } from 'drizzle-orm/libsql'
import type { EventHandlerRequest, H3Event } from 'h3'

export function initializeDrizzle(event: H3Event<EventHandlerRequest>) {
  const { dbType, libsqlUrl, libsqlAuthToken } = useRuntimeConfig(event)

  logger.info(`Using ${dbType} database`)

  switch (dbType) {
    case 'libsql': {
      const db = createClient({
        url: libsqlUrl,
        authToken: libsqlAuthToken,
      })
      return drizzleSqlite(db, { schema })
    }
    case 'd1': {
      const { DB = '' } = event.context.cloudflare?.env || {}
      if (!DB) {
        logger.error('D1 database not found')
        return null
      }
      return drizzleD1(DB, { schema })
    }
    default: {
      logger.error(`Unsupported DB type: ${dbType}`)
      return null
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
