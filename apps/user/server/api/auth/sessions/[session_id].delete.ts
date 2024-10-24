import { sessionTable } from '@@/server/database/schema'
import { useDrizzle } from '@@/server/utils'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const db = useDrizzle(event)

    const session_id = event.context.params?.session_id || ''

    await db?.update(sessionTable)
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-ignore
      .set({ isDeleted: 1 })
      .where(eq(sessionTable.id, session_id))

    return {
      message: 'Session deleted successfully!',
    }
  }
  catch (error: any) {
    logger.error?.('🚀 ~ defineEventHandler ~ error:', error)
    throw createError({
      statusMessage: error.message,
      statusCode: 400,
    })
  }
})
