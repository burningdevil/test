/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
const ejs = require('ejs')
const fs = require('fs')
const path = require('path')

const translationPath = `${__dirname}/../../locale`
const templatePath = `${__dirname}/languages.ejs`
const filePath = `${__dirname}/../../src/i18n/languages.ts`

const defaultLocale = 'en'
const defaultTranslation = path.resolve(
  `${translationPath}/${defaultLocale}.json`
)
const defaultTranslationFilePath = `${__dirname}/../../src/i18n/strings/${defaultLocale}.json`

// get current locale list that having related translation json files in the `${translationPath}` folder,
// the `${translationPath}` folder is the place where we stored the translation json files,
// which will be downloaded during build
function getCurrentLocalesWithTranslation() {
  let locales = []

  try {
    locales = fs
      .readdirSync(translationPath, { withFileTypes: false })
      .filter(file => path.extname(file) === '.json')
      .map(file => path.basename(file, '.json'))
  } catch (e) {
    console.log('Could not get current locale list.')
  }

  return locales
}

// merge the content of multi files
function mergeFileContent(fileList) {
  const content = {}
  fileList.forEach(item => {
    let currContent
    try {
      currContent = JSON.parse(fs.readFileSync(item, 'utf8'))
      console.log(`Merged translations in ${item}.`)
    } catch (e) {
      // skip some cases:
      //         1. the file is not existed
      //         2. the file content is not a valid json
      currContent = {}
    }
    Object.assign(content, currContent)
  })

  return JSON.stringify(content)
}

// if no translation json files in the `${translationPath}` folder,
// generate the default one, copy to the folder
// else merge it with existed default one
function handleDefaultLocaleTranslation() {
  // create `${translationPath}` folder if necessary
  if (!fs.existsSync(translationPath)) {
    console.log(`${translationPath} is not existed, create it.`)
    fs.mkdirSync(translationPath)
  }

  const tanslationFilePaths = [
    // ...featureTranslationFilePaths,
    defaultTranslationFilePath,
  ]
  // merge the default en.json with string bundle, so that we can use the translation before
  // the string bundle is updated
  if (fs.existsSync(defaultTranslation)) {
    console.log(
      `Found ${defaultTranslation}, will merge it with the default defined in the code.`
    )
    tanslationFilePaths.push(defaultTranslation)
  }
  const translations = mergeFileContent(tanslationFilePaths)

  // generate the default translation json file in `${translationPath}` folder
  try {
    fs.writeFileSync(defaultTranslation, translations)
  } catch (e) {
    console.log(e.message)
  }
}

function generateLanguageFile() {
  const supportedLocales = getCurrentLocalesWithTranslation()

  if (supportedLocales.length === 0) {
    supportedLocales.push(defaultLocale)
  }

  handleDefaultLocaleTranslation()

  // use ejs library to generate the `language.ts` file, including the current support locales with translations
  ejs.renderFile(templatePath, { supportedLocales }, null, (e, content) => {
    if (e) {
      console.log(e)
      return false
    }

    fs.writeFile(filePath, content, err => {
      if (err) {
        console.log(err)
        return false
      }
      console.log('Done generating languages.ts.')
      return true
    })
  })
}

generateLanguageFile()
