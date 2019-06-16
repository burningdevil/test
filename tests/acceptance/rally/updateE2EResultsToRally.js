const e2eResultsParser = require('./e2eResultsParser');
const getRallyTCUrl = require('./getRallyTCUrl');
const updateRallyTCResult = require('./updateRallyTCResult');
const createDefect = require('./createDefect');
const fs = require('fs');
const path = require('path');
const cmd = process.argv[2];
let build;
let release;

const helpMsg = 'Cannot accept the parameters. Usage: \n\n' +
    'node pages/rally/updateE2EResultsToRally.js -c <production_release> <build#> \n' +
    'e.g. node pages/rally/updateE2EResultsToRally.js -c 11.2_EA_[2019-Jun-21] 11.2.0000.0073';

if (cmd === '-c' && process.argv[3] && process.argv[4]) {
    release = process.argv[3].replace(/_/g, ' ');
    console.log(`release: ${release}`);
    build = process.argv[4];
    console.log(`build: ${build}`);
} else {
    console.info(helpMsg);
    process.exit();
}

const resultMap = new Map();
const resultReport = './Cucumber.json';
if (fs.existsSync(resultReport)) {
    let filePath = path.resolve(resultReport);
    console.info(`Start analyzing file: ${filePath}`);
    file = JSON.parse(fs.readFileSync(filePath));
    e2eResultsParser({ file, resultMap });
    console.info(`Complete analyzing file: ${filePath}`);
}

resultMap.forEach((value, testCaseId) => {
    console.info(`Test Case ID: ${testCaseId}, value: ${JSON.stringify(value)}`);
    let verdict = value.verdict;
    let duration = value.duration;
    let description = value.description;
    let details = value.details;

    getRallyTCUrl(testCaseId).then((tcUrl) => {
        if (verdict === 'Fail') {
            createDefect({ tcUrl, description, details, release, build });
        }
        updateRallyTCResult({ testCaseId, tcUrl, verdict, duration, release, build });
    }).catch((err) => {
        console.error(`Rally Test Case ID is invalid: ${testCaseId}.`);
    });
});