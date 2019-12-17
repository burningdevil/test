const e2eResultsParser = require('./e2eResultsParser');
const getRallyTCUrl = require('./getRallyTCUrl');
const updateRallyTCResult = require('./updateRallyTCResult');
const createDefect = require('./createDefect');
const fs = require('fs');
const path = require('path');
const cmd = process.argv[2];
let build;
let release;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


const helpMsg = 'Cannot accept the parameters. Usage: \n\n' +
    'node rally/updateE2EResultsToRally.js -c <production_release> <build#> \n' +
    'e.g. node rally/updateE2EResultsToRally.js -c 11.2_EA_[2019-Jun-21] 11.2.0000.0073';

if (cmd === '-c' && process.argv[3] && process.argv[4]) {
    release = process.argv[3].replace(/_/g, ' ');
    console.log(`release: ${release}`);
    build = process.argv[4];
    console.log(`build: ${build}`);
} else {
    console.info(helpMsg);
    process.exit();
}

async function updateRally() {
    try{
        for await (let [testCaseId, value] of resultMap) {
            let {verdict, duration, description, details} = value;

            console.info(`Test Case ID: ${testCaseId}, result: ${JSON.stringify(verdict)}, duration: ${JSON.stringify(duration)}, description: ${JSON.stringify(description)}`);

            const tcUrl = await getRallyTCUrl(testCaseId);

            if (verdict === 'Fail') {
                await createDefect({ tcUrl, description, details, release, build });
            }
            await updateRallyTCResult({ testCaseId, tcUrl, verdict, duration, release, build });
            await sleep(2000);
        }
    }
    catch(err){
        console.error('Error: '+err);
    };
}

const resultMap = new Map();
const resultReport = '../reports/rallyReport/execReport.json'
if (fs.existsSync(resultReport)) {
    let filePath = path.resolve(resultReport);
    console.info(`Start analyzing file: ${filePath}`);
    let file = JSON.parse(fs.readFileSync(filePath));
    e2eResultsParser({ file, resultMap });
    console.info(`Complete analyzing file: ${filePath}`);

    await updateRally();
}
else{
    console.log('No output report file exists in specified path: '+filePath);
}


