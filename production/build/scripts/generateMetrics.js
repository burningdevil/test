/* eslint-disable no-console */
const fs = require('fs-extra')
const path = require('path')
const pkg = require('read-pkg')
const shell = require('shelljs')
const project = require('../../project.config')

function newLine () {
  console.log('\r\n')
}

function generateUnitTestResultsMetrics () {
  const summaryFile = path.resolve(project.basePath, pkg.sync(process.cwd())['jest-result-processor'].outputFile)
  try {
    const cmd = `jest --coverage`
    const output = shell.exec(cmd)
    processResponse(output.code, `Test failure. cmd:${cmd}`)
    const cov = fs.readFileSync(summaryFile)

    const { numTotalTests, numFailedTests, numPassedTests, startTime, endTime } = JSON.parse(cov)

    const result = {
      UNIT_TEST_TOTAL: numTotalTests,
      UNIT_TEST_FAILURES: numFailedTests,
      UNIT_TEST_SUCCESSES: numPassedTests,
      UNIT_TEST_DURATION: (endTime - startTime) / 1000
    }

    // devops would pick up the data from the console and persist it
    console.log(`METRICS_UNIT=${JSON.stringify(result)}`)
  } finally {
    try {
      fs.removeSync(summaryFile)
    } catch (e) {
      console.log(e)
    }
  }
}

function generateCodeCoverageMetrics () {
  const coverageFolder = path.resolve(project.basePath, 'coverage')
  const summaryFile = path.resolve(coverageFolder, 'coverage-summary.json')
  const cov = fs.readFileSync(summaryFile)

  const { total: { lines, functions, branches } } = JSON.parse(cov)

  const result = {
    TOTAL_LINE: lines.total,
    TOTAL_LINE_COVERED: lines.covered,
    TOTAL_PACKAGE: 0,
    TOTAL_PACKAGE_COVERED: 0,
    TOTAL_CLASS: 0,
    TOTAL_CLASS_COVERED: 0,
    TOTAL_METHOD: functions.total,
    TOTAL_METHOD_COVERED: functions.covered,
    TOTAL_BRANCH: branches.total,
    TOTAL_BRANCH_COVERED: branches.covered
  }

  // devops would pick up the data from the console and persist it
  console.log(`METRICS_UT_COVERAGE=${JSON.stringify(result)}`)
}

function generateLintingMetrics () {
  const LINT_OUTPUT_FILE = 'lint-output.json'
  try {
    const cmd = `eslint ${path.resolve(project.basePath, 'src')} -f json -o ${LINT_OUTPUT_FILE}`
    const output = shell.exec(cmd)
    const errorCount = JSON.parse(fs.readFileSync(LINT_OUTPUT_FILE)).reduce(
      (count, cur) => {
        count += cur.errorCount || 0
        return count
      },
      0
    )
    processResponse(output.code, `linting error: ${output.toString()}cmd:${cmd} ErrorCount: ${errorCount}`)
    const warningCount = JSON.parse(fs.readFileSync(LINT_OUTPUT_FILE)).reduce(
      (count, cur) => {
        count += cur.warningCount || 0
        return count
      },
      0
    )
    const result = { Errors: errorCount, Warnings: warningCount }
    console.log(`METRICS_CODE_ANALYSIS=${JSON.stringify(result)}`)
  } finally {
    try {
      fs.removeSync(LINT_OUTPUT_FILE)
    } catch (e) {
      console.log(e)
    }
  }
}

function processResponse(code, messg) {
  if (code) {
    throw new Error(messg)
  }
}

// The data collecting logic would need a new line to separate the output of each metric category
[
  newLine,
  generateUnitTestResultsMetrics,
  newLine,
  generateCodeCoverageMetrics,
  newLine,
  generateLintingMetrics,
  newLine
].forEach(f => f())
