import { usersOauthTable, userTable } from '@@/server/database/schema'
import { github, useDrizzle } from '@@/server/utils'
import { OAuth2RequestError } from 'arctic'
import { eq } from 'drizzle-orm'
import { generateId } from 'lucia'

// https://url-b.d.hj.io/api/oauth/github/callback?code=279343f7ff2ab3acad10&state=K0FEXeTWE8INtqsEqfL9KAKmxWvgWGSTjLOqo5hWtgg

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
        await db.update(userTable).set({
          // 第三方的验证不表示当前系统的验证
          // isEmailVerified: 1,
          nickname: githubUser.login,
        }).where(eq(userTable.id, isEmailUsed.id))

        // Check if the user already has a GitHub OAuth record
        const existingOauthRecord = await db.query.usersOauthTable.findFirst({
          where: table => eq(table.provider, 'github') && eq(table.providerUserId, githubUser.id.toString()),
        })

        if (existingOauthRecord) {
          // If record exists, update the access token
          await db.update(usersOauthTable)
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
            id: generateId(15),
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
        appendHeader(
          event,
          'Set-Cookie',
          lucia.createSessionCookie(session.id).serialize(),
        )
        return sendRedirect(event, '/')
      }
    }

    const existingUser = await db.query.userTable.findFirst({
      where: eq(userTable.id, githubUser.id.toString()),
    })

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {
        status: 1,
        sessionToken: 'testing',
        metadata: {},
      })
      appendHeader(
        event,
        'Set-Cookie',
        lucia.createSessionCookie(session.id).serialize(),
      )
      return sendRedirect(event, '/')
    }

    await db.insert(userTable).values({
      email: githubUser.email || '',
      id: githubUser.id.toString(),
      isEmailVerified: 1,
      nickname: githubUser.login,
    })

    await db.insert(usersOauthTable).values({
      id: generateId(15),
      userId: githubUser.id.toString(),
      provider: 'github',
      providerUserId: githubUser.id.toString(),
      accessToken: tokens.accessToken,
      refreshToken: null,
      expiresAt: null,
    })

    const session = await lucia.createSession(githubUser.id.toString(), {
      status: 1,
      sessionToken: 'testing',
      metadata: {},
    })
    appendHeader(
      event,
      'Set-Cookie',
      lucia.createSessionCookie(session.id).serialize(),
    )
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
  id: number
  login: string
  email: string | null
  avatar_url: string
  node_id: string
}
