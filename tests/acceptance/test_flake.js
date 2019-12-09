
const fs = require('fs')
const {execSync} = require('child_process');
const {clearFiles,sleep}  = require('./utils/generalUtils.js')
const _ = require('lodash')

const rerunsFOLDER = './reports/reruns'
const rerunFile = `${rerunsFOLDER}/@rerun.txt`

const reportsFOLDER = './reports/rallyReport'
const reportFile = `${reportsFOLDER}/execReport.json`

function clearExistingReports () {
    clearFiles(rerunsFOLDER, '.txt')
    clearFiles(reportsFOLDER, '.json')
}

async function rerunRestScenarios() {
    let count = 0
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
                return false
            } else {
                // if more lines, remove the line to generate the @rerun file to run the next round of test
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
        } catch (e) {
            await sleep(3000);
            console.log('test failed')
        }

        //increasing count
        count++        
    }

    return true
}

async function rerunFailedScenarios() {
    if (!await rerunRestScenarios()) {
        try {
            //execute the only one failed scenario left
            console.log("Almost there, only one failed scenario is left, still trying...")
            execSync(`yarn testRerun`, { stdio: 'inherit', encoding: 'utf-8' });
        } catch (e) {
            await sleep(3000);
            console.log('test failed')
        }
    }
}

//1. Since we are using "fail-fast" in the cucumberOpts, if one scenario fails, all following scenario will be skipped and marked as fail
//2. We have a rerun.txt file that track all failed scenarios
//3. This function makes sure all skipped scenario are rerun again and get a real status of fail or pass.
async function testWithRerun() {
    // first execution
    try {
        execSync(`yarn test`, { stdio: 'inherit', encoding: 'utf-8' });
    } catch (e) {
        console.info('Test finished with failed scenarios.')
        await sleep(3000);  
        // following execution with rerun txt
        await rerunRestScenarios();
    }
}

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

//For the features list, if the ID of the feature is the same, merge the scenarios(elements) of the feature into one
let mergeScenarios = function(features) {
    let result = []
    let map = new Map();
    features.forEach((feature) => {
        let id = feature.id
        if (!map.has(id)) {
            map.set(id, feature)
        } else {
            //here, each feature contains a single scenario
            map.get(id).elements.push(feature.elements[0])
        }
    })

    for (let feature of map.values()) {
        result.push(feature)
    }
    return result
}

function mergeRallyReports () {
    let updatedFeatures = [];
    fs.readdirSync(reportsFOLDER).forEach(reportName => {
        if (reportName === "execReport.json") {
            return
        }
        console.info(`Merging report ${reportName}`);
        let resultReport = `./${reportsFOLDER}/${reportName}`;
        let reportData = require(resultReport)
        
        reportData.forEach((feature) => {
            feature.elements.forEach((scenario) => {
                //push scenario that is 'passed' and 'failed'
                if (getScenarioStatus(scenario.steps) !== 'skipped') {
                    updatedFeatures.push({...feature,elements:[scenario]})
                }
            })
        })
    });

    let mergedReports = mergeScenarios(updatedFeatures)
    if (mergedReports.length !== 0) {
        try {
            fs.unlinkSync(`${reportsFOLDER}/execReport.json`);
        } catch (err) {
      
        }
        fs.appendFileSync(`${reportsFOLDER}/execReport.json`, JSON.stringify(mergedReports, null, 2), 'UTF-8');
    }
   
}
function generateRerunFileForFailedTests(){

    let featureList = [];

    fs.readdirSync(reportsFOLDER).forEach(reportName => {
        if (reportName === "execReport.json") {
            let resultReport = `./${reportsFOLDER}/${reportName}`;
            let reportData = require(resultReport)
            reportData.forEach((feature) => {
                let featureURI = feature.uri
                let failedScenarioLines = []
                feature.elements.forEach((scenario) => {
                    //push scenario that is 'failed'
                    if (getScenarioStatus(scenario.steps) == 'failed') {
                        failedScenarioLines.push(scenario.line)
                    }
                })
                let lines = _.join(failedScenarioLines, ':')
                featureList.push(`${featureURI}:${lines}`)
            })
        }
    });
    console.log(featureList)
    // write the @rerun text file for the next run
    if (featureList.length !== 0) {
        fs.writeFileSync(rerunFile, _.join(featureList, '\n'), 'utf8')
    }
}
(async () => {
    clearExistingReports();
    await testWithRerun()
    mergeRallyReports();
    generateRerunFileForFailedTests()
    
    let remainingAttempts = 2
    while (fs.existsSync(rerunFile) && remainingAttempts > 0) {
        console.log(`retrying for round ${3 - remainingAttempts}`)
        await rerunFailedScenarios()
        mergeRallyReports();
        generateRerunFileForFailedTests()
        remainingAttempts--
    }
    
})()
