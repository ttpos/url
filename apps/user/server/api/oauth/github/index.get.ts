/* eslint-disable node/prefer-global/process */

import { useAuth } from '@@/server/utils'
import { generateState } from 'arctic'

export default defineEventHandler(async (event) => {
  const { github } = useAuth(event)
  const state = generateState()
  const url = await github.createAuthorizationURL(state, {
    scopes: ['user:email'],
  })

  setCookie(event, 'github_oauth_state', state, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  })
  return sendRedirect(event, url.toString())
})
