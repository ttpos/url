/* eslint-disable node/prefer-global/process */

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],
  app: {
    cdnURL: process.env.NUXT_CDNURL,
  },
  modules: [
    '@nuxt/fonts',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@nuxtjs/turnstile',
  ],

  sourcemap: {
    server: false,
    client: false,
  },

  ui: {
    safelistColors: ['primary', 'red', 'orange', 'green'],
  },

  colorMode: {
    disableTransition: true,
  },

  routeRules: {
    // Temporary workaround for prerender regression. see https://github.com/nuxt/nuxt/issues/27490
    '/': { prerender: true },
  },

  typescript: {
    strict: false,
  },

  future: {
    compatibilityVersion: 4,
  },

  turnstile: {
    siteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY,
  },

  runtimeConfig: {
    debug: process.env.NUXT_DEBUG === 'true',
    dbType: process.env.NUXT_DB_TYPE || 'libsql',
    libsqlUrl: process.env.NUXT_LIBSQL_URL || 'file:database/data.db',
    libsqlAuthToken: process.env.NUXT_LIBSQL_AUTH_TOKEN || undefined,
    // Google OAuth
    googleClientId: process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.NUXT_OAUTH_GOOGLE_CLIENT_SECRET,
    googleRedirectURI: process.env.NUXT_OAUTH_GOOGLE_REDIRECT_URI,
    // GitHub OAuth
    githubClientId: process.env.NUXT_OAUTH_GITHUB_CLIENT_ID,
    githubClientSecret: process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET,

    turnstile: {
      secretKey: process.env.NUXT_TURNSTILE_SECRET_KEY,
    },
  },

  nitro: {
    preset: process.env.DEPLOY_RUNTIME || '',
    experimental: {
      tasks: true,
    },
    serveStatic: false,
    // errorHandler: '~/error',
  },

  devtools: {
    enabled: true,
  },

  vite: {
    server: {
      hmr: {
        protocol: 'wss',
      },
    },
  },

  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-ignore
  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs',
      },
    },
  },

  compatibilityDate: '2024-07-11',
})
