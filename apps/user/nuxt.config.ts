/* eslint-disable node/prefer-global/process */

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],
  app: {
    cdnURL: process.env.NUXT_CDNURL,
    // keepalive: true,
  },
  modules: [
    'nuxt-auth-utils',
    '@nuxt/fonts',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@nuxtjs/turnstile',
    'nuxt-csurf',
    '@nuxtjs/i18n',
  ],

  sourcemap: {
    server: false,
    client: false,
  },

  ssr: false,

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
    // tsConfig: {
    //   compilerOptions: {
    //     noImplicitOverride: true,
    //     noUncheckedIndexedAccess: true,
    //     noUnusedLocals: true,
    //     noUnusedParameters: true,
    //   },
    // },
    // typeCheck: true,
  },

  future: {
    compatibilityVersion: 4,
  },

  turnstile: {
    siteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY,
  },

  runtimeConfig: {
    debug: process.env.NUXT_DEBUG === 'true',
    cookieKey: process.env.NUXT_COOKIE_KEY,
    sessionExpiryDays: process.env.NUXT_SESSION_EXPIRY_DAYS || 30,
    encryptionKey: process.env.NUXT_ENCRYPTION_KEY,
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

    public: {
      i18nCookieKey: process.env.NUXT_I18N_COOKIE_KEY,
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

  csurf: {
    https: true, // process.env.NODE_ENV === 'production'
    methodsToProtect: ['POST', 'PUT', 'PATCH'],
    addCsrfTokenToEventCtx: true,
    headerName: 'X-CSRF-TOKEN',
  },

  i18n: {
    compilation: {
      strictMessage: false,
      escapeHtml: true,
    },
    lazy: true,
    locales: ['en-US', 'zh-CN'],
    defaultLocale: 'en-US',
    skipSettingLocaleOnNavigate: true,
    detectBrowserLanguage: false,
    // detectBrowserLanguage: {
    //   useCookie: true,
    //   cookieKey: 'user_i18n_redirected',
    //   redirectOn: 'root',
    //   fallbackLocale: 'en-US',
    // },
  },

  compatibilityDate: '2024-07-11',
})
