import { hash } from '@node-rs/argon2'
import { SqliteError } from 'better-sqlite3'
import { generateId } from 'lucia'
import { db } from '../utils/db'

interface Query {
  email: string
  password: string
}

export default eventHandler(async (event) => {
  const { email, password } = await readBody<Query>(event)

  if (
    typeof email !== 'string'
    || !/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(email) // Basic email format validation
  ) {
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

  const passwordHash = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  })
  const userId = generateId(15)

  try {
    db.prepare('INSERT INTO user (id, email, password_hash) VALUES(?, ?, ?)').run(
      userId,
      email,
      passwordHash,
    )
    const session = await lucia.createSession(userId, {})
    appendHeader(event, 'Set-Cookie', lucia.createSessionCookie(session.id).serialize())
  }
  catch (e) {
    if (e instanceof SqliteError && e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
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
