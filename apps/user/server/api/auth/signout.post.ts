import { useAuth } from '@@/server/utils'

export default defineEventHandler(async (event) => {
  try {
    const auth = useAuth(event)
    const { user, session } = await auth.getAuth()

    if (!user?.id) {
      throw createError({
        statusCode: 403,
      })
    }

    await auth.lucia.invalidateSession(session.id)
    auth.setBlankSessionCookie()

    return {
      message: 'Successfully signed out!',
    }
  }
  catch (error: any) {
    logger.error('🚀 ~ defineEventHandler ~ error:', error)
    throw createError({
      message: error?.message,
      statusCode: 400,
    })
  }
})
