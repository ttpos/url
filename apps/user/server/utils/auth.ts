import { sessionTable, userTable } from '@@/server/database/schema'
import { useDrizzle } from '@@/server/utils'
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle'
import { GitHub, Google } from 'arctic'
import { eq } from 'drizzle-orm'
import { appendHeader, getCookie, setCookie } from 'h3'
import { generateId, Lucia } from 'lucia'
import type { UserSession } from '#auth-utils'
import type { EventHandlerRequest, H3Event } from 'h3'
import type { Adapter, Session, User } from 'lucia'

class AuthManager {
  private static luciaInstance: ReturnType<AuthManager['initializeLucia']>
  private static googleInstance: Google
  private event: H3Event<EventHandlerRequest>
  private config: ReturnType<typeof useRuntimeConfig>
  public db: ReturnType<typeof useDrizzle>
  public lucia: ReturnType<AuthManager['initializeLucia']>
  public google: Google

  constructor(event: H3Event<EventHandlerRequest>) {
    logger.info('Creating AuthManager instance')

    const db = useDrizzle(event)

    this.event = event
    this.config = useRuntimeConfig()
    this.db = db
    this.lucia = this.getLuciaInstance(db)
    this.google = this.getGoogleInstance()
  }

  private getLuciaInstance(db: ReturnType<typeof useDrizzle>) {
    if (!AuthManager.luciaInstance) {
      logger.info('AuthManager Init Lucia')

      const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable)
      AuthManager.luciaInstance = this.initializeLucia(adapter)
    }
    return AuthManager.luciaInstance
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

  private initializeLucia(adapter: Adapter) {
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

  /**
   * Authenticates and returns user and session information.
   */
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

  /**
   * Creates a session for a user
   */
  public async createSession(
    userId: string,
    sessionData?: {
      status?: number
      sessionToken?: string
      metadata?: Record<string, any>
    },
    useAppendHeader = false,
  ) {
    const { headers } = this.event.node.req

    const metadata = {
      ip: headers?.['x-forwarded-for'] || '',
      country: '',
      deviceInfo: headers?.['user-agent'] || '',
      createdAt: Date.now(),
    }

    // Create a session
    const session = await this.lucia.createSession(
      userId,
      Object.assign(
        {
          status: 1,
          sessionToken: generateId(32),
          // eslint-disable-next-line node/prefer-global/buffer
          metadata: Buffer.from(JSON.stringify(metadata)),
        },
        sessionData,
      ),
    )

    // Set the session cookie
    const sessionCookie = this.lucia.createSessionCookie(session.id)

    if (useAppendHeader) {
      appendHeader(this.event, 'Set-Cookie', sessionCookie.serialize())
    }
    else {
      setCookie(this.event, sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
    }

    return session
  }

  /**
   * Sets a session cookie for a given session ID.
   */
  public setSessionCookie(sessionId: string) {
    const luciaToken = this.lucia.createSessionCookie(sessionId)
    setCookie(this.event, luciaToken.name, luciaToken.value, luciaToken.attributes)
  }

  /**
   * Sets a blank session cookie.
   */
  public setBlankSessionCookie() {
    const blankSessionCookie = this.lucia.createBlankSessionCookie()
    setCookie(this.event, blankSessionCookie.name, blankSessionCookie.value, blankSessionCookie.attributes)
  }

  // etc.
  public async setUserSession(user: UserSession) {
    // Check for existing sessions
    const existingSession = await this.db.query.sessionTable.findFirst({
      where: eq(sessionTable.userId, user.id.toString()),
    })

    const sessionData = {
      userId: user.id.toString(),
      sessionToken: generateCode(32),
      expiresAt: Date.now() + 4 * 60 * 60 * 1000, // Expires in 4 hours
      status: 'active',
      isDeleted: 0,
      // eslint-disable-next-line node/prefer-global/buffer
      metadata: Buffer.from(JSON.stringify({
        ip: this.event.node.req.headers['x-forwarded-for'] || '',
        country: '',
        deviceInfo: this.event.node.req.headers['user-agent'] || '',
        createdAt: Date.now(),
      })),
    }

    if (existingSession) {
      await this.db
        .update(sessionTable)
        .set(sessionData)
        .where(eq(sessionTable.id, existingSession[0].id))
    }
    else {
      await this.db.insert(sessionTable).values({
        id: generateCode(15),
        ...sessionData,
      })
    }

    return await replaceUserSession(this.event, {
      user: {
        id: user.id,
        name: user.name!,
        email: user.email!,
      },
      id: user.id,
      loggedInAt: Date.now(),
    })
  }

  public async getCurrentUser() {
    // Get the current user session
    const session = await getUserSession(this.event)

    // return null if there's no user
    if (!session.user) {
      return null
    }

    // we're getting the whole user object by default for convenience, but always remove the password
    const result = (await this.db.select().from(userTable).where(eq(userTable.id, session.user.id)).limit(1))?.[0]
    delete result.password
    return result
  }

  public async requireUserSession() {
    // Get the current user session
    const session = await getUserSession(this.event)

    // return null if there's no user
    if (!session.user) {
      return null
    }

    // Require a user session (send back 401 if no `user` key in session)
    return await requireUserSession(this.event)
  }

  public async clearUserSession() {
    const currentSession = await getUserSession(this.event)

    if (currentSession && currentSession.user) {
      await this.db
        .update(sessionTable)
        .set({
          // eslint-disable-next-line ts/ban-ts-comment
          // @ts-expect-error
          isDeleted: 1,
        })
        .where(eq(sessionTable.userId, currentSession.user.id.toString()))
    }

    // Clear the current user session
    return await clearUserSession(this.event)
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
  }
}

declare module 'lucia' {
  interface Register {
    Lucia: ReturnType<AuthManager['initializeLucia']>
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
