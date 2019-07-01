let {generateUBReports} = require("./ubDataParser.js");
let getAverage = require("./averageUBCalculator.js");

//run "protractor conf.js --enableUB=true --ubReportAddress=xxx" in the cmd for 5 times;
const execSync = require('child_process').execSync;
// import { execSync } from 'child_process';  // replace ^ if using ES modules
// let output = execSync('yarn test --params.ubReportAddress ./reports/raw/report1.json', { encoding: 'utf-8' });  // the default is 'buffer'
// console.log('Output was:\n', output);

// output = execSync('yarn test --params.ubReportAddress ./reports/raw/report2.json', { encoding: 'utf-8' });  // the default is 'buffer'
// console.log('Output was:\n', output);
let output;
for (let i = 1; i <= 5; i++) {
    output = execSync(`yarn test --params.ubReportAddress ./reports/raw/report${i}.json`, { encoding: 'utf-8' });  // the default is 'buffer'
    console.log('Output was:\n', output);
}

// output = execSync('yarn test --params.ubReportAddress ./reports/raw/report3.json', { encoding: 'utf-8' });  // the default is 'buffer'
// console.log('Output was:\n', output);

//generate individual ub reports.
let rawUBFolder = "./reports/raw/";
generateUBReports(rawUBFolder);

//calculate average for all individual ub reports.
let individualUBFolder = "./reports/ubIndividual/";
getAverage(individualUBFolder);

