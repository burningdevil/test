# Analyzing test results
The test run result file is named 'execReport.json' is located under the 'reports/rallyReport' folder.

The rally update automation script to map mutiple scenraio runs under a single scenario outline to 1 TC in rally.
For a TC to be marked as pass, all the scenarios under a particular scenario outline needs to pass. The report is analyzed on the basis of test case number and marked pass or fail based on the result status.

Incase of a failure at any step within a scenario, a defect will be automatically created for the failed and skipped steps in the scenario and would be linked to the scenario which is further linked to a unique test case.

## Updating Test Results to Rally

When the test executions are complete, the screenshot reporter above generates the test results in JSON format. We can parse and upload the results to the Rally Test Case Results. We can also customize the pre-defined Rally configuration parameters in [`rallyConfig.js`](../rally/rallyConfig.js).

```sh
node rally/updateE2EResultsToRally.js -c <production_release> <build#>
```

Example:
```sh
node rally/updateE2EResultsToRally.js -c 11.1.0_[2018-Dec-14] 11.1.0000.0000
```