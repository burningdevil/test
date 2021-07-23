
import i18next, { TFunction } from 'i18next'
import languages from './languages'

export const i18nextInstance = i18next.createInstance()
i18nextInstance.init({
  lng: /* 'zh-CN' */ navigator.language,
  fallbackLng: ['en'],
  resources: languages,
})

export const t: TFunction = i18nextInstance.t.bind(i18nextInstance)
