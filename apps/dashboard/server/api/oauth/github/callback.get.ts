import { usersOauthTable, userTable } from '@@/server/database/schema'
import { github, useDrizzle } from '@@/server/utils'
import { OAuth2RequestError } from 'arctic'
import { eq } from 'drizzle-orm'
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

    const tokens = await github.validateAuthorizationCode(code)
    const githubUserResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    })

    const githubUser: GitHubUser = await githubUserResponse.json()

    // Check if email is already used
    if (githubUser.email) {
      const isEmailUsed = await db.query.userTable.findFirst({
        where: eq(userTable.email, githubUser.email),
      })

      if (isEmailUsed) {
        await db.update(userTable).set({
          isEmailVerified: 1,
          nickname: githubUser.login,
        }).where(eq(userTable.id, isEmailUsed.id))

        await db.insert(usersOauthTable).values({
          id: generateId(15),
          userId: isEmailUsed.id,
          provider: 'github',
          providerUserId: githubUser.id.toString(),
          accessToken: tokens.accessToken,
          refreshToken: null,
          expiresAt: null,
        })

        const session = await lucia.createSession(isEmailUsed.id, {})
        appendHeader(
          event,
          'Set-Cookie',
          lucia.createSessionCookie(session.id).serialize(),
        )
        return sendRedirect(event, '/dashboard')
      }
    }

    const existingUser = await db.query.userTable.findFirst({
      where: eq(userTable.id, githubUser.id.toString()),
    })

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {})
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

    const session = await lucia.createSession(githubUser.id.toString(), {})
    appendHeader(
      event,
      'Set-Cookie',
      lucia.createSessionCookie(session.id).serialize(),
    )
    return sendRedirect(event, '/')
  }
  catch (e) {
    if (e instanceof OAuth2RequestError && e.message === 'bad_verification_code') {
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
