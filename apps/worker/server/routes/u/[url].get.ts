import { gte } from 'drizzle-orm'
import { links } from '@@/database/schema'

export default defineEventHandler(async (event) => {
  const urlId = event.context.params?.url as string
  const db = event.context.db as any

  const data = await db.query.links.findFirst({
    where: gte(links.id, 0),
  })

  return {
    code: 0,
    urlId,
    message: 'ok',
    data,
  }
})
