import { sessionTable, usersOauthTable, userTable } from '@@/server/database/schema'
import { useAuth, useDrizzle } from '@@/server/utils'
import { OAuth2RequestError } from 'arctic'
import { and, eq, sql } from 'drizzle-orm'
import { generateId } from 'lucia'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code?.toString() ?? null
  const state = query.state?.toString() ?? null
  const storedState = getCookie(event, 'github_oauth_state') ?? null

  if (!code || !state || !storedState || state !== storedState) {
    throw createError({
      status: 400,
      message: 'Invalid OAuth state',
    })
  }

  try {
    const db = useDrizzle(event)
    const { lucia, github } = await useAuth(event)

    // Validate the authorization code and get tokens
    const tokens = await github.validateAuthorizationCode(code)
    const githubUserResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    })

    const githubUser: GitHubUser = await githubUserResponse.json()
    logger.log('🚀 ~ defineEventHandler ~ githubUser:', githubUser)

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
        eq(usersOauthTable.providerUserId, githubUser.id.toString()),
      ),
    })

    logger.log('Existing OAuth Record:', existingOauthRecord)

    /**
     * Check if there's an active session
     *
     * 检查是否有活动会话
     */
    const sessionId = getCookie(event, 'Set-Cookie')
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

        // Log in the user
        const session = await lucia.createSession(existingUser.id, {
          status: 1,
          sessionToken: generateId(32),
          metadata: {},
        })
        logger.log('🚀 ~ defineEventHandler ~ session:', session)
        appendHeader(event, 'Set-Cookie', lucia.createSessionCookie(session.id).serialize())
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
          id: generateId(15),
          userId: activeSession.userId,
          provider: 'github',
          providerUserId: githubUser.id.toString(),
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
          where: eq(userTable.email, githubUser.email || ''),
        })

        if (existingUser) {
          /**
           * TODO: pending
           *
           * Existing user found, ask to link or create new account
           *
           * 已找到现有用户，要求关联或创建新帐户
           */
          return sendRedirect(event, `/oauth/link-or-create?provider=github&email=${githubUser.email}`)
        }
        else {
          /**
           * No existing user, create new account
           *
           * 没有现有用户，创建新帐户
           */
          const userId = githubUser.id.toString()
          // Generate a unique ID for the OAuth record
          const oauthId = generateId(15)

          // Insert a new user with the GitHub information
          await db.insert(userTable).values({
            id: userId,
            email: githubUser.email || '',
            // oauthRegisterId: oauthId,
            nickname: githubUser.name, // Use the name from the GitHub user
          })

          // Insert the new OAuth record
          await db.insert(usersOauthTable).values({
            id: oauthId,
            userId,
            provider: 'github',
            providerUserId: userId,
          })

          await db.update(userTable).set({
            oauthRegisterId: oauthId,
          }).where(eq(userTable.id, userId))

          const session = await lucia.createSession(userId, {
            status: 1,
            sessionToken: 'testing',
            metadata: {},
          })
          appendHeader(event, 'Set-Cookie', lucia.createSessionCookie(session.id).serialize())
          return sendRedirect(event, '/')
        }
      }
    }
  }
  catch (error) {
    logger.error('🚀 ~ defineEventHandler ~ error:', error)
    if (error instanceof OAuth2RequestError && error.message === 'bad_verification_code') {
      // Invalid code
      throw createError({
        status: 400,
        message: 'Invalid verification code',
      })
    }
    throw createError({
      status: 500,
      message: 'Internal server error during OAuth process',
    })
  }
})

interface GitHubUser {
  id: number // User ID
  login: string // User login name
  email: string | null // User's email, can be null
  avatar_url: string // URL of the user's avatar
  node_id: string // User node ID
  gravatar_id: string // Gravatar ID (usually an empty string)
  url: string // API URL
  html_url: string // GitHub URL
  followers_url: string // User's followers API URL
  following_url: string // User's following API URL
  gists_url: string // User's gists API URL
  starred_url: string // User's starred API URL
  subscriptions_url: string // User's subscriptions API URL
  organizations_url: string // User's organizations API URL
  repos_url: string // User's repositories API URL
  events_url: string // User's events API URL
  received_events_url: string // User's received events API URL
  type: 'User' | 'Organization' // User type, can be 'User' or 'Organization'
  site_admin: boolean // Whether the user is a site admin
  name: string | null // User's name, can be null
  company: string | null // User's company, can be null
  blog: string | null // User's blog, can be null
  location: string | null // User's location, can be null
  hireable: boolean // Whether the user is hireable
  bio: string | null // User's bio, can be null
  twitter_username: string | null // User's Twitter username, can be null
  notification_email: string | null // User's notification email, can be null
  public_repos: number // Number of public repositories
  public_gists: number // Number of public gists
  followers: number // Number of followers
  following: number // Number of users the person is following
  created_at: string // Creation date (ISO 8601 format)
  updated_at: string // Last update date (ISO 8601 format)
}
