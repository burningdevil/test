const request = require('request')

const fs = require('fs')
const path = require('path')
const cmd = process.argv[2]
let build

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

if (cmd === '-c' && process.argv[3]) {
  build = process.argv[3]
  console.log(`build: ${build}`)
} else {
  console.info(helpMsg)
  process.exit()
}

async function updateToClientAutoDataDB(resultData) {
  const options = {
    url: 'http://ctc-android2.labs.microstrategy.com:8088/api/v1/saveAutoData',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    json: resultData
  }

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        console.info(`Dump result to CLIENTAUTODATA successfully. data=` + JSON.stringify(resultData))
        resolve(body)
      } else {
        console.error(`Failed to dump result to CLIENTAUTODATA: ` + JSON.stringify(resultData))
        console.error(`Error: ${error}; Status Code: ${response.statusCode}`)
        reject(error)
      }
    })
  })
}

async function sendSlackMessage(resultData) {
  const testCount = Object.keys(resultData.testResults).length
  let totalFail = 0
  let totalPass = 0
  for (let i = 0; i < testCount; i++) {
    const testResult = resultData.testResults[i]
    if (testResult.passedStep > 0 && testResult.failedStep === 0) {
      totalPass = totalPass + 1
    } else {
      totalFail = totalFail + 1
    }
  }

  const options = {
    url: 'https://hooks.slack.com/services/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',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    json: {
      "blocks": [
        {
          "type": "header",
          "text": {
            "type": "plain_text",
            "text": "Workstation Custom App Automation Summary",
            "emoji": true
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "section",
          "fields": [
            {
              "type": "mrkdwn",
              "text": "Build " + resultData.buildNumber
            }
          ]
        },
        {
          "type": "section",
          "fields": [
            {
              "type": "mrkdwn",
              "text": "*Pass:* " + totalPass + ";   *Fail:* `" + totalFail + "`;    Total: " + (totalPass + totalFail)
            }
          ]
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "<https://aqueduct.microstrategy.com/MicroStrategyLibrary/app/0730F68F4B8B4B52AA23F0AAB46F3CA8/1774168AB7405F718A6EF88CDF15FCD4/bookmarks?ids=025DCCC9A34A81CBAE92239D4070A805|View details on dossier>"
          }
        }
      ]
    }
  }

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        console.info(`Send slack message successfully.`)
        resolve(body)
      } else {
        console.error(`Failed to send slack message.`)
        console.error(`Error: ${error}; Status Code: ${response.statusCode}`)
        reject(error)
      }
    })
  })
}

async function e2eResultsParserForDumpClientData({ file, resultMap }) {
  return new Promise((resolve, reject) => {
    try {
      let totalScenarioDuration
      let totalPass, totalFail, totalScreenshotPass, totalScreenshotFailed

      // get count of features in the cucumber.json file
      const featureCount = Object.keys(file).length

      // iterate through all the features to get scenarios
      for (let i = 0; i < featureCount; i++) {
        // get count of scenarios in the cucumber.json file
        const scenarioCount = Object.keys(file[i].elements).length
        totalScenarioDuration = 0
        totalPass = 0
        totalFail = 0
        totalScreenshotPass = 0
        totalScreenshotFailed = 0

        // iterate through all the scenarios to get steps
        for (let j = 0; j < scenarioCount; j++) {
          // create a scenario variable to reuse
          const scenarios = file[i].elements[j]

          // get count of steps in the cucumber.json file
          const stepCount = Object.keys(scenarios.steps).length

          // iterate through steps to get the pass/fail status of each step
          for (let k = 0; k < stepCount; k++) {
            const steps = scenarios.steps[k]
            const testCaseStatus = steps.result.status
            if (Number.isInteger(steps.result.duration)) totalScenarioDuration = totalScenarioDuration + steps.result.duration
            // check the status of each step
            if (testCaseStatus === 'passed') {
              totalPass = totalPass + 1
              if (steps.name !== undefined && steps.name.includes('check the screenshot by comparing')) totalScreenshotPass = totalScreenshotPass + 1
            } else {
              totalFail = totalFail + 1
              if (steps.name !== undefined && steps.name.includes('check the screenshot by comparing')) totalScreenshotFailed = totalScreenshotFailed + 1
            }
          }

        }
        resultMap.testResults.push({
          elapsedTime: (totalScenarioDuration / 1000000000).toFixed(2),
          failedScreenshotComp: totalScreenshotFailed,
          failedStep: totalFail,
          passedScreenshotComp: totalScreenshotPass,
          passedStep: totalPass,
          testCaseName: file[i].name
        })

      }

      resolve(resultMap)
    } catch (err) {
      reject(err)
    }
  })
}

const resultMap = {
  testSuitName: 'Workstation Custom App Tests',
  buildNumber: build,
  owner: 'Li,Meng',
  product: 'Workstation',
  team: 'CT-Clients-Framework',
  testResults: []
}
const resultReport = './reports/rallyReport/execReport.json'
// const resultReport = './acceptance/reports/rallyReport/execReport.json'

const filePath = path.resolve(resultReport)
if (fs.existsSync(resultReport)) {
  console.info(`Start analyzing file: ${filePath}`)
  const file = JSON.parse(fs.readFileSync(filePath))
  e2eResultsParserForDumpClientData({ file, resultMap })
  console.info(`Complete analyzing file: ${filePath}`)
  updateToClientAutoDataDB(resultMap)
  sendSlackMessage(resultMap)

} else {
  console.log('No output report file exists in specified path: ' + filePath)
}
