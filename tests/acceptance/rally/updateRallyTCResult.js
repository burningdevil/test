const request = require('request')
const rallyConfig = require('./rallyConfig')

const today = new Date()

// Update Rally Test Case Result using the retrieved Test Case URL and the corresponding test result
module.exports = function updateRallyTCResult({ testCaseId, tcUrl, verdict, duration, release, build, note }) {
  const options = {
    url: rallyConfig.apiUrl + '/testcaseresult/create',
    method: 'POST',
    headers: {
      zsessionid: rallyConfig.rallyApiKey
    },
    json: {
      TestCaseResult: {
        Build: build,
        Date: today,
        TestCase: tcUrl,
        Verdict: verdict,
        Duration: duration,
        c_ProductionRelease: release,
        Tester: rallyConfig.testInfo.tester,
        c_ClientOS: rallyConfig.testInfo.clientOS,
        // 'c_BrowserType': rallyConfig.testInfo.browserType,
        c_Language: rallyConfig.testInfo.language,
        Notes: note
      }
    }
  }

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (!error) {
        console.info(`Updating Rally request has succeeded: ${testCaseId}, ${verdict}, ${release}, ${build}, ${note}`)
        resolve(body)
      } else {
        console.error(`Updating Rally request has failed: ${testCaseId}, ${verdict}, ${release}, ${build}. Error: ${error}`)
        reject(error)
      }
    })
  })
}
