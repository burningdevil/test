const { setWorldConstructor } = require('cucumber')
const { After, Before } = require('cucumber')
const { setDefinitionFunctionWrapper } = require('cucumber')

const UB_INTERVAL = customArgObj.args.ubConf.ubInterval
const { enableUB } = customArgObj.args.ubConf

const wsUBData = []
const wsHelperData = []

// in Before, it will become: {featureName: xxx feature, scenarioName: xxx scenario}
const featureDescriptions = {}

let patternID = 1
let patternAndID

// Wrap around each step
setDefinitionFunctionWrapper(function (fn, opts, pattern) {
  return async function() {
    patternAndID = {
      pattern: pattern,
      patternID: patternID
    }

    let workstationPidList
    let workstationHelperPidList
    let pidusage
    let clearUBMonitor

    // if UB monitor is enabled, workstationPidLists will be defined in global
    if (typeof workstationPidLists !== 'undefined') {
      workstationPidList = workstationPidLists.workstationPidList
      workstationHelperPidList = workstationPidLists.workstationHelperPidList
      pidusage = require('pidusage')
    }

    // This one time capturing makes sure that for each of the cucumber step, there is at least one UB data element.
    if (enableUB) {
      pidusage(workstationPidList, function (err, stats) {
        if (err) {
          console.log(err)
          return
        }
        if (stats && pattern) {
          stats.feature = featureDescriptions.featureName
          stats.scenario = featureDescriptions.scenarioName
          stats.pattern = pattern
          stats.patternID = patternID

          stats.source = 'Workstation'

          wsUBData.push(stats)
        }
      })

      pidusage(workstationHelperPidList, function (err, stats) {
        if (err) {
          console.log(err)
          return
        }
        if (stats && pattern) {
          stats.feature = featureDescriptions.featureName
          stats.scenario = featureDescriptions.scenarioName
          stats.pattern = pattern
          stats.patternID = patternID

          stats.source = 'Workstation Helper'

          wsHelperData.push(stats)
        }
      })

      const setIntervalSynchronous = function (func, delay) {
        let timeoutId
        // Call to clear the interval.
        const clear = function () {
          clearTimeout(timeoutId)
        }
        const intervalFunction = function () {
          func()
          timeoutId = setTimeout(intervalFunction, delay)
        }
        // Delay start.
        timeoutId = setTimeout(intervalFunction, delay)
        // You should capture the returned function for clearing.
        return clear
      }

      clearUBMonitor = setIntervalSynchronous(function () {
        pidusage(workstationPidList, function (err, stats) {
          if (err) {
            console.log(err)
            return
          }
          if (stats && patternAndID.pattern) {
            stats.feature = featureDescriptions.featureName
            stats.scenario = featureDescriptions.scenarioName
            stats.pattern = patternAndID.pattern
            stats.patternID = patternAndID.patternID

            stats.source = 'Workstation'

            wsUBData.push(stats)
          }
        })
        pidusage(workstationHelperPidList, function (err, stats) {
          if (err) {
            console.log(err)
            return
          }
          if (stats && patternAndID.pattern) {
            stats.feature = featureDescriptions.featureName
            stats.scenario = featureDescriptions.scenarioName
            stats.pattern = patternAndID.pattern
            stats.patternID = patternAndID.patternID

            stats.source = 'Workstation Helper'

            wsHelperData.push(stats)
          }
        })
      }, this.ubInterval)
    }

    try {
      await fn.apply(this, arguments)
      if (enableUB) {
        clearUBMonitor()
      }
    } catch (e) {
      console.info(e)
      // This is the place that we should add screenshots
      throw new Error('error happened in the function wrapper')
    } finally {
      if (enableUB) {
        clearUBMonitor()
      }
    }

    if (pattern) {
      patternID++
      patternAndID.pattern = pattern
      patternAndID.patternID = patternID
    }
  }
})

function CustomWorld() {
  this.ubInterval = UB_INTERVAL
}

Before(async function (scenarioResult) {
  patternID = 1
  featureDescriptions.featureName = scenarioResult.sourceLocation.uri.split('/')[1]
  // console.log(`Feature is: ${featureDescriptions.featureName}`);

  featureDescriptions.scenarioName = scenarioResult.pickle.name
  // console.log(`Scenario is ${featureDescriptions.scenarioName}`);
})

After(async function () {
  if (enableUB) {
    // ubData is defined in global
    ubData.push({
      workstation : wsUBData,
      workstationHelper: wsHelperData
    })
  }
})

setWorldConstructor(CustomWorld)
