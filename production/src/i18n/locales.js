import daStrings from './strings/da.json'
import deStrings from './strings/de.json'
import enGBStrings from './strings/en-GB.json'
import enUSStrings from './strings/en-US.json'
import enStrings from './strings/en.json'
import esStrings from './strings/es.json'
import frStrings from './strings/fr.json'
import itStrings from './strings/it.json'
import jaStrings from './strings/ja.json'
import koStrings from './strings/ko.json'
import nlStrings from './strings/nl.json'
import plStrings from './strings/pl.json'
import ptStrings from './strings/pt.json'
import ruStrings from './strings/ru.json'
import svStrings from './strings/sv.json'
import zhCNStrings from './strings/zh-CN.json'
import zhTWStrings from './strings/zh-TW.json'
import zhStrings from './strings/zh.json'

// NOTE: delete locales that are not used in your app

const locales = {
  da: { common: daStrings },
  de: { common: deStrings },
  'en-GB': { common: enGBStrings },
  'en-US': { common: enUSStrings },
  en: { common: enStrings },
  es: { common: esStrings },
  fr: { common: frStrings },
  it: { common: itStrings },
  ja: { common: jaStrings },
  ko: { common: koStrings },
  nl: { common: nlStrings },
  pl: { common: plStrings },
  pt: { common: ptStrings },
  ru: { common: ruStrings },
  sv: { common: svStrings },
  'zh-CN': { common: zhCNStrings },
  'zh-TW': { common: zhTWStrings },
  zh: { common: zhStrings }
}

export default locales
