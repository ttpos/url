import { oauthAccountTable, userTable } from '@@/server/database/schema'
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

    // check if email is already used
    if (githubUser.email) {
      const isEmailIsUsed = await db.query.userTable.findFirst({
        where: eq(userTable.email, githubUser.email),
      })

      if (isEmailIsUsed) {
        await db.update(userTable).set({
          isEmailVerified: true,
          name: githubUser.login,
          profilePictureUrl: githubUser.avatar_url,
        })

        const oauthId = generateId(15)

        await db.insert(oauthAccountTable).values({
          id: oauthId,
          userId: isEmailIsUsed.id,
          provider: 'github',
          providerUserId: githubUser.id.toString(),
          accessToken: tokens.accessToken,
        })

        const session = await lucia.createSession(isEmailIsUsed.id, {})
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
      return sendRedirect(event, '/dashboard')
    }

    await db
      .insert(userTable)
      .values({
        email: githubUser.email ? githubUser.email : '',
        id: githubUser.id.toString(),
        isEmailVerified: true,
        name: githubUser.login,
        profilePictureUrl: githubUser.avatar_url,
      })

    const oauthId = generateId(15)
    await db.insert(oauthAccountTable).values({
      id: oauthId,
      userId: githubUser.id.toString(),
      provider: 'github',
      providerUserId: githubUser.id.toString(),
      accessToken: tokens.accessToken,
    })

    const session = await lucia.createSession(githubUser.id.toString(), {})
    appendHeader(
      event,
      'Set-Cookie',
      lucia.createSessionCookie(session.id).serialize(),
    )
    return sendRedirect(event, '/dashboard')
  }
  catch (e) {
    if (
      e instanceof OAuth2RequestError
      && e.message === 'bad_verification_code'
    ) {
      // invalid code
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
