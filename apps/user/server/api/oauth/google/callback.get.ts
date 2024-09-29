import { usersOauthTable, userTable } from '@@/server/database/schema'
import { useAuth, useDrizzle } from '@@/server/utils'
import { OAuth2RequestError } from 'arctic'
import { eq } from 'drizzle-orm'
import { generateId } from 'lucia'
import type { GoogleTokens } from 'arctic'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code?.toString() ?? null
  const state = query.state?.toString() ?? null
  const storedState = getCookie(event, 'google_oauth_state') ?? null
  const codeVerifier = getCookie(event, 'code_verifier') ?? null

  if (!code || !state || !storedState || state !== storedState) {
    throw createError({
      status: 400,
    })
  }

  try {
    const db = useDrizzle(event)
    const auth = useAuth(event)

    const tokens: GoogleTokens = await auth.google.validateAuthorizationCode(
      code,
      codeVerifier as string,
    )

    const googleUserResponse = await fetch(
      'https://openidconnect.googleapis.com/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    )

    const googleUser: GoogleUser = await googleUserResponse.json()

    // Check if email is already used
    const isEmailUsed = await db.query.userTable.findFirst({
      where: eq(userTable.email, googleUser.email),
    })

    if (isEmailUsed) {
      await db.update(userTable).set({
        isEmailVerified: googleUser.verified_email ? 1 : 0,
        nickname: googleUser.name,
      }).where(eq(userTable.id, isEmailUsed.id))

      const oauthId = generateId(15)

      await db.insert(usersOauthTable).values({
        id: oauthId,
        userId: isEmailUsed.id,
        provider: 'google',
        providerUserId: googleUser.sub,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken ?? null,
        expiresAt: tokens.accessTokenExpiresAt ?? null,
      })

      await auth.createSession(isEmailUsed.id, null, true)
      return sendRedirect(event, '/')
    }

    const existingUser = await db.query.userTable.findFirst({
      where: eq(userTable.email, googleUser.email),
    })

    if (existingUser) {
      await auth.createSession(existingUser.id, null, true)
      return sendRedirect(event, '/')
    }

    const userId = generateId(15)

    await db.insert(userTable).values({
      email: googleUser.email,
      id: userId,
      isEmailVerified: googleUser.verified_email ? 1 : 0,
      nickname: googleUser.name,
    })

    const oauthId = generateId(15)
    await db.insert(usersOauthTable).values({
      id: oauthId,
      userId,
      provider: 'google',
      providerUserId: googleUser.sub,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken ?? null,
      expiresAt: tokens.accessTokenExpiresAt ?? null,
    })

    await auth.createSession(userId, null, true)
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

interface GoogleUser {
  sub: string
  name: string
  email: string
  picture: string
  given_name: string
  locale: string
  verified_email: boolean
}
