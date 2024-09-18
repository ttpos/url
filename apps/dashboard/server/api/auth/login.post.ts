import { userTable } from '@@/server/database/schema'
import { lucia, useDrizzle } from '@@/server/utils'
import { eq } from 'drizzle-orm'

interface Query {
  email: string
  password: string
}

export default eventHandler(async (event) => {
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

  const existingUser = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email))
    .get()

  if (!existingUser) {
    throw createError({
      message: 'Incorrect email or password',
      statusCode: 400,
    })
  }

  const validPassword = await verifyPassword(existingUser.passwordHash, password)
  if (!validPassword) {
    // NOTE:
    // Returning immediately allows malicious actors to figure out valid usernames from response times,
    // allowing them to only focus on guessing passwords in brute-force attacks.
    // As a preventive measure, you may want to hash passwords even for invalid usernames.
    // However, valid usernames can be already be revealed with the signup page among other methods.
    // It will also be much more resource intensive.
    // Since protecting against this is non-trivial,
    // it is crucial your implementation is protected against brute-force attacks with login throttling, 2FA, etc.
    // If usernames are public, you can outright tell the user that the username is invalid.
    throw createError({
      message: 'Incorrect email or password',
      statusCode: 400,
    })
  }

  const session = await lucia.createSession(existingUser.id, {})
  appendHeader(event, 'Set-Cookie', lucia.createSessionCookie(session.id).serialize())
})
