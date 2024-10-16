import { sessionTable, userTable } from '@@/server/database/schema'
import { useDrizzle } from '@@/server/utils'
import { eq } from 'drizzle-orm'
import type { UserSession } from '#auth-utils'
import type { EventHandlerRequest, H3Event } from 'h3'

class AuthManager {
  private event: H3Event<EventHandlerRequest>
  private config: ReturnType<typeof useRuntimeConfig>
  public db: ReturnType<typeof useDrizzle>

  constructor(event: H3Event<EventHandlerRequest>) {
    logger.info('Creating AuthManager instance')

    const db = useDrizzle(event)

    this.event = event
    this.config = useRuntimeConfig()
    this.db = db
  }

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

    if (existingSession && existingSession.id) {
      await this.db
        .update(sessionTable)
        .set(sessionData)
        .where(eq(sessionTable.id, existingSession.id))
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
        nickname: user.nickname,
        email: user.email || '',
        phone: user.phone || '',
      },
      secure: {
        ...sessionData,
      },
      // id: user.id,
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
