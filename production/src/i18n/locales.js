import daStrings from './strings/da'
import deStrings from './strings/de'
import enGBStrings from './strings/en-GB'
import enUSStrings from './strings/en-US'
import enStrings from './strings/en'
import esStrings from './strings/es'
import frStrings from './strings/fr'
import itStrings from './strings/it'
import jaStrings from './strings/ja'
import koStrings from './strings/ko'
import nlStrings from './strings/nl'
import plStrings from './strings/pl'
import ptStrings from './strings/pt'
import ruStrings from './strings/ru'
import svStrings from './strings/sv'
import zhCNStrings from './strings/zh-CN'
import zhTWStrings from './strings/zh-TW'
import zhStrings from './strings/zh'

// NOTE: delete locales that are not used in your app

const locales = {
  'da': { common: daStrings },
  'de': { common: deStrings },
  'en-GB': { common: enGBStrings },
  'en-US': { common: enUSStrings },
  'en': { common: enStrings },
  'es': { common: esStrings },
  'fr': { common: frStrings },
  'it': { common: itStrings },
  'ja': { common: jaStrings },
  'ko': { common: koStrings },
  'nl': { common: nlStrings },
  'pl': { common: plStrings },
  'pt': { common: ptStrings },
  'ru': { common: ruStrings },
  'sv': { common: svStrings },
  'zh-CN': { common: zhCNStrings },
  'zh-TW': { common: zhTWStrings },
  'zh': { common: zhStrings }
}

export default locales
