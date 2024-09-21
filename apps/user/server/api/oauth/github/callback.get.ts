import { usersOauthTable, userTable } from '@@/server/database/schema'
import { github, useDrizzle } from '@@/server/utils'
import { OAuth2RequestError } from 'arctic'
import { eq, sql } from 'drizzle-orm'
import { generateId } from 'lucia'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code?.toString() ?? null
  const state = query.state?.toString() ?? null
  const storedState = getCookie(event, 'github_oauth_state') ?? null

  if (!code || !state || !storedState || state !== storedState) {
    throw createError({
      status: 400,
    })
  }

  try {
    const db = useDrizzle()

    // Validate the authorization code and get tokens
    const tokens = await github.validateAuthorizationCode(code)
    const githubUserResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    })

    const githubUser: GitHubUser = await githubUserResponse.json()
    logger.log('🚀 ~ defineEventHandler ~ githubUser:', githubUser)

    // Check if email is already used
    if (githubUser.email) {
      const isEmailUsed = await db.query.userTable.findFirst({
        where: eq(userTable.email, githubUser.email),
      })

      if (isEmailUsed) {
        await db
          .update(userTable)
          .set({
            nickname: githubUser.name,
          })
          .where(eq(userTable.id, isEmailUsed.id))

        // Check if the user already has a GitHub OAuth record
        const existingOauthRecord = await db.query.usersOauthTable.findFirst({
          where: table => eq(table.provider, 'github') && eq(table.providerUserId, githubUser.id.toString()),
        })

        if (existingOauthRecord) {
          // If record exists, update the access token
          await db
            .update(usersOauthTable)
            .set({
              accessToken: tokens.accessToken,
              refreshToken: null,
              expiresAt: null,
            })
            .where(eq(usersOauthTable.id, existingOauthRecord.id))
        }
        else {
          // Insert new OAuth record
          await db.insert(usersOauthTable).values({
            userId: isEmailUsed.id,
            provider: 'github',
            providerUserId: githubUser.id.toString(),
            accessToken: tokens.accessToken,
            refreshToken: null,
            expiresAt: null,
          })
        }

        const session = await lucia.createSession(isEmailUsed.id, {
          status: 1,
          sessionToken: 'testing',
          metadata: {},
        })
        appendHeader(event, 'Set-Cookie', lucia.createSessionCookie(session.id).serialize())
        return sendRedirect(event, '/')
      }
    }

    // const userID = getUserFrom().userId;

    // const existingOauthRecord = await db.query.usersOauthTable.findFirst({
    //   where: table => eq(table.provider, 'github') && eq(table.providerUserId, githubUser.id.toString()),
    // })
    // if(existingOauthRecord) {
    //   // local user is not login

    //   const user = await db.query.userTable.findFirst({
    //     where: eq(userTable.id, existingOauthRecord.userId),
    //   })

    //   // do login.

    //   return sendRedirect(event, '/')
    // }
    // else
    // {
    //   const githubRes = {
    //     login: 'WuChenDi',
    //     id: 31385662,
    //     node_id: 'MDQ6VXNlcjMxMzg1NjYy',
    //     email: 'wuchendi96@gmail.com',
    //     name: 'wudi',
    //   };

    //   //### local user is login, bind to github user
    //   const session = await db.query.sessionTable.findFirst({
    //     where: eq(sessionTable.id, 'aaaaaaaa'),
    //   })

    //   const userID = session.userId;

    //   await db.insert(usersOauthTable).values({
    //     id: generateId(15),
    //     userId: userID,
    //     provider: 'github',
    //     providerUserId: githubRes.id.toString(),
    //   })

    //   //### local user is not login, register with github user
    //   const oauth = await db.insert(usersOauthTable).values({
    //     id: generateId(15),
    //     userId: "",
    //     provider: 'github',
    //     providerUserId: githubRes.id.toString(),
    //   })

    //   // ask user if have account in our system, if have then go to login, if have then login.
    //   // 1. bind github user to local user
    //   // 2. register with github user
    //   // show login page, if have account then bind, if not then register.
    //   const session = await db.query.sessionTable.findFirst({
    //     where: eq(sessionTable.id, 'aaaaaaaa'),
    //   })

    //   const user = await db.query.userTable.findFirst({
    //     where: eq(userTable.email, githubRes.email),
    //   });

    //   // check if user is already used, ask to bind or register
    //   if(user){

    //   }

    //   const userID = session.userId;

    //   const oauth = await db.update(usersOauthTable).values({
    //     userId: userID,
    //   })
    //   // ask user if have account in our system, if have then go to login, if have then login.
    //   // 1. bind github user to local user
    //   // 2. register with github user
    //   // show login page, if have account then bind, if not then register.

    //   //### local user is not login, register with github user

    //   const oauth = await db.insert(usersOauthTable).values({
    //     id: generateId(15),
    //     userId: "",
    //     provider: 'github',
    //     providerUserId: githubRes.id.toString(),
    //   })

    //   const user = await db.insert(userTable).values({
    //     email: githubRes.email || '',
    //     nickname: githubRes.name,
    //     oauth_register_id: oauth.id,
    //   })

    //   const oauth = await oauth.update(usersOauthTable).values({
    //     userId: user.id,
    //   })
    // }

    const existingUser = await db.query.userTable.findFirst({
      where: eq(userTable.id, githubUser.id.toString()),
      // where: table => sql`${table.providerUserId} = ${githubUser.id.toString()}` && eq(table.provider, 'github'),
    })

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {
        status: 1,
        sessionToken: 'testing',
        metadata: {},
      })
      appendHeader(event, 'Set-Cookie', lucia.createSessionCookie(session.id).serialize())
      return sendRedirect(event, '/')
    }

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
  catch (error) {
    logger.error('🚀 ~ defineEventHandler ~ error:', error)
    if (error instanceof OAuth2RequestError && error.message === 'bad_verification_code') {
      // Invalid code
      throw createError({
        status: 400,
      })
    }
    throw createError({
      status: 500,
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
