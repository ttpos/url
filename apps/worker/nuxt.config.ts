// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-07-30',
  future: {
    compatibilityVersion: 4,
  },
  runtimeConfig: {
    dbType: process.env.NUXT_DB_TYPE || 'd1',
    libsqlUrl: process.env.NUXT_LIBSQL_URL || 'file:database/data.db',
    libsqlAuthToken: process.env.NUXT_LIBSQL_AUTH_TOKEN || '',
    debug: process.env.NUXT_DEBUG === 'true',
    cloudflareAccountId: process.env.NUXT_CLOUDFLARE_ACCOUNT_ID || '',
    cloudflareDatabaseId: process.env.NUXT_CLOUDFLARE_DATABASE_ID || '',
    cloudflareApiToken: process.env.NUXT_CLOUDFLARE_API_TOKEN || '',
  },
  nitro: {
    preset: 'cloudflare-pages',
    experimental: {
      tasks: true,
    },
  },
  devtools: {
    enabled: true,
  },

  modules: ['nitro-cloudflare-dev'],
})
