// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],

  modules: ['@nuxt/fonts', '@nuxt/ui', '@vueuse/nuxt'],

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

  runtimeConfig: {
  },

  nitro: {
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
