import { links } from '@@/server/database/schema'
import { useDrizzle } from '@@/server/utils'
import { and, eq } from 'drizzle-orm'
import { defineEventHandler, readBody } from 'h3'

interface Query {
  hashList: string[]
}

export default defineEventHandler(async (event) => {
  try {
    const db = useDrizzle(event)
    const { hashList } = await readBody<Query>(event)

    if (!hashList || hashList.length === 0) {
      return {
        code: 400,
        message: 'Missing hashList parameter',
        data: null,
      }
    }

    const results = await Promise.all(
      hashList.map(async (hash) => {
        try {
          const record = await db
            ?.select()
            .from(links)
            .where(and(eq(links.hash, hash), eq(links.isDelete, 0)))
            .get()

          if (record) {
            await db
              ?.update(links)
              .set({ isDelete: 1 })
              .where(eq(links.hash, hash))
              .execute()

            return {
              hash,
              success: true,
            }
          }
          else {
            return {
              hash,
              success: false,
              error: 'Record not found or already deleted',
            }
          }
        }
        catch (error) {
          const errorMessage = error instanceof Error ? `${error.message}` : 'error'
          return {
            hash,
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
    logger.error('Error deleting links:', error)
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
