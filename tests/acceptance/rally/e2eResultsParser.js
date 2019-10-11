module.exports = function e2eResultsParser({ file, resultMap }) {
  return new Promise((fulfill, reject) => {
    try {
      let tc_verdict;
      let hashMap = new Map();
      let totalScenarioDuration;

      //get count of features in the cucumber.json file
      let featureCount = Object.keys(file).length;

      //iterate through all the features to get scenarios
      for (let i = 0; i < featureCount; i++) {
        //get count of scenarios in the cucumber.json file
        let scenarioCount = Object.keys(file[i].elements).length;

        //iterate through all the scenarios to get steps
        for (let j = 0; j < scenarioCount; j++) {
          //create a scenario variable to reuse
          let scenarios = file[i].elements[j];
          totalScenarioDuration = 0;

          //get test case description. description = test case id + name
          let testcaseDescription = scenarios.name;

          let statusResult = true;

          //get count of steps in the cucumber.json file
          let stepCount = Object.keys(scenarios.steps).length;

          let tc_details = 'Steps to reproduce:\n';

          //iterate through steps to get the pass/fail status of each step
          for (let k = 0; k < stepCount; k++) {
            let steps = scenarios.steps[k];
            let testCaseStatus = steps.result.status;
            totalScenarioDuration = totalScenarioDuration + steps.result.duration;

            //check the status of each step
            if (testCaseStatus === 'passed') {
              status = true;
            } else {
              status = false;
              // console.log('Inside false condition at k='+k);
              tc_details = tc_details + '\n' + steps.name;
            }
            //Use AND operator to determine pass/fail of scenario based on all the steps
            statusResult = status && statusResult;

            //Add to intermediary map to consolidate the scenario outline mutiple run results
            if(!hashMap[testcaseDescription]){
              hashMap[testcaseDescription]={statusResult , totalScenarioDuration, tc_details};
            }
            else{
              let prevRunResult = hashMap[testcaseDescription].statusResult;

              //Conserving the failed steps for a failed run
              let prevDetail = hashMap[testcaseDescription].tc_details;
              statusResult = status && prevRunResult
              if(tc_details==='Steps to reproduce:\n'){
                tc_details = prevDetail;
              }
              hashMap[testcaseDescription]={statusResult , totalScenarioDuration, tc_details};
            }
          }
        }
      }
      for(let testcaseDescription in hashMap){
        if (testcaseDescription.includes('[')) {
            //split the test case descriptio using '[' as a delimiter to get the test case id
            testCaseId = (((testcaseDescription.split('['))[1]).split(']'))[0];
            let tcResult = hashMap[testcaseDescription].statusResult;
            if (tcResult) {
              tc_verdict = 'Pass';
            } else if (tcResult === false) {
              tc_verdict = 'Fail';
            } else {
              tc_verdict = 'Blocked';
            }
            //add test case id and verdict to map to consume in updateE2EResultsToRally.js file
            resultMap.set(testCaseId,
            {
              verdict: tc_verdict,
              duration: (hashMap[testcaseDescription].totalScenarioDuration/1000).toFixed(2),
              description: testcaseDescription, details: hashMap[testcaseDescription].tc_details
            });
          }
      }
      fulfill(resultMap);
    } catch (err) {
      reject(err);
    }
  });
};