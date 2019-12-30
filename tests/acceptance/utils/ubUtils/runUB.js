const {
  generateUBReports,
  countSuccessfulReports
} = require('./ubDataParser.js')
const { getAverage, clearExistingReports } = require('./averageUBCalculator.js')
const execSync = require('child_process').execSync

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Function to run test with UB flag enabled for three times.
const runUB = async () => {
  let output
  let count = countSuccessfulReports()
  let error = 0
  // 1. count: UB tests will be run for {count} times.
  //    You can adjust this to a big number and use it in the stability test,
  //    or just for making the result more acurate to reflect the average.
  // 2. error: in the end, error will be used to calculate the error ratio during the UB test.
  //    However, error should not increase without a limit.
  //    Here, the UB test will fail if error is encountered more than 5 times.
  while (count <= 2 && error <= 5) {
    try {
      output = execSync(
        `yarn test --args.ubConf.enableUB true --args.ubConf.ubReportPath ./reports/raw/report${count +
          1}.json`,
        { encoding: 'utf-8' }
      )
      console.info(`Output for the ${count + 1}st round is: ${output}`)
      await sleep(3000)
    } catch (err) {
      console.error(
        'error rate is increased! Continue running... If error count reaches 5, whole process will stop.'
      )
      console.info(err)
      error++
      await sleep(3000)
    }
    count = countSuccessfulReports()
  }
  const errorRatio = error / count
  console.info(`error ratio is: ${errorRatio}`)
}

// run complete workflow: run UB test, process raw reports, and calculate average
;(async () => {
  clearExistingReports()
  await runUB()
  // generate individual ub reports.
  const rawUBFolder = './reports/raw/'
  generateUBReports(rawUBFolder)
  // calculate average for all individual ub reports.
  const individualUBFolder = './reports/ubIndividual/'
  getAverage(individualUBFolder)
})()
