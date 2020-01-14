import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import locales from './locales'
import getLang from '../utils/getLang.tsx'

i18n
  .use(initReactI18next)
  .init({
    resources: locales,
    lng: getLang(),
    fallbackLng: 'en',
    load: 'all',
    defaultNS: 'common',
    fallbackNS: 'common',
    interpolation: { escapeValue: false },
    // eslint-disable-next-line no-undef
    debug: __DEV__
  })

export default i18n
