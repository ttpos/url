import { sessionTable, usersOauthTable, userTable } from '@@/server/database/schema'
import { generateCode, useAuth, useDrizzle } from '@@/server/utils'
import { and, eq, sql } from 'drizzle-orm'
import type { GitHubUser } from '~~/server/types'

export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true,
  },
  async onSuccess(event, { user, tokens }: { user: GitHubUser, tokens: any }) {
    try {
      const db = useDrizzle(event)
      const auth = useAuth(event)
      logger.log('🚀 ~ onSuccess ~ githubUser:', user)
      logger.log('🚀 ~ onSuccess ~ tokens:', tokens)

      /**
       * Check if the user already has a GitHub OAuth record
       *
       * 检查用户是否已经有GitHub OAuth记录
       */
      // const existingOauthRecord = await db.query.usersOauthTable.findFirst({
      //   where: table => eq(table.provider, 'github') && eq(table.providerUserId, githubUser.id.toString()),
      // })
      const existingOauthRecord = await db.query.usersOauthTable.findFirst({
        where: and(
          eq(usersOauthTable.provider, 'github'),
          eq(usersOauthTable.providerUserId, user.id.toString()),
        ),
      })

      logger.log('Existing OAuth Record:', existingOauthRecord)

      /**
       * Check if there's an active session
       *
       * 检查是否有活动会话
       */
      const sessionId = getCookie(event, 'Set-Cookie')
      logger.log('🚀 ~ onSuccess ~ sessionId:', sessionId)
      const activeSession = sessionId
        ? await db.query.sessionTable.findFirst({
          where: eq(sessionTable.id, sessionId),
        })
        : null

      if (existingOauthRecord) {
        /**
         * GitHub account is already linked to a user
         *
         * GitHub 帐户已链接到用户
         */
        const existingUser = await db.query.userTable.findFirst({
          where: eq(userTable.id, existingOauthRecord.userId),
        })
        logger.log('🚀 ~ defineEventHandler ~ existingUser:', existingUser)

        if (existingUser) {
          if (activeSession && activeSession.userId !== existingUser.id) {
            /**
             * TODO: pending
             *
             * User is logged in but with a different account
             * Ask user if they want to link accounts or log out and log in with GitHub
             *
             * 用户登录，但使用不同的帐户
             * 询问用户是否要链接帐户或注销并登录GitHub
             */
            return sendRedirect(event, '/oauth/link-accounts?provider=github')
          }

          // await auth.createSession(existingUser.id, null, true)
          await auth.setUserSession(existingUser)

          return sendRedirect(event, '/')
        }
      }
      else {
        /**
         * No existing OAuth record
         *
         * 没有现有的 OAuth 记录
         */
        if (activeSession) {
          /**
           * User is logged in, bind GitHub to current account
           *
           * 用户已登录，将GitHub绑定到当前账户
           */
          await db.insert(usersOauthTable).values({
            id: generateCode(15),
            userId: activeSession.userId,
            provider: 'github',
            providerUserId: user.id.toString(),
          })
          // TODO: pending
          return sendRedirect(event, '/profile?oauth_linked=github')
        }
        else {
          /**
           * User is not logged in
           * Check if there's an existing user with the same email
           *
           *
           * 用户未登录
           * 检查是否存在具有相同电子邮件地址的现有用户
           */
          const existingUser = await db.query.userTable.findFirst({
            where: eq(userTable.email, user.email || ''),
          })

          if (existingUser) {
            /**
             * TODO: pending
             *
             * Existing user found, ask to link or create new account
             *
             * 已找到现有用户，要求关联或创建新帐户
             */
            return sendRedirect(event, `/oauth/link-or-create?provider=github&email=${user.email}`)
          }
          else {
            /**
             * No existing user, create new account
             *
             * 没有现有用户，创建新帐户
             */
            const userId = user.id.toString()
            // Generate a unique ID for the OAuth record
            const oauthId = generateCode(15)

            await db.batch([
              // Insert a new user with the GitHub information
              db.insert(userTable).values({
                id: userId,
                email: user.email || '',
                // oauthRegisterId: oauthId,
                nickname: user.name, // Use the name from the GitHub user
              }),

              // Insert the new OAuth record
              db.insert(usersOauthTable).values({
                id: oauthId,
                userId,
                provider: 'github',
                providerUserId: userId,
              }),

              db.update(userTable).set({
                oauthRegisterId: oauthId,
              }).where(eq(userTable.id, userId)),
            ])

            // 查询 userId 用户
            const userRow = await db.query.userTable.findFirst({
              where: eq(userTable.id, userId),
            })

            // await auth.createSession(userId, null, true)
            const data = await auth.setUserSession(userRow)
            logger.log('🚀 ~ onSuccess ~ data:', data)

            // await setUserSession(event, {
            //   user,
            // })
            return sendRedirect(event, '/')
          }
        }
      }
    }
    catch (error) {
      logger.error('🚀 ~ GitHub OAuth onSuccess ~ error:', error)

      throw createError({
        status: 500,
        message: 'Internal server error during OAuth process',
      })
    }
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    logger.error('GitHub OAuth error:', error)

    throw createError({
      message: error.message,
      statusCode: 400,
    })
  },
})
