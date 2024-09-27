import { sessionTable, userTable } from '@@/server/database/schema'
import { useDrizzle } from '@@/server/utils'
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle'
import { D1Adapter } from '@lucia-auth/adapter-sqlite'
import { GitHub, Google } from 'arctic'
import { appendHeader, getCookie } from 'h3'
import { Lucia } from 'lucia'
import type { EventHandlerRequest, H3Event } from 'h3'
import type { Session, User } from 'lucia'

class AuthManager {
  private static luciaInstance: ReturnType<typeof initializeLucia>
  private static githubInstance: GitHub
  private static googleInstance: Google
  private event: H3Event<EventHandlerRequest>
  private config: ReturnType<typeof useRuntimeConfig>
  public lucia: ReturnType<typeof initializeLucia>
  public github: GitHub
  public google: Google

  constructor(event: H3Event<EventHandlerRequest>) {
    logger.info('Creating AuthManager instance')

    const db = useDrizzle(event)

    this.event = event
    this.config = useRuntimeConfig()
    this.lucia = this.getLuciaInstance(db)
    this.github = this.getGitHubInstance()
    this.google = this.getGoogleInstance()
  }

  private getLuciaInstance(db: ReturnType<typeof useDrizzle>) {
    if (!AuthManager.luciaInstance) {
      logger.info('AuthManager Init Lucia')
      const adapter = this.config.dbType === 'libsql'
        ? new DrizzleSQLiteAdapter(db, sessionTable, userTable)
        : new D1Adapter(db, { user: 'userTable', session: 'sessionTable' })

      AuthManager.luciaInstance = new Lucia(adapter, {
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
    return AuthManager.luciaInstance
  }

  private getGitHubInstance() {
    if (!AuthManager.githubInstance) {
      AuthManager.githubInstance = new GitHub(
        this.config.githubClientId,
        this.config.githubClientSecret,
      )
    }
    return AuthManager.githubInstance
  }

  private getGoogleInstance() {
    if (!AuthManager.googleInstance) {
      AuthManager.googleInstance = new Google(
        this.config.googleClientId,
        this.config.googleClientSecret,
        this.config.googleRedirectURI,
      )
    }
    return AuthManager.googleInstance
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
  return new AuthManager(event)
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
