const reporter = require('cucumber-html-reporter')

const options = {
  theme: 'bootstrap',
  jsonFile: './reports/rallyReport/execReport.json',
  output: './reports/htmlReport.html',
  reportSuiteAsScenarios: true,
  launchReport: true,
  metadata: {
    'App Version': 'TBD',
    'Test Environment': 'Local',
    Browser: 'TBD',
    Platform: 'MacOS',
    Parallel: 'Scenarios',
    Executed: 'Remote'
  }
}

try {
  reporter.generate(options)
} catch (err) {
  console.log(err)
}

