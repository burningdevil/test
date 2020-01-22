const fs = require('fs')
const chromeFile = './node_modules/selenium-webdriver/http/index.js'
const chromeFile2 = './node_modules/protractor/node_modules/selenium-webdriver/http/index.js'
fs.readFile(chromeFile, 'utf8', (err, data) => {
  if (err) {
    fs.readFile(chromeFile2, 'utf8', (err2, data2) => {
      if (err2) {
        console.log('Patching Selenium has failed.')
        throw err2
      }
      const result2 = data2.replace(/e.code === 'ECONNRESET'/g,
        `e.code === 'ECONNRESET' || e.code === 'EPIPE'`)
      fs.writeFileSync(chromeFile2, result2, 'utf8')
      console.log(`Patched ${chromeFile2}`)
    })
  } else {
    const result = data.replace(/e.code === 'ECONNRESET'/g,
      `e.code === 'ECONNRESET' || e.code === 'EPIPE'`)
    fs.writeFileSync(chromeFile, result, 'utf8')
    console.log(`Patched ${chromeFile}`)
  }
})
