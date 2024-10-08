import { links } from '@@/server/database/schema'
import { useDrizzle } from '@@/server/utils'

import { eq } from 'drizzle-orm'
import { defineEventHandler } from 'h3'

interface Query {
  isDeleted?: 0 | 1
}

export default defineEventHandler(async (event) => {
  const { isDeleted } = getQuery<Query>(event)

  try {
    const db = useDrizzle(event)
    const query = db?.select().from(links)

    if (typeof isDeleted !== 'undefined') {
      query?.where(eq(links.isDeleted, Number(isDeleted)))
    }

    const allLinks = await query?.all()

    logger.log('🚀 ~ defineEventHandler ~ allLinks:', allLinks)

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
