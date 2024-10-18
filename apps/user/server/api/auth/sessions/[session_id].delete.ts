import { sessionTable } from '@@/server/database/schema'
import { useDrizzle } from '@@/server/utils'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const db = useDrizzle(event)

    const { session_id } = event.context.params

    await db.update(sessionTable)
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-expect-error
      .set({ isDeleted: 1 })
      .where(eq(sessionTable.id, session_id))

    return {
      message: 'Session deleted successfully!',
    }
  }
  catch (error) {
    logger.error('🚀 ~ defineEventHandler ~ error:', error)
    throw createError({
      statusMessage: error.message,
      statusCode: 400,
    })
  }
})
