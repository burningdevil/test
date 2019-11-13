
const fs = require('fs')
const {execSync} = require('child_process');
const {clearFiles,sleep}  = require('./utils/generalUtils.js')

const rerunsFOLDER = './reports/reruns'
const rerunFile = `${rerunsFOLDER}/@rerun.txt`

const reportsFOLDER = './reports/rallyReport'
const reportFile = `${reportsFOLDER}/execReport.json`
const _ = require('lodash')

async function testWithRerun() {
    clearFiles(rerunsFOLDER, '.txt')
    clearFiles(reportsFOLDER, '.json')
    let count = 0
    // first execution
    try {
        execSync(`yarn test`, { stdio: 'inherit', encoding: 'utf-8' });
    } catch (e) {
        console.info('Test finished with failed scenarios.')
        await sleep(3000);           
        // following execution with rerun txt
        while (fs.existsSync(rerunFile)) {
            console.info(`running failed scenarios...count ${count}`)
            // rename the file to add suffix of the running round
            let currentFile = `${rerunsFOLDER}/@rerun_${count}.txt`
            let currentReport = `${reportsFOLDER}/execReport_${count}.json`

            fs.renameSync(rerunFile, currentFile)
            fs.renameSync(reportFile, currentReport)

            let data = fs.readFileSync(currentFile, 'utf8')

            let lines = data.split('\n')
            console.log('check lines: ', lines, lines.length)
            let lineInfo = lines[0].split(':')
            // if only one failed scenario left in the first line
            if (lineInfo.length <= 2) {
                // check if this is the only line
                if (lines.length <= 1) {
                    // if yes, no @rerun file will be generated
                    console.info('No more scenarios to run')
                    return
                } else {
                    // if more lines, remove the line to generate the @rerun file to rerun the text
                    data = lines.slice(1).join('\n')
                }
            } else {
                // remove the first scenario
                let featureName = lineInfo[0]
                let scenarios = lineInfo.slice(2).join(':')
                // update the first line
                lines[0] = `${featureName}:${scenarios}`
                data = lines.join('\n')
            }
            // write the @rerun text file for the next run
            fs.writeFileSync(rerunFile, data, 'utf8')
            try {
                execSync(`yarn testRerun`, { stdio: 'inherit', encoding: 'utf-8' });
                await sleep(3000);           
            } catch (e) {
                console.log('test failed')
            }
            // increasing count
            count++
        }
    }
}
function mergeRallyReports () {
    const resultReportFolder = 'reports/rallyReport';
    let mergedReports = [];

    fs.readdirSync(resultReportFolder).forEach(async reportName => {
        if (reportName === "execReport.json") {
            return
        }
        console.info(`Merging report ${reportName}`);
        let resultReport = `./${resultReportFolder}/${reportName}`;
        let reportData = require(resultReport)
        reportData.forEach((feature) => {

            let originalScenarios = [...feature.elements];
            let updatedScenarios = [];

            //return: passed, failed, skipped
            let getScenarioStatus = function (steps) {
                if (steps.length === 0) {
                    return "failed"
                }
                let result = steps[0].result.status;
                if (result === "failed" || result === "skipped") {
                    return result
                }
                steps.forEach((step) => {
                    if (step.result.status === "failed") {
                        result = "failed"
                    }
                })
                return result;
            }

            originalScenarios.forEach((scenario)=> {
                if (getScenarioStatus(scenario.steps) !== 'skipped') {
                    updatedScenarios.push(scenario)
                    console.log(`pushed scenario ${scenario.name}, the scenario result is ${getScenarioStatus(scenario.steps)}`)
                    feature.elements = updatedScenarios;
                    mergedReports.push(feature)
                }
            })

            feature.elements = updatedScenarios;
            // mergedReports = _.unionBy([feature],mergedReports,(feature)=> {return feature.elements})
            
        })
    });

    try {
        fs.unlinkSync(`${resultReportFolder}/execReport.json`);
    } catch (err) {
  
    }
    fs.appendFileSync(`${resultReportFolder}/execReport.json`, JSON.stringify(mergedReports, null, 2), 'UTF-8');

}
(async () => {
    // await testWithRerun()
    mergeRallyReports();
})()
