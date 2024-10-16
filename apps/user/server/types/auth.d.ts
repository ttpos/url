declare module '#auth-utils' {
  interface User {
    id: string | number
    name: string
    email: string

    webauthn?: string
    email?: string
    password?: string
    github?: string
    google?: string
    auth0?: string
  }

  interface UserSession {
    id: string | number
    name?: string
    email?: string
    extended?: any
    loggedInAt: number
    secure?: Record<string, unknown>
  }

  interface SecureSessionData {

  }
}

export {}
