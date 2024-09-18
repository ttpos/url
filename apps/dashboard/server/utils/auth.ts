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
      // secure: import.meta.dev,
      secure: true, // set to `true` when using HTTPS
    },
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      name: attributes.name,
      email: attributes.email,
      isEmailVerified: attributes.isEmailVerified,
    }
  },
})

// IMPORTANT!
declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: Omit<DatabaseUser, 'password'>
  }
}

interface DatabaseUser {
  id: string
  name: string
  email: string
  isEmailVerified: string
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
