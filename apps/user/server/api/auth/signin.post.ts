import { userTable } from '@@/server/database/schema'
import { AuthSingleton, isValidEmail, lucia, useDrizzle, verifyPassword } from '@@/server/utils'
import { eq } from 'drizzle-orm'

interface Query {
  email: string
  password: string
  captchaToken: string
}

export default defineEventHandler(async (event) => {
  try {
    const db = useDrizzle(event)

    const body = await readBody<Query>(event)
    const { email, password, captchaToken } = body

    // Validate email
    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      throw createError({
        message: 'Invalid Email',
        statusCode: 400,
      })
    }

    // Validate password length
    if (typeof password !== 'string' || password.length < 8 || password.length > 255) {
      throw createError({
        message: 'Invalid Password Length',
        statusCode: 400,
      })
    }

    const turnstileResponse = await verifyTurnstileToken(captchaToken || body['cf-turnstile-response'])
    if (!turnstileResponse.success) {
      throw createError({
        message: `The provided Turnstile token was not valid! \n${JSON.stringify(turnstileResponse)}`,
        statusCode: 400,
      })
    }
    logger.log('🚀 ~ defineEventHandler ~ turnstileResponse:', turnstileResponse)

    // Check if user exists
    const user = await db.query.userTable.findFirst({
      where: eq(userTable.email, email),
    })
    logger.log('🚀 ~ defineEventHandler ~ user:', user)

    if (!user) {
      throw createError({
        message: `${email} doesn't exist!`,
        statusCode: 400,
      })
    }

    // Check if the user has a password
    if (!user.password) {
      const checkUserSignedWithOauth = await db.query.usersOauthTable.findFirst({
        where: table => eq(table.userId, user.id),
      })
      if (checkUserSignedWithOauth) {
        throw createError({
          message: `${email} was first used in sign in with '${checkUserSignedWithOauth.provider}', sign in again and set your password.`,
          statusCode: 400,
        })
      }
      else {
        throw createError({
          message: `${email} was first used in sign in with Magic Link, sign in again and set your password.`,
          statusCode: 400,
        })
      }
    }

    // Validate password
    const validPassword = await verifyPassword(user.password, password)

    if (!validPassword) {
      throw createError({
        message: 'Password incorrect!',
        statusCode: 400,
      })
    }

    // Create a session
    const session = await lucia().createSession(user.id, {
      status: 1,
      sessionToken: 'testing',
      metadata: {},
    })
    logger.log('🚀 ~ defineEventHandler ~ session:', session)

    // Set the session cookie
    const luciaToken = lucia().createSessionCookie(session.id)
    setCookie(event, luciaToken.name, luciaToken.value, luciaToken.attributes)

    return {
      message: 'Signin successful!',
    }
  }
  catch (error: any) {
    logger.error('🚀 ~ defineEventHandler ~ error:', error)
    throw createError({
      message: error.message,
      statusCode: 400,
    })
  }
})
