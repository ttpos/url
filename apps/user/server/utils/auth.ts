import { GitHub, Google } from 'arctic'
import { AuthSingleton } from './authSingleton'

const config = useRuntimeConfig()
export const lucia = () => AuthSingleton.getInstance()?.getLucia()

// IMPORTANT!
declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: Omit<DatabaseUser, 'password'>
    DatabaseSessionAttributes: Omit<DatabaseSession, 'password'>
  }
}

interface DatabaseUser {
  id: string
  nickname: string
  email: string
  isEmailVerified: string
}

interface DatabaseSession {
  status: number
  sessionToken: string
  metadata: object
}

export const github = new GitHub(
  config.githubClientId,
  config.githubClientSecret,
)

export const google = new Google(
  config.googleClientId,
  config.googleClientSecret,
  config.googleRedirectURI,
)
