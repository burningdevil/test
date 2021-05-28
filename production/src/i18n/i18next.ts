
import i18next, { TFunction } from 'i18next'
import locales from './locales'

export const i18nextInstance = i18next.createInstance()
i18nextInstance.init({
  lng: /* 'zh-CN' */ navigator.language,
  fallbackLng: ['en'],
  resources: locales,
  defaultNS: 'common',
  fallbackNS: 'common'
})

export const t: TFunction = i18nextInstance.t.bind(i18nextInstance)
