import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

const config = createConfigForNuxt(
  {
    features: {
      stylistic: true,
    },
  },
  {
    ignores: [
      'database/**',
      '**.md',
      '.nuxt/**',
      'server/types/worker-configuration.d.ts',
    ],
  },
  {
    files: ['*.ts'],
  },
  {
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
)

export default config
