// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    cdnURL: process.env.NUXT_CDNURL,
  },
  sourcemap: {
    server: false,
    client: false,
  },
  compatibilityDate: '2024-07-30',
  future: {
    compatibilityVersion: 4,
  },
  runtimeConfig: {
    debug: process.env.NUXT_DEBUG === 'true',
    dbType: process.env.NUXT_DB_TYPE || 'libsql',
    libsqlUrl: process.env.NUXT_LIBSQL_URL || 'file:database/data.db',
    libsqlAuthToken: process.env.NUXT_LIBSQL_AUTH_TOKEN || undefined,
    jwtPubkey: process.env.NUXT_JWT_PUBKEY || '',
  },
  nitro: {
    preset: process.env.DEPLOY_RUNTIME || '',
    experimental: {
      tasks: true,
    },
    serveStatic: false,
    errorHandler: '~/error',
  },
  devtools: {
    enabled: true,
  },
})
