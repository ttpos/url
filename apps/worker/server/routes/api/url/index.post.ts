import { defineEventHandler, readBody } from 'h3'
import { links } from '@@/database/schema'

interface Query {
  records: {
    url: string
    expiresAt: number
    hash: string
    userId?: string
  }[]
}

export default defineEventHandler(async (event) => {
  const { db } = event.context

  try {
    const { records } = await readBody<Query>(event)

    const results = await Promise.all(
      records.map(async (record) => {
        try {
          await db?.insert(links).values({
            url: record.url,
            userId: record.userId || '',
            expiresAt: record.expiresAt,
            hash: record.hash,
            isDelete: 0,
          })
          return {
            ...record,
            success: true,
          }
        }
        catch (error) {
          const errorMessage = error instanceof Error ? `${error.message}` : 'error'
          return {
            ...record,
            success: false,
            error: errorMessage,
          }
        }
      }),
    )

    const successes = results.filter(result => result.success)
    const failures = results.filter(result => !result.success)

    logger.log('Links processed:', { successes, failures })

    return {
      code: 0,
      message: 'ok',
      data: {
        successes,
        failures,
      },
    }
  }
  catch (error) {
    logger.error('Error inserting new link:', error)
    event.node.res.statusCode = 500
    let errorMessage = 'Internal Server Error'
    if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      code: 500,
      message: errorMessage,
      data: null,
    }
  }
})
