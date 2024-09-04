export default defineEventHandler(async (event) => {
  try {
    const shortCode = event.context.params?.shortCode || ''
    logger.warn('🚀 ~ defineEventHandler ~ shortCode:', shortCode)

    return sendRedirect(event, `/u/${shortCode}/og`, 302)
  }
  catch (error) {
    logger.error('🚀 ~ defineEventHandler ~ error:', error)
    event.node.res.statusCode = 500
    let errorMessage = 'Internal Server Error'
    if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      code: 500,
      message: errorMessage,
      data: [],
    }
  }
})
