// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-07-30',
  eslint: {
    config: {
      standalone: false,
      stylistic: true,
    },
  },
  future: {
    compatibilityVersion: 4,
  },
  runtimeConfig: {
    dbType: 'libsql',
    libsqlUrl: 'file:database/data.db',
    libsqlAuthToken: '',
    debug: true,
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
  modules: ['@nuxt/eslint'],
})
