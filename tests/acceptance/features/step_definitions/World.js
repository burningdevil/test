let { setWorldConstructor } = require('cucumber');
let {After, Before} = require('cucumber');
let { setDefinitionFunctionWrapper } = require('cucumber');
let protractorArgs = require("../../protractorArgs.json");

const UB_INTERVAL = protractorArgs.args.ubConf.ubInterval;

let wsUBData = [];
let wsHelperData = [];


//in Before, it will become: {featureName: xxx feature, scenarioName: xxx scenario}
let featureDescriptions = {};

let patternID = 0;

// Wrap around each step
setDefinitionFunctionWrapper(function (fn, opts, pattern) {
  return async function() {

    if (pattern) {
      patternID++;
    }
  
    let workstationPidList;
    let workstationHelperPidList;
    let pidusage;
    let counter;

    //if UB monitor is enabled, workstationPidLists will be defined in global
    if (typeof workstationPidLists !== "undefined") {
      workstationPidList = workstationPidLists.workstationPidList;
      workstationHelperPidList = workstationPidLists.workstationHelperPidList;
      pidusage = require('pidusage');
      counter;
    }

    if (protractorArgs.args.ubConf.enableUB === true) {
      pidusage(workstationPidList, function (err, stats) {  
        if (stats && pattern) {

          stats.feature = featureDescriptions.featureName;
          stats.scenario= featureDescriptions.scenarioName;
          stats.pattern = pattern;
          stats.patternID = patternID;

          stats.source = "Workstation";
          
          wsUBData.push(stats);
        }
      });

      pidusage(workstationHelperPidList, function (err, stats) {  
        if (stats && pattern) {

          stats.feature = featureDescriptions.featureName;
          stats.scenario= featureDescriptions.scenarioName;
          stats.pattern = pattern;
          stats.patternID = patternID;

          stats.source = "Workstation Helper";

          wsHelperData.push(stats);
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
          }
        });
        pidusage(workstationHelperPidList, function (err, stats) {  
          if (stats) {

            stats.feature = featureDescriptions.featureName;
            stats.scenario= featureDescriptions.scenarioName;
            stats.pattern = pattern;
            stats.patternID = patternID;

            stats.source = "Workstation Helper";

            wsHelperData.push(stats);
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
  };
});



function CustomWorld() {

  this.ubInterval = UB_INTERVAL;

}

Before(async function (scenarioResult) {
  patternID = 0;

  // console.log(`Feature is: ${scenarioResult.scenario.feature.name}`);
  featureDescriptions.featureName = scenarioResult.scenario.feature.name;

  // console.log(`Scenario is ${scenarioResult.scenario.name}`);
  featureDescriptions.scenarioName = scenarioResult.scenario.name;
  
});

After(async function () {

  patternID = 0;
  if (protractorArgs.args.ubConf.enableUB === true) {
    //ubData is defined in global
    ubData.push({
      workstation : wsUBData,
      workstation_helper: wsHelperData
    });
  }
  
  
});

setWorldConstructor(CustomWorld);