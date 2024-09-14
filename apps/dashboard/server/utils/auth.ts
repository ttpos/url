import { BetterSqlite3Adapter } from '@lucia-auth/adapter-sqlite'
import { Lucia } from 'lucia'
import { db } from './db'

import type { DatabaseUser } from './db'

const adapter = new BetterSqlite3Adapter(db, {
  user: 'user',
  session: 'session',
})

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !import.meta.dev,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
    }
  },
})

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: Omit<DatabaseUser, 'id'>
  }
}
