import { sessionTable, userTable } from '@@/server/database/schema'
import { useDrizzle } from '@@/server/utils'
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle'
import { D1Adapter } from '@lucia-auth/adapter-sqlite'
import { GitHub, Google } from 'arctic'
import { Lucia } from 'lucia'
import type { EventHandlerRequest, H3Event } from 'h3'
import type { Session, User } from 'lucia'

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

class AuthManager {
  private static instance: AuthManager
  public lucia: ReturnType<typeof initializeLucia>
  private event: H3Event<EventHandlerRequest>

  constructor(event: H3Event<EventHandlerRequest>, db: ReturnType<typeof useDrizzle>) {
    // TODO: Can't use singleton patterns, event
    // if (AuthManager.instance) {
    //   return AuthManager.instance
    // }
    // AuthManager.instance = this

    logger.info('Creating AuthManager instance')

    this.event = event
    this.lucia = initializeLucia(db)
  }

  public async getAuth() {
    const sessionId = getCookie(this.event, this.lucia.sessionCookieName) ?? null
    if (!sessionId) {
      return {
        user: null,
        session: null,
      }
    }

    const { session, user } = await this.lucia.validateSession(sessionId)

    if (session && session.fresh) {
      appendHeader(this.event, 'Set-Cookie', this.lucia.createSessionCookie(session.id).serialize())
    }
    if (!session) {
      appendHeader(this.event, 'Set-Cookie', this.lucia.createBlankSessionCookie().serialize())
    }

    return {
      user,
      session,
    }
  }
}

export function useAuth(event: H3Event<EventHandlerRequest>) {
  const db = useDrizzle(event)

  return new AuthManager(event, db)
}

// IMPORTANT!
declare module 'h3' {
  interface H3EventContext {
    user: User | null
    session: Session | null
    // lucia: ReturnType<typeof initializeLucia>
  }
}

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
