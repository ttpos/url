import { useAuth } from '@@/server/utils'

export default defineEventHandler(async (event) => {
  try {
    const auth = useAuth(event)
    await auth.clearUserSession()

    return {
      message: 'Successfully signed out!',
    }
  }
  catch (error: any) {
    logger.error?.('🚀 ~ defineEventHandler ~ error:', error)
    throw createError({
      message: error?.message,
      statusCode: 400,
    })
  }
})
