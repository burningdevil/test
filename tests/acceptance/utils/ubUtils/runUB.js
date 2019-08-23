let {generateUBReports, countSuccessfulReports} = require("./ubDataParser.js");
let {getAverage, clearExistingReports} = require("./averageUBCalculator.js");

clearExistingReports();

//run "protractor conf.js --enableUB=true --ubReportAddress=xxx" in the cmd for 5 times;
const execSync = require('child_process').execSync;

let output;
let count = countSuccessfulReports();
let error = 0;
//1. count: UB tests will be run for {count} times. You can adjust this to a big number and use it in the stability test, or just for making the result more acurate to reflect the average.
//2. error: in the end, error will be used to calculate the error ratio during the UB test. However, error should not increase without a limit. Here, the UB test will fail if error is encountered more than 5 times.
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

