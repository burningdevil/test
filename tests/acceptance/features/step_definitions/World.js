let { setWorldConstructor } = require('cucumber');
let {After, Before} = require('cucumber');
let { setDefinitionFunctionWrapper } = require('cucumber');
let protractorArgs = require("../../protractorArgs.json");

const UB_INTERVAL = protractorArgs.args.ubConf.ubInterval;

let wsUBData = [];
let wsHelperData = [];


//in Before, it will become: {featureName: xxx feature, scenarioName: xxx scenario}
let featureDescriptions = {};

let patternID = 1;
let patternAndID;

// Wrap around each step
setDefinitionFunctionWrapper(function (fn, opts, pattern) {
  return async function() {

    patternAndID = {
      pattern: pattern,
      patternID: patternID
    }
    
  
    let workstationPidList;
    let workstationHelperPidList;
    let pidusage;
    let clearUBMonitor;

    //if UB monitor is enabled, workstationPidLists will be defined in global
    if (typeof workstationPidLists !== "undefined") {
      workstationPidList = workstationPidLists.workstationPidList;
      workstationHelperPidList = workstationPidLists.workstationHelperPidList;
      pidusage = require('pidusage');
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

      let setIntervalSynchronous = function (func, delay) {
        let intervalFunction, timeoutId, clear;
        // Call to clear the interval.
        clear = function () {
          clearTimeout(timeoutId);
        };
        intervalFunction = function () {
          func();
          timeoutId = setTimeout(intervalFunction, delay);
        }
        // Delay start.
        timeoutId = setTimeout(intervalFunction, delay);
        // You should capture the returned function for clearing.
        return clear;
      };

      clearUBMonitor = setIntervalSynchronous(function () {

        pidusage(workstationPidList, function (err, stats) {  
          if (stats && patternAndID.pattern) {

            stats.feature = featureDescriptions.featureName;
            stats.scenario= featureDescriptions.scenarioName;
            stats.pattern = patternAndID.pattern;
            stats.patternID = patternAndID.patternID;

            stats.source = "Workstation";
            
            wsUBData.push(stats);
          }
        });
        pidusage(workstationHelperPidList, function (err, stats) {  
          if (stats && patternAndID.pattern) {

            stats.feature = featureDescriptions.featureName;
            stats.scenario= featureDescriptions.scenarioName;
            stats.pattern = patternAndID.pattern;
            stats.patternID = patternAndID.patternID;

            stats.source = "Workstation Helper";

            wsHelperData.push(stats);
          }
        });
      }, this.ubInterval);

    }
    
    try {
      await fn.apply(this, arguments);
      if (protractorArgs.args.ubConf.enableUB === true) {
        clearUBMonitor();
      }
    } catch (e) {
      console.info(e);
      //This is the place that we should add screenshots
      throw new Error('error happened in the function wrapper');
    } finally {
      if (protractorArgs.args.ubConf.enableUB === true) {
        clearUBMonitor();
      }
    }

    if (pattern) {
      patternID++;
      patternAndID.pattern = pattern;
      patternAndID.patternID = patternID;
    }
  
  };
});



function CustomWorld() {

  this.ubInterval = UB_INTERVAL;

}

Before(async function (scenarioResult) {
  patternID = 1;

  // console.log(`Feature is: ${scenarioResult.scenario.feature.name}`);
  featureDescriptions.featureName = scenarioResult.scenario.feature.name;

  // console.log(`Scenario is ${scenarioResult.scenario.name}`);
  featureDescriptions.scenarioName = scenarioResult.scenario.name;
  
});

After(async function () {

  if (protractorArgs.args.ubConf.enableUB === true) {
    //ubData is defined in global
    ubData.push({
      workstation : wsUBData,
      workstation_helper: wsHelperData
    });
  }
  
  
});

setWorldConstructor(CustomWorld);