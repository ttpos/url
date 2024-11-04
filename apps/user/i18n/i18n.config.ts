// import { enUs, zhCn } from './i18n'
import enUs from './locales/en-US'
import zhCn from './locales/zh-CN'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en-US',
  messages: {
    'en-US': enUs,
    'zh-CN': zhCn,
  },
}))
