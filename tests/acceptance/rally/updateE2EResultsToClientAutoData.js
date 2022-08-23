const request = require('request')

const fs = require('fs')
const path = require('path')
const cmd = process.argv[2]
const ostype = process.platform === 'win32' ? 'Windows' : 'Mac'
let build, buildUrl

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

if (cmd === '-c' && process.argv[3]) {
  build = process.argv[3]
  buildUrl = process.argv[4]
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
    url: 'https://microstrategy.webhook.office.com/webhookb2/ab1919e2-c4eb-46fd-9472-de3de2f44ede@901c038b-4638-4259-b115-c1753c7735aa/IncomingWebhook/94fb07bb53d745a7bab5375d845afee6/56f852fa-265a-4f48-9620-eaff30c9b61e',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    json: {
      "type": "message",
      "attachmentLayout": "builder.AttachmentLayout.list",
      "attachments": [
        {
          "contentType": "application/vnd.microsoft.card.adaptive",
          "content": {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.3",
            "msteams": {
              "width": "Full",
              "entities": [
                {
                  "type": "mention",
                  "text": "<at>Xu, Bin</at>",
                  "mentioned": {
                    "id": "bxu@microstrategy.com",
                    "name": "Xu, Bin"
                  }
                }]
            },
            "body": [
              {
                "type": "Container",
                "items": [
                  {
                    "type": "Container",
                    "items": [
                      {
                        "type": "TextBlock",
                        "text": "Workstation Custom App Automation Summary on " + ostype,
                        "style": "default",
                        "fontType": "Default",
                        "size": "Default",
                        "weight": "Bolder"
                      }
                    ]
                  },
                  {
                    "type": "Container",
                    "style": "default",
                    "items": [
                      {
                        "type": "TextBlock",
                        "text": "Build: " + resultData.buildNumber,
                        "wrap": true
                      },
                      {
                        "type": "RichTextBlock",
                        "inlines": [
                          {
                            "type": "TextRun",
                            "text": "Pass: "
                          },
                          {
                            "type": "TextRun",
                            "color": "Good",
                            "text": ` ${totalPass}`
                          },
                          {
                            "type": "TextRun",
                            "text": "   Fail:"
                          },
                          {
                            "type": "TextRun",
                            "color": "Attention",
                            "text": ` ${totalFail}`
                          },
                          {
                            "type": "TextRun",
                            "text": "   Total:"
                          },
                          {
                            "type": "TextRun",
                            "text": ` ${(totalPass + totalFail)}`
                          }
                        ]
                      },
                      {
                        "type": "TextBlock",
                        "text": "[View job on CI](" + buildUrl + ")",
                        "wrap": true
                      },
                      {
                        "type": "TextBlock",
                        "text": "[View details on dossier](https://aqueduct.microstrategy.com/MicroStrategyLibrary/app/0730F68F4B8B4B52AA23F0AAB46F3CA8/FE3ADDA23C4F3DC67C7C7892C0346CCF/bookmarks?ids=7FE6708F264CE96909FAE4BDC0118B2C)",
                        "wrap": true
                      },
                      {
                        "type": "TextBlock",
                        "text": "CC <at>Xu, Bin</at>",
                        "wrap": true
                      }
                    ],
                    "horizontalAlignment": "Left"
                  }
                ]
              }
            ]
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
  testSuitName: 'Workstation Custom App End to End Tests on ' + ostype,
  buildNumber: build,
  owner: 'Li,Meng',
  product: 'Workstation',
  team: 'CT-Applications-CTC',
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
  //updateToClientAutoDataDB(resultMap)
  sendSlackMessage(resultMap)

} else {
  console.log('No output report file exists in specified path: ' + filePath)
}
