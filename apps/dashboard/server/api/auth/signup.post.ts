import { userTable } from '@@/server/database/schema'
import { useDrizzle } from '@@/server/utils/db'
import Database from 'libsql'
import { generateId } from 'lucia'

interface Query {
  email: string
  password: string
}

export default eventHandler(async (event) => {
  // const { db } = event.context
  const db = useDrizzle()
  const { email, password } = await readBody<Query>(event)

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(email)) {
    throw createError({
      message: 'Invalid email',
      statusCode: 400,
    })
  }

  if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
    throw createError({
      message: 'Invalid password',
      statusCode: 400,
    })
  }

  const userId = generateId(15)
  const passwordHash = await hashPassword(password)

  try {
    await db.insert(userTable).values({
      id: userId,
      email,
      passwordHash,
    })
    const session = await lucia.createSession(userId, {})
    appendHeader(event, 'Set-Cookie', lucia.createSessionCookie(session.id).serialize())
  }
  catch (e) {
    logger.error('🚀 ~ defineEventHandler ~ error:', e)
    if (e instanceof Database.SqliteError && e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      throw createError({
        message: 'Email already used',
        statusCode: 500,
      })
    }
    throw createError({
      message: 'An unknown error occurred',
      statusCode: 500,
    })
  }
})
