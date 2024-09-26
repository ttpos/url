import { sessionTable, userTable } from '@@/server/database/schema'
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle'
import { D1Adapter } from '@lucia-auth/adapter-sqlite'
import { GitHub, Google } from 'arctic'
import { Lucia } from 'lucia'
import type { useDrizzle } from '@@/server/utils'

const config = useRuntimeConfig()

export function initializeLucia(db: ReturnType<typeof useDrizzle>) {
  const adapter = config.dbType === 'libsql'
    ? new DrizzleSQLiteAdapter(db, sessionTable, userTable)
    : new D1Adapter(db, { user: 'userTable', session: 'sessionTable' })
    // : new D1Adapter(db, { sessionTable, userTable })

  return new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        // set to `true` when using HTTPS
        secure: import.meta.dev,
        // secure: true,
      },
    },
    getUserAttributes: (attributes) => {
      return {
        id: attributes.id,
        nickname: attributes.nickname,
        email: attributes.email,
        isEmailVerified: attributes.isEmailVerified,
      }
    },
    getSessionAttributes: (attributes) => {
      return {
        status: attributes.status,
        sessionToken: attributes.sessionToken,
        metadata: attributes.metadata,
      }
    },
  })
}

// IMPORTANT!
declare module 'lucia' {
  interface Register {
    Lucia: ReturnType<typeof initializeLucia>
    DatabaseUserAttributes: Omit<DatabaseUser, 'password'>
    DatabaseSessionAttributes: Omit<DatabaseSession, 'password'>
  }
}

interface DatabaseUser {
  id: string
  nickname: string
  email: string
  isEmailVerified: string
}

interface DatabaseSession {
  status: number
  sessionToken: string
  metadata: object
}

export const github = new GitHub(
  config.githubClientId,
  config.githubClientSecret,
)

export const google = new Google(
  config.googleClientId,
  config.googleClientSecret,
  config.googleRedirectURI,
)
