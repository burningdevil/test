/* global status:true */
module.exports = function e2eResultsParser({ file, resultMap }) {
  return new Promise((resolve, reject) => {
    try {
      let tcVerdict
      const hashMap = new Map()
      let totalScenarioDuration

      // get count of features in the cucumber.json file
      const featureCount = Object.keys(file).length

      // iterate through all the features to get scenarios
      for (let i = 0; i < featureCount; i++) {
        // get count of scenarios in the cucumber.json file
        const scenarioCount = Object.keys(file[i].elements).length

        // iterate through all the scenarios to get steps
        for (let j = 0; j < scenarioCount; j++) {
          // create a scenario variable to reuse
          const scenarios = file[i].elements[j]
          totalScenarioDuration = 0

          // get test case description. description = test case id + name
          const testcaseDescription = scenarios.name

          let statusResult = true

          // get count of steps in the cucumber.json file
          const stepCount = Object.keys(scenarios.steps).length

          let tcDetails = 'Steps to reproduce:\n'

          // iterate through steps to get the pass/fail status of each step
          for (let k = 0; k < stepCount; k++) {
            const steps = scenarios.steps[k]
            const testCaseStatus = steps.result.status
            totalScenarioDuration = totalScenarioDuration + steps.result.duration

            // check the status of each step
            if (testCaseStatus === 'passed') {
              status = true
            } else {
              status = false
              // console.log('Inside false condition at k='+k);
              tcDetails = tcDetails + '\n' + steps.name
            }
            // Use AND operator to determine pass/fail of scenario based on all the steps
            statusResult = status && statusResult

            // Add to intermediary map to consolidate the scenario outline mutiple run results
            if (!hashMap[testcaseDescription]) {
              hashMap[testcaseDescription] = { statusResult, totalScenarioDuration, tcDetails }
            } else {
              const prevRunResult = hashMap[testcaseDescription].statusResult

              // Conserving the failed steps for a failed run
              const prevDetail = hashMap[testcaseDescription].tcDetails
              statusResult = status && prevRunResult
              if (tcDetails === 'Steps to reproduce:\n') {
                tcDetails = prevDetail
              }
              hashMap[testcaseDescription] = { statusResult, totalScenarioDuration, tcDetails }
            }
          }
        }
      }
      for (const testcaseDescription in hashMap) {
        if (testcaseDescription.includes('[')) {
          // split the test case descriptio using '[' as a delimiter to get the test case id
          const testCaseId = (((testcaseDescription.split('['))[1]).split(']'))[0]
          const tcResult = hashMap[testcaseDescription].statusResult
          if (tcResult) {
            tcVerdict = 'Pass'
          } else if (tcResult === false) {
            tcVerdict = 'Fail'
          } else {
            tcVerdict = 'Blocked'
          }
          // add test case id and verdict to map to consume in updateE2EResultsToRally.js file
          resultMap.set(testCaseId,
            {
              verdict: tcVerdict,
              duration: (hashMap[testcaseDescription].totalScenarioDuration / 1000).toFixed(2),
              description: testcaseDescription,
              details: hashMap[testcaseDescription].tcDetails
            })
        }
      }
      resolve(resultMap)
    } catch (err) {
      reject(err)
    }
  })
}
