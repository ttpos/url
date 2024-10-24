import { sessionTable, userTable } from '@@/server/database/schema'
import { decrypt, encrypt, generateCode, useDrizzle } from '@@/server/utils'
import { and, eq } from 'drizzle-orm'
import type { UserSession } from '#auth-utils'
import type { SessionSource } from '~~/server/types'
import type { EventHandlerRequest, H3Event } from 'h3'

class AuthManager {
  private event: H3Event<EventHandlerRequest>
  private config: ReturnType<typeof useRuntimeConfig>
  public db: ReturnType<typeof useDrizzle>

  constructor(event: H3Event<EventHandlerRequest>) {
    this.event = event
    this.config = useRuntimeConfig()
    this.db = useDrizzle(event)
  }

  public async createUserSession(user: UserSession, source: SessionSource, remember: boolean = false) {
    const { sessionExpiryDays } = this.config
    const maxRetries = 3
    let retries = 0

    if (!user.id) {
      throw new Error('User ID is required')
    }

    while (retries < maxRetries) {
      const sessionData = {
        id: generateCode(15),
        userId: user.id.toString(),
        sessionToken: generateCode(32),
        expiresAt: remember ? Date.now() + Number(sessionExpiryDays) * 24 * 60 * 60 * 1000 : 0,
        source,
        status: 'active',
        // eslint-disable-next-line node/prefer-global/buffer
        metadata: Buffer.from(JSON.stringify({
          ip: this.event.node.req.headers['x-forwarded-for'] || '',
          country: '',
          deviceInfo: this.event.node.req.headers['user-agent'] || '',
          createdAt: Date.now(),
        })),
      }

      try {
        await this.db?.insert(sessionTable).values(sessionData)

        // set user cookie
        if (remember) {
          await this.setUserCookie(
            {
              id: user.id,
              sessionId: sessionData.id,
              nickname: user.nickname,
              email: user.email || '',
              phone: user.phone || '',
              loggedInAt: Date.now(),
            },
            remember,
          )
        }

        return await replaceUserSession(
          this.event,
          {
            user: {
              id: user.id,
              sessionId: sessionData.id,
              nickname: user.nickname || '',
              email: user.email || '',
              phone: user.phone || '',
            },
            secure: {
              ...sessionData,
            },
            loggedInAt: Date.now(),
          },
          {
            maxAge: remember ? Number(sessionExpiryDays) * 24 * 60 * 60 : 0,
          },
        )
      }
      catch (error) {
        logger.error?.(`Failed to insert session data. Attempt ${retries + 1} of ${maxRetries}`, error)
        retries++

        if (retries >= maxRetries) {
          throw new Error('Failed to create user session after multiple attempts')
        }

        // retry after a short delay
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
  }

  public async setUserCookie(user: UserSession, remember: boolean = false) {
    const { cookieKey, sessionExpiryDays } = this.config
    const encryptedData = encrypt(this.config.encryptionKey, JSON.stringify(user))

    setCookie(
      this.event,
      cookieKey,
      encryptedData,
      {
        maxAge: remember ? Number(sessionExpiryDays) * 24 * 60 * 60 : undefined,
        httpOnly: true,
        secure: true, // process.env.NODE_ENV === 'production'
        sameSite: 'lax',
        path: '/',
      },
    )
  }

  public async checkUserCookie() {
    try {
      const { cookieKey, sessionExpiryDays } = this.config

      const encryptedCookie = getCookie(this.event, cookieKey)
      if (!encryptedCookie) {
        return null
      }

      const decryptedData = decrypt(this.config.encryptionKey, encryptedCookie)
      const userData = JSON.parse(decryptedData)
      logger.log?.('🚀 ~ AuthManager ~ checkUserCookie ~ userData:', userData)

      // 如果 _nn.sessionId 在反查 sessionTable 是否存在
      // 存在是否在有效期内 expiresAt 并且 删除状态是否正确
      // 如果在有效期内，更新 sessionTable 表 expiresAt 字段 + 30 day
      // 之后再更新 setUserCookie
      const session = await this.db?.query.sessionTable.findFirst({
        where: and(
          eq(sessionTable.id, userData.sessionId),
          eq(sessionTable.isDeleted, 0),
        ),
      })

      if (session) {
        const newExpiryDate = Date.now() + Number(sessionExpiryDays) * 24 * 60 * 60 * 1000

        await this.db
          ?.update(sessionTable)
          .set({ expiresAt: newExpiryDate })
          .where(eq(sessionTable.id, userData.sessionId))

        await this.setUserCookie(
          {
            id: userData.id,
            sessionId: userData.sessionId,
            nickname: userData.nickname,
            email: userData.email || '',
            phone: userData.phone || '',
            loggedInAt: Date.now(),
          },
          true,
        )

        return userData
      }
      else {
        logger.warn?.('The session does not exist or has expired')
        return null
      }
    }
    catch (error) {
      logger.error?.('Failed to decrypt, failed to determine cookie', error)

      return null
    }
  }

  public async getCurrentUser() {
    const session = await getUserSession(this.event)
    if (!session?.user) {
      return null
    }

    const user = await this.db?.query.userTable.findFirst({
      where: eq(userTable.id, String(session.user.id)),
    })

    if (user && user.password) {
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-ignore
      delete user.password
    }
    return user
  }

  /**
   * Clear all sessions for a user
   */
  public async clearUserSession(isAll: boolean = false) {
    const currentSession = await getUserSession(this.event)
    if (!currentSession?.user)
      return await clearUserSession(this.event)

    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-ignore
    const updateQuery = this.db?.update(sessionTable).set({ isDeleted: 1 })

    if (isAll) {
      await updateQuery?.where(eq(sessionTable.userId, currentSession.user.id.toString()))
    }
    else {
      await updateQuery?.where(eq(sessionTable.id, currentSession.user.sessionId))
    }

    return await clearUserSession(this.event)
  }

  public async getUserActiveSessions(userId: string) {
    return await this.db?.query.sessionTable.findMany({
      where: and(
        eq(sessionTable.userId, userId),
        eq(sessionTable.isDeleted, 1),
      ),
    })
  }
}

export function useAuth(event: H3Event<EventHandlerRequest>) {
  return new AuthManager(event)
}
