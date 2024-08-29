// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-07-30',
  future: {
    compatibilityVersion: 4,
  },
  runtimeConfig: {
    dbType: process.env.NUXT_DB_TYPE || 'libsql',
    libsqlUrl: process.env.NUXT_LIBSQL_URL || 'file:database/data.db',
    libsqlAuthToken: process.env.NUXT_LIBSQL_AUTH_TOKEN || '',
    debug: process.env.NUXT_DEBUG === 'true',
  },
  nitro: {
    preset: process.env.DEPLOY_RUNTIME || '',
    experimental: {
      tasks: true,
    },
  },
  devtools: {
    enabled: true,
  },

  modules: ['nitro-cloudflare-dev'],
})
