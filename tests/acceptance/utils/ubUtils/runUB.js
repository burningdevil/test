let {generateUBReports} = require("./ubDataParser.js");
let getAverage = require("./averageUBCalculator.js");

//run "protractor conf.js --enableUB=true --ubReportAddress=xxx" in the cmd for 5 times;
const execSync = require('child_process').execSync;

let output;
for (let i = 1; i <= 5; i++) {
    output = execSync(`yarn test --params.ubReportAddress ./reports/raw/report${i}.json`, { encoding: 'utf-8' });  // the default is 'buffer'
    console.log(`Output for the ${i}st round is: ${output}`);
}

//generate individual ub reports.
let rawUBFolder = "./reports/raw/";
generateUBReports(rawUBFolder);

//calculate average for all individual ub reports.
let individualUBFolder = "./reports/ubIndividual/";
getAverage(individualUBFolder);

