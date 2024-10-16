import { useAuth, useUser } from '@@/server/utils'

interface Query {
  email?: string
  phone?: string
  password: string
  captchaToken: string
}

export default defineEventHandler(async (event) => {
  try {
    const auth = useAuth(event)
    const user = useUser(event)

    const body = await readBody<Query>(event)
    const { email, phone, password, captchaToken } = body

    const turnstileResponse = await verifyTurnstileToken(captchaToken || body['cf-turnstile-response'])
    if (!turnstileResponse.success) {
      throw createError({
        message: `The provided Turnstile token was not valid! \n${JSON.stringify(turnstileResponse)}`,
        statusCode: 400,
      })
    }

    const { user: _user, isValid, message } = await user.validateUserSignup({ email, phone, password })

    if (!isValid) {
      throw createError({
        message,
        statusCode: 400,
      })
    }

    // await auth.createSession(_user.id, null, true)
    await auth.setUserSession(_user)

    return {
      message: 'We\'ve sent a verification email to your inbox. Please verify your email.',
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
