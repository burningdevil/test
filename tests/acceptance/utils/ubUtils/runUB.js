let {generateUBReports, countSuccessfulReports} = require("./ubDataParser.js");
let getAverage = require("./averageUBCalculator.js");

//run "protractor conf.js --enableUB=true --ubReportAddress=xxx" in the cmd for 5 times;
const execSync = require('child_process').execSync;

let output;
let count = countSuccessfulReports();
let error = 0;
while (count <= 2 && error <= 5) {
    try {
        output = execSync(`yarn test --args.ubConf.enableUB true --args.ubConf.ubReportPath ./reports/raw/report${count + 1}.json`, { encoding: 'utf-8' }); 
        console.log(`Output for the ${count + 1}st round is: ${output}`);
    } catch(err) {
        console.log("error rate is increased! Continue running... If error count reaches 5, whole process will stop.")
        console.log(err);
        error++;
    }
    count = countSuccessfulReports();
}

let errorRatio = error/count;
console.log(`error ratio is: ${errorRatio}`)

//generate individual ub reports.
let rawUBFolder = "./reports/raw/";
generateUBReports(rawUBFolder);

//calculate average for all individual ub reports.
let individualUBFolder = "./reports/ubIndividual/";
getAverage(individualUBFolder);

