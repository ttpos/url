import { initializeLucia, useDrizzle } from '@@/server/utils'
import { verifyRequestOrigin } from 'lucia'

import type { Session, User } from 'lucia'

let luciaInstance: ReturnType<typeof initializeLucia> | null = null

export default defineEventHandler(async (event) => {
  const db = useDrizzle(event)

  // Initialize Lucia if not already initialized
  if (!luciaInstance) {
    luciaInstance = initializeLucia(db)
  }
  event.context.lucia = luciaInstance

  // Verify request origin for non-GET requests
  if (event.node.req.method !== 'GET') {
    const originHeader = getHeader(event, 'Origin') ?? null
    const hostHeader = getHeader(event, 'Host') ?? null
    if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
      return event.node.res.writeHead(403).end()
    }
  }

  // Validate session
  const sessionId = getCookie(event, luciaInstance.sessionCookieName) ?? null
  if (!sessionId) {
    event.context.session = null
    event.context.user = null
    return
  }

  const { session, user } = await luciaInstance.validateSession(sessionId)

  if (session && session.fresh) {
    appendHeader(event, 'Set-Cookie', luciaInstance.createSessionCookie(session.id).serialize())
  }
  if (!session) {
    appendHeader(event, 'Set-Cookie', luciaInstance.createBlankSessionCookie().serialize())
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
