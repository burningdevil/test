export default () => {
  const LANGUAGES = [
    'da',
    'de',
    'en-GB',
    'en-US',
    'en',
    'es',
    'fr',
    'it',
    'ja',
    'ko',
    'nl',
    'pl',
    'pt',
    'ru',
    'sv',
    'zh-TW',
    'zh',
    'zh-CN'
  ]
  let lang = navigator.language
  // 1. matching xx-YY patterns
  if (LANGUAGES.indexOf(lang) < 0) {
    const separatorIndex = lang.indexOf('-')
    if (separatorIndex >= 0) {
      lang = lang.substring(0, separatorIndex)
    }
    // 2. matching xx
    if (LANGUAGES.indexOf(lang) < 0) {
      lang = 'en'
    }
  }
  return lang
}
