
const fs = require('fs')
const { execSync } = require('child_process')
const { clearFiles, sleep } = require('./utils/generalUtils.js')
const _ = require('lodash')

const rerunsFOLDER = './reports/reruns'
const rerunFile = `${rerunsFOLDER}/@rerun.txt`

const reportsFOLDER = './reports/rallyReport'
const reportFile = `${reportsFOLDER}/execReport.json`

function clearExistingReports () {
  clearFiles(rerunsFOLDER, '.txt')
  clearFiles(reportsFOLDER, '.json')
}

// Returns false if there is only one failed scenario left.
async function rerunRestScenarios() {
  let count = 0
  while (fs.existsSync(rerunFile)) {
    console.info(`running failed scenarios...count ${count}`)
    // rename the file to add suffix of the running round
    const currentFile = `${rerunsFOLDER}/@rerun_${count}.txt`
    const currentReport = `${reportsFOLDER}/execReport_${count}.json`

    fs.renameSync(rerunFile, currentFile)
    fs.renameSync(reportFile, currentReport)

    let data = fs.readFileSync(currentFile, 'utf8')

    const lines = data.split('\n')
    console.log('check lines: ', lines, lines.length)
    const lineInfo = lines[0].split(':')
    // if only one failed scenario left in the first line
    if (lineInfo.length <= 2) {
      // check if this is the only line
      if (lines.length <= 1) {
        // if yes, no @rerun file will be generated, change the renamed rerun file back.
        console.info('No more scenarios to run')
        fs.renameSync(currentFile, rerunFile)
        return false
      } else {
        // if more lines, remove the line to generate the @rerun file to run the next round of test
        data = lines.slice(1).join('\n')
      }
    } else {
      // remove the first scenario
      const featureName = lineInfo[0]
      const scenarios = lineInfo.slice(2).join(':')
      // update the first line
      lines[0] = `${featureName}:${scenarios}`
      data = lines.join('\n')
    }
    // write the @rerun text file for the next run
    fs.writeFileSync(rerunFile, data, 'utf8')
    try {
      execSync(`yarn testRerun`, { stdio: 'inherit', encoding: 'utf-8' })
      // waiting for cucumber to generate the execReport.json file
      await sleep(3000)
    } catch (e) {
      await sleep(3000)
      console.log('test failed')
    }

    // increasing count
    count++
  }

  return true
}

async function rerunFailedScenarios() {
  // Add a dummy line in the beginning of the rerun file because the first line will be removed by rerunRestScenarios(). The rest will be reruned automatically.
  let failedLines = fs.readFileSync(rerunFile, 'utf8')
  const lines = failedLines.split('\n')
  const lineInfo = lines[0].split(':')
  const featureName = lineInfo[0]
  const scenarios = `999:${lineInfo.slice(1).join(':')}`
  lines[0] = `${featureName}:${scenarios}`
  failedLines = lines.join('\n')
  fs.writeFileSync(rerunFile, failedLines, 'utf8')

  return rerunRestScenarios()
}

// 1. Since we are using "fail-fast" in the cucumberOpts, if one scenario fails, all following scenario will be skipped and marked as fail
// 2. We have a rerun.txt file that track all failed scenarios
// 3. This function makes sure all skipped scenario are rerun again and get a real status of fail or pass.
async function testWithRerun() {
  // first execution
  try {
    execSync(`yarn test`, { stdio: 'inherit', encoding: 'utf-8' })
  } catch (e) {
    console.info('Test finished with failed scenarios.')
    await sleep(3000)
    // following execution with rerun txt
    await rerunRestScenarios()
  }
}

// return: passed, failed, skipped
const getScenarioStatus = function (steps) {
  if (steps.length === 0) {
    return 'failed'
  }
  let result = steps[0].result.status
  if (result === 'failed' || result === 'skipped') {
    return result
  }
  steps.forEach((step) => {
    if (step.result.status === 'failed') {
      result = 'failed'
    }
  })
  return result
}

// For the features list, if the ID of the feature is the same, merge the scenarios(elements) of the feature into one
const mergeScenarios = function(features) {
  const result = []
  const map = new Map()
  features.forEach((feature) => {
    const id = feature.id
    if (!map.has(id)) {
      map.set(id, feature)
    } else {
      // here, each feature contains a single scenario
      map.get(id).elements.push(feature.elements[0])
    }
  })

  for (const feature of map.values()) {
    result.push(feature)
  }
  return result
}

function mergeRallyReports () {
  let updatedFeatures = []
  fs.readdirSync(reportsFOLDER).forEach(reportName => {
    if (reportName !== 'execReport.json') {
      console.info(`Merging report ${reportName}`)
      const resultReport = `./${reportsFOLDER}/${reportName}`

      const reportData = JSON.parse(fs.readFileSync(resultReport))

      reportData.forEach((feature) => {
        feature.elements.forEach((scenario) => {
          // push scenario that is 'passed' and 'failed'
          if (getScenarioStatus(scenario.steps) !== 'skipped') {
            // make sure there is no duplicate scenarios in the updatedFeature list
            updatedFeatures = updatedFeatures.filter((updatedFeature) => {
              return updatedFeature.elements[0].id !== scenario.id || updatedFeature.elements[0].line !== scenario.line
            })
            // console.log(`pushing a ${getScenarioStatus(scenario.steps)} scenario into the updated features file`)
            updatedFeatures.push({ ...feature, elements:[scenario] })
          }
        })
      })
    }
  })

  const mergedReports = mergeScenarios(updatedFeatures)
  if (mergedReports.length !== 0) {
    clearFiles(reportsFOLDER, '.json')
    fs.appendFileSync(`${reportsFOLDER}/execReport.json`, JSON.stringify(mergedReports, null, 2), 'UTF-8')
  } else {
    console.log('mergedReports is []')
  }
}

function generateRerunFileForFailedTests() {
  const featureList = []

  const resultReport = `${reportsFOLDER}/execReport.json`
  const reportData = JSON.parse(fs.readFileSync(resultReport))
  reportData.forEach((feature) => {
    const featureURI = feature.uri
    const failedScenarioLines = []
    feature.elements.forEach((scenario) => {
      // push scenario that is 'failed'
      if (getScenarioStatus(scenario.steps) === 'failed') {
        failedScenarioLines.push(scenario.line)
      }
    })
    if (failedScenarioLines.length !== 0) {
      const lines = _.join(failedScenarioLines, ':')
      featureList.push(`${featureURI}:${lines}`)
    }
  })

  // if length == 0, no rerun file is generated.
  // write the @rerun text file for the next run
  if (featureList.length !== 0) {
    console.log(`failed!!! at ${featureList[0]}`)
    fs.writeFileSync(rerunFile, _.join(featureList, '\n'), 'utf8')
    return true
  } else {
    console.log('passed!!!')
    // remove the existing @rerun.txt file if there is any left behind
    clearFiles(rerunsFOLDER, '.txt')
    return false
  }
}

// Entry point of "yarn flakeTest"
(async () => {
  clearExistingReports()
  await testWithRerun()
  mergeRallyReports()
  if (generateRerunFileForFailedTests()) {
    let remainingAttempts = 2
    do {
      console.log(`retrying for round ${3 - remainingAttempts}`)
      await rerunFailedScenarios()
      mergeRallyReports()
      remainingAttempts--
    } while (remainingAttempts >= 0 && fs.existsSync(rerunFile) && generateRerunFileForFailedTests())
  }
})()
