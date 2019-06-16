module.exports = function e2eResultsParser({ file, resultMap }) {
  return new Promise((fulfill, reject) => {
    try {
      let tc_verdict;
      let testCaseDuration = 0;
      let tc_details = 'STEPS IN TEST CASE: \n';

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

          //get test case description. description = test case id + name
          let testcaseDescription = scenarios.name;

          let statusResult = true;
          //get count of steps in the cucumber.json file
          let stepCount = Object.keys(scenarios.steps).length;

          //iterate through steps to get the pass/fail status of each step
          for (let k = 0; k < stepCount; k++) {
            let steps = scenarios.steps[k];
            let testCaseStatus = steps.result.status;
            testCaseDuration = testCaseDuration + steps.result.duration;
            tc_details = tc_details + '\n' + steps.name;
            //check the status of each step
            if (testCaseStatus === 'passed') {
              status = true;
            } else {
              status = false;
            }
            //Use AND operator to determine pass/fail of scenario based on all the steps
            statusResult = status && statusResult;
          }

          if (testcaseDescription.includes('[')) {
            //split the test case descriptio using '[' as a delimiter to get the test case id
            testCaseId = (((testcaseDescription.split('['))[1]).split(']'))[0];
            if (statusResult === true) {
              tc_verdict = 'Pass';
            } else if (statusResult === false) {
              tc_verdict = 'Fail';
            } else {
              tc_verdict = 'Blocked';
            }

            //add test case id and verdict to map to consume in updateE2EResultsToRally.js file
            if (!resultMap.has(testCaseId)) {
              resultMap.set(testCaseId, { verdict: tc_verdict, duration: testCaseDuration, description: testcaseDescription, details: tc_details });
            } else if (resultMap.get(testCaseId) !== 'Pass') {
              resultMap.delete(testCaseId);
              resultMap.set(testCaseId, { verdict: tc_verdict, duration: testCaseDuration, description: testcaseDescription, details: tc_details });
            }
          }
        }
      }
      fulfill(resultMap);
    } catch (err) {
      reject(err);
    }
  });
};