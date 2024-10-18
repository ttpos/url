import { useAuth, useUser } from '@@/server/utils'

interface Query {
  email: string
  password: string
  remember: boolean
  captchaToken: string
}

export default defineEventHandler(async (event) => {
  try {
    const { debug } = useRuntimeConfig()

    // 1. 检查 cookie
    const auth = useAuth(event)
    const user = useUser(event)
    const body = await readBody<Query>(event)
    const { email, password, remember, captchaToken } = body

    // * dev mode only
    if (!debug) {
      const turnstileResponse = await verifyTurnstileToken(captchaToken || body['cf-turnstile-response'])
      if (!turnstileResponse.success) {
        throw createError({
          message: `The provided Turnstile token was not valid! \n${JSON.stringify(turnstileResponse)}`,
          statusCode: 400,
        })
      }
    }

    const { user: _user, isValid, message } = await user.validateUserSignin(email, password)

    if (!isValid) {
      throw createError({
        message,
        statusCode: 400,
      })
    }

    await auth.createUserSession(_user as any, 'email', remember)

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
