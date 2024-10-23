import { enUs, zhCn } from './i18n'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en-US',
  messages: {
    'en-US': enUs,
    'zh-CN': zhCn,
  },
}))
