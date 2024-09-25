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

type Constructor = new (...args: any) => any

export function singleton<C extends Constructor>(
  ClassName: C,
  ...args: ConstructorParameters<C>
) {
  let instance: InstanceType<C>

  const ProxyClass = new Proxy(ClassName, {
    get(_target, prop, receiver) {
      instance = instance ?? new ClassName(...args)
      return Reflect.get(instance, prop, receiver)
    },
  })

  return ProxyClass as typeof instance
}

class dbConnect {
  public db: ReturnType<typeof initializeDrizzle>

  constructor(event: H3Event<EventHandlerRequest>) {
    this.db = initializeDrizzle(event)
  }
}

export function useDrizzle(event: H3Event<EventHandlerRequest>) {
  return singleton(dbConnect, event).db
}
