/* eslint-disable node/prefer-global/process */

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],

  modules: [
    '@nuxtjs/i18n',
    '@nuxt/content',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/ui',
    '@vueuse/nuxt',
    'nuxt-og-image',
  ],

  sourcemap: {
    server: false,
    client: false,
  },

  // ssr: false,

  hooks: {
    // Define `@nuxt/ui` components as global to use them in `.md` (feel free to add those you need)
    'components:extend': (components) => {
      const globals = components.filter(c => ['UButton'].includes(c.pascalName))

      globals.forEach(c => c.global = true)
    },
  },

  colorMode: {
    disableTransition: true,
  },

  routeRules: {
    '/api/search.json': { prerender: true },
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

  nitro: {
    prerender: {
      routes: [
        '/',
      ],
      crawlLinks: true,
    },
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
        port: process.env.PORT ? Number(process.env.PORT) : 5000,
      },
    },
  },

  // i18n: {
  //   compilation: {
  //     strictMessage: false,
  //     escapeHtml: true,
  //   },
  //   lazy: true,
  //   locales: ['en-US', 'zh-CN'],
  //   defaultLocale: 'en-US',
  //   skipSettingLocaleOnNavigate: true,
  //   // detectBrowserLanguage: false,
  //   detectBrowserLanguage: {
  //     useCookie: true,
  //     cookieKey: 'official_website_i18n_redirected',
  //     redirectOn: 'root',
  //     fallbackLocale: 'en-US',
  //   },
  // },

  i18n: {
    compilation: {
      strictMessage: false,
      escapeHtml: true,
    },
    lazy: true,
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'official_website_i18n_redirected',
      redirectOn: 'root',
    },
    baseUrl: '/',
    locales: ['en-US', 'zh-CN'],
    defaultLocale: 'en-US',
  },

  content: {
    watch: {
      ws: {
        showURL: false,
      },
    },
    highlight: {
      theme: 'github-dark',
    },
    navigation: {
      fields: ['image', '_id'],
    },
    markdown: {
      anchorLinks: false,
    },
    locales: ['en-US', 'zh-CN'],
    defaultLocale: 'en-US',
  },

  compatibilityDate: '2024-07-11',
})
