
import i18next, { TFunction } from 'i18next'

const languages = {
    'da': {
      translation: require('./strings/da.json')
    },
    'de': {
      translation: require('./strings/de.json')
    },
    'en-GB': {
      translation: require('./strings/en-GB.json')
    },
    'en-US': {
      translation: require('./strings/en-US.json')
    },
    'en': {
      translation: require('./strings/en.json')
    },
    'es': {
      translation: require('./strings/es.json')
    },
    'fr': {
      translation: require('./strings/fr.json')
    },
    'it': {
      translation: require('./strings/it.json')
    },
    'ja': {
      translation: require('./strings/ja.json')
    },
    'ko': {
      translation: require('./strings/ko.json')
    },
    'nl': {
      translation: require('./strings/nl.json')
    },
    'pl': {
      translation: require('./strings/pl.json')
    },
    'pt': {
      translation: require('./strings/pt.json')
    },
    'sv': {
      translation: require('./strings/sv.json')
    },
    'zh-CN': {
      translation: require('./strings/zh-CN.json')
    },
    'zh-TW': {
      translation: require('./strings/zh-TW.json')
    },
    'zh': {
      translation: require('./strings/zh.json')
    },
    'test': {
      translation: require('./test.json')
    }
  }

export const i18nextInstance = i18next.createInstance()
i18nextInstance.init({
  lng: /* 'zh-CN' */ navigator.language,
  fallbackLng: ['test'],
  resources: languages,
})

export const t: TFunction = i18nextInstance.t.bind(i18nextInstance)
