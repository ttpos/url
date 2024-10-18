declare module '#auth-utils' {
  interface User {
    id: string | number
    sessionId: string
    nickname: string
    email: string
    phone: string

    webauthn?: string
    email?: string
    password?: string
    github?: string
    google?: string
    auth0?: string
  }

  interface UserSession {
    id?: string | number
    nickname?: string
    email?: string
    phone?: string
    extended?: any
    loggedInAt: number
    secure?: Record<string, unknown>
  }

  interface SecureSessionData {

  }
}

export {}
