import { userTable } from '@@/server/database/schema'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const email = getRouterParam(event, 'email')

    // Check if user exists
    const userEmail = await useDrizzle().query.userTable.findFirst({
      where: sql`${userTable.email} = ${email}`,
      columns: {
        isEmailVerified: true,
      },
    })

    return {
      isEmailVerified: userEmail?.isEmailVerified,
    }
  }
  catch (error: any) {
    throw createError({
      statusMessage: error.message,
      statusCode: 400,
    })
  }
})
