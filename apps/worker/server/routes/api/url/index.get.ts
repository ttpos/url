import { defineEventHandler } from 'h3'
import { links } from '@@/database/schema'

export default defineEventHandler(async (event) => {
  const { db } = event.context

  try {
    const allLinks = await db?.select().from(links).all()

    logger.log('🚀 ~ defineEventHandler ~ allUrls:', allLinks)

    return {
      code: 0,
      message: 'ok',
      data: allLinks,
    }
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
