import { sessionTable, userTable } from '@@/server/database/schema'
import { useDrizzle } from '@@/server/utils'
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle'
import { GitHub, Google } from 'arctic'
import { Lucia } from 'lucia'

const config = useRuntimeConfig()
const db = useDrizzle()

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable)

export const lucia = new Lucia(adapter, {
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

// IMPORTANT!
declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
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
  config.public.githubClientId,
  config.public.githubClientSecret,
)

export const google = new Google(
  config.public.googleClientId,
  config.public.googleClientSecret,
  config.public.googleRedirectURI,
)
