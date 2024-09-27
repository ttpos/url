import { useAuth } from '@@/server/utils'

export default defineEventHandler(async (event) => {
  try {
    // const { lucia, getAuth } = await useAuth(event)
    const auth = useAuth(event)
    const { user } = await auth.getAuth()

    if (!user?.id) {
      throw createError({
        statusCode: 403,
      })
    }

    await auth.lucia.invalidateSession(user?.id)
    appendHeader(event, 'Set-Cookie', auth.lucia.createBlankSessionCookie().serialize())

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
