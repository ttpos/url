/* eslint-disable node/prefer-global/process */

import * as schema from '@@/server/database/schema'
import { createClient } from '@libsql/client'
import { drizzle as drizzleSqlite } from 'drizzle-orm/libsql'
import type { LibSQLDatabase } from 'drizzle-orm/libsql'

type Constructor = new (...args: any) => any

export function singleton<C extends Constructor>(
  ClassName: C,
  args?: ConstructorParameters<C>,
) {
  let instance: InstanceType<C>

  const ProxyClass = new Proxy(ClassName, {
    get(_target, prop, receiver) {
      instance = instance ?? (new ClassName(args) as typeof instance)
      return Reflect.get(instance, prop, receiver)
    },
  })

  return ProxyClass as typeof instance
}

class dbConnect {
  public db: LibSQLDatabase<typeof schema>

  constructor() {
    this.db = this.init()
  }

  init() {
    logger.info('dbConnect init')

    const {
      NUXT_LIBSQL_URL = 'file:database/data.db',
      NUXT_LIBSQL_AUTH_TOKEN = undefined,
    } = process.env

    const libsqlClient = createClient({
      url: NUXT_LIBSQL_URL,
      authToken: NUXT_LIBSQL_AUTH_TOKEN,
    })

    const db = drizzleSqlite(libsqlClient, { schema })

    return db
  }
}

export function useDrizzle(env?: any) {
  return singleton(dbConnect, env).db
}
