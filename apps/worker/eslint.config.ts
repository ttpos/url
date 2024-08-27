import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  files: ['app/**.ts', 'app/**.tsx', 'app/**.vue', 'server/**.ts'],
  ignores: ['devfiles/**'],
  rules: {
    'no-console': 'off',
    'no-unused-vars': 'off',
    'no-implicit-any': 'off',
  },
})
