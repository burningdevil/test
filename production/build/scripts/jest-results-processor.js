const fs = require('fs-extra')
const readPkg = require('read-pkg')

const PACKAGE_PROP = 'jest-result-processor'

module.exports = testResults => {
  const packagedData = readPkg.sync(process.cwd())
  const config = packagedData[PACKAGE_PROP] || { outputFile: 'jest-result-json/results.json' }

  fs.outputJSON(config.outputFile, {
    ...testResults,
    endTime: Date.now()
  }, err => {
    if (err) {
      console.warn('Unable to write test results JSON', err)
    }
  })
  return testResults
}
