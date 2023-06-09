# Performance Test
This document introduces how to use the UB monitor to generate an UB report. 

## How to use
To run 5 rounds automatically and generate the average UB report: in terminal, run
```
yarn ubTest
```

To run a single round test case and get raw ub report:  
```
yarn test --args.ubConf.enableUB true
```
After the automation process, report1.json will be generated under ./reports/raw/. 

If you wish to specify the raw report's name, you can also achieve this by running 
```
yarn test --args.ubConf.enableUB true --args.ubConf.ubReportPath ./reports/raw/yourOwnReportName.json
```

To parse the raw reports from the ./reports/raw/ folder and generate single-run UB reports, use the following code snippet to help:
```javascript
let {generateUBReports} = require("./ubDataParser.js");
let rawUBFolder = "./reports/raw/";
generateUBReports(rawUBFolder);
```
This will generate UBreports under the ./reports/ubIndevidual/ folder.

To calculate the average for all single-run UB reports, use the following code snippet:
```javascript
let getAverage = require("./averageUBCalculator.js");
let individualUBFolder = "./reports/ubIndividual/";
getAverage(individualUBFolder);
```
## Details about how we implemented the UB monitor:
https://microstrategy.atlassian.net/wiki/spaces/TTWF/pages/741705788/UB+for+application+level+tests
## Details about how we get the raw ub data and calculate UB reports based on the raw data. 
https://microstrategy.atlassian.net/wiki/spaces/TTWF/pages/775160964/Workstation+E2E+Automation



