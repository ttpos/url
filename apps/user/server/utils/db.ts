import * as schema from '@@/server/database/schema'
import { createClient } from '@libsql/client'
import { drizzle as drizzleD1 } from 'drizzle-orm/d1'
import { drizzle as drizzleSqlite } from 'drizzle-orm/libsql'
import type { DrizzleD1Database } from 'drizzle-orm/d1'
import type { LibSQLDatabase } from 'drizzle-orm/libsql'
import type { EventHandlerRequest, H3Event } from 'h3'

class DatabaseManger {
  static instance: DatabaseManger
  public db: LibSQLDatabase<typeof schema> | DrizzleD1Database<typeof schema>

  constructor(event: H3Event<EventHandlerRequest>) {
    if (DatabaseManger.instance) {
      return DatabaseManger.instance
    }
    DatabaseManger.instance = this

    logger.info('Creating DatabaseManger instance')
    const { dbType, libsqlUrl, libsqlAuthToken } = useRuntimeConfig(event)

    switch (dbType) {
      case 'libsql': {
        const db = createClient({
          url: libsqlUrl,
          authToken: libsqlAuthToken,
        })
        this.db = drizzleSqlite(db, { schema })
        return this
      }
      case 'd1': {
        const { DB = '' } = event.context.cloudflare?.env || {}
        if (!DB) {
          logger.error('D1 database not found')
          return null
        }
        this.db = drizzleD1(DB, { schema })
        return this
      }
      default: {
        logger.error(`Unsupported DB type: ${dbType}`)
        return null
      }
    }
  }
}

export function useDrizzle(event: H3Event<EventHandlerRequest>) {
  return new DatabaseManger(event).db
}
