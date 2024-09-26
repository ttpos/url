import { verifyRequestOrigin } from 'lucia'

import type { Session, User } from 'lucia'

let lucia: ReturnType<typeof initializeLucia>

export default defineEventHandler(async (event) => {
  const db = event.context.db ?? initializeDrizzle(event)

  // Initialize auth (Lucia)
  if (!lucia) {
    lucia = initializeLucia(db)
  }

  event.context.lucia = lucia

  if (event.node.req.method !== 'GET') {
    const originHeader = getHeader(event, 'Origin') ?? null
    const hostHeader = getHeader(event, 'Host') ?? null
    if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
      return event.node.res.writeHead(403).end()
    }
  }

  const sessionId = getCookie(event, lucia.sessionCookieName) ?? null
  if (!sessionId) {
    event.context.session = null
    event.context.user = null
    return
  }

  // const { session, user } = await lucia.validateSession(sessionId)
  const data = await lucia.validateSession(sessionId)
  logger.log('🚀 ~ defineEventHandler ~ data:', data)

  const { session, user } = data
  if (session && session.fresh) {
    appendHeader(event, 'Set-Cookie', lucia.createSessionCookie(session.id).serialize())
  }
  if (!session) {
    appendHeader(event, 'Set-Cookie', lucia.createBlankSessionCookie().serialize())
  }
  event.context.session = session
  event.context.user = user
})

declare module 'h3' {
  interface H3EventContext {
    user: User | null
    session: Session | null
    lucia: ReturnType<typeof initializeLucia>
  }
}
