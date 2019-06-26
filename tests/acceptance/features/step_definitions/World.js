let { setWorldConstructor } = require('cucumber');
let {After, Before} = require('cucumber');
let { setDefinitionFunctionWrapper } = require('cucumber');

import { UB_INTERVAL } from '../../utils/envUtils/constants';


let wsUBData = [];
let wsHelperData = [];


//in Before, it will become: {featureName: xxx feature, scenarioName: xxx scenario}
let featureDescriptions = {};

let patternID = 0;

// Wrap around each step
setDefinitionFunctionWrapper(function (fn, opts, pattern) {
  return async function() {
    
    await console.log('before: ');

    if (pattern) {
      await console.log("pattern: " + pattern);
      await console.log("patternID: " + patternID);
      await patternID++;
    }
  
    let workstationPidList = global.workstationPidLists.workstationPidList;
    let workstationHelperPidList = global.workstationPidLists.workstationHelperPidList;
    let pidusage = require('pidusage');
    let counter;

    if (browser.params.enableUB === 'true') {
      pidusage(workstationPidList, function (err, stats) {  
        if (stats) {

          stats.feature = featureDescriptions.featureName;
          stats.scenario= featureDescriptions.scenarioName;
          stats.pattern = pattern;
          stats.patternID = patternID;

          stats.source = "Workstation";
          
          wsUBData.push(stats);
        } else {
          console.log("no status");
          wsUBData.push({"pattern" : pattern});
        }
      });
      counter = await setInterval(function () {
        pidusage(workstationPidList, function (err, stats) {  
          if (stats) {

            stats.feature = featureDescriptions.featureName;
            stats.scenario= featureDescriptions.scenarioName;
            stats.pattern = pattern;
            stats.patternID = patternID;

            stats.source = "Workstation";
            
            wsUBData.push(stats);
          } else {
            console.log("no status");
            wsUBData.push({"pattern" : pattern});
          }
          // console.log(stats)
          // => {
          //   cpu: 10.0,            // percentage (from 0 to 100*vcore)
          //   memory: 357306368,    // bytes
          //   ppid: 312,            // PPID
          //   pid: 727,             // PID
          //   ctime: 867000,        // ms user + system time
          //   elapsed: 6650000,     // ms since the start of the process
          //   timestamp: 864000000  // ms since epoch
          // }
        });
        pidusage(workstationHelperPidList, function (err, stats) {  
          if (stats) {

            stats.feature = featureDescriptions.featureName;
            stats.scenario= featureDescriptions.scenarioName;
            stats.pattern = pattern;
            stats.patternID = patternID;

            stats.source = "Workstation Helper";

            wsHelperData.push(stats);
          } else {
            wsHelperData.push({"pattern" : pattern});
          }
        });
      }, this.ubInterval);
    }
    
    try {
      await fn.apply(this, arguments);
    } catch (e) {
      console.info(e);
      //This is the place that we should add screenshots
      throw new Error('error happened in the function wrapper');
    } finally {
      if (counter) {
        await clearInterval(counter);
      }
    }

    await console.info('after');
  };
});



function CustomWorld() {
  console.log("Setting Cucumber World");
  this.ubInterval = UB_INTERVAL;
  console.log("this.ubInterval is:" + this.ubInterval);

}

Before(async function (scenarioResult) {
  patternID = 0;

  // console.log("hehehe" + scenarioResult);

  // console.log("Start logging scenario");

  // console.log("Feature is: " +  scenarioResult.scenario.feature.name);
  featureDescriptions.featureName = scenarioResult.scenario.feature.name;

  // console.log("Scenario is " + scenarioResult.scenario.name);
  featureDescriptions.scenarioName = scenarioResult.scenario.name;
  // console.log("End logging scenario");
  
});


After(async function () {

  patternID = 0;
  global.ubData.push({
    workstation : wsUBData,
    workstation_helper: wsHelperData
  });
  
});




setWorldConstructor(CustomWorld);