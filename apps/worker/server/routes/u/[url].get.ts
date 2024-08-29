import { gte } from 'drizzle-orm'
import { links } from '@@/database/schema'

export default defineEventHandler(async (event) => {
  const { db } = event.context

  try {
    const urlId = event.context.params?.url

    const data = await db?.query.links.findFirst({
      where: gte(links.id, 0),
    })

    return {
      code: 0,
      message: 'hello',
      data: {
        urlId,
        list: data || [],
      },
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
