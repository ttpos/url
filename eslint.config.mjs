import antfu from '@antfu/eslint-config'

export default antfu(
  {
    formatters: true,
    ignores: [
      'patches',
      'playgrounds',
      '**/.nuxt/**',
      '**/database/**',
      // '**/types',
      '**/server/types/worker-configuration.d.ts',
      '**/cache',
      '**/dist',
      '**/.temp',
      '**/*.svg',
      '**/*.md',
      '**/*.toml',
    ],
  },
  {
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
)
