const { setWorldConstructor } = require('cucumber')
const { After, Before } = require('cucumber')
const { setDefinitionFunctionWrapper } = require('cucumber')
const screenshot = require('screenshot-desktop')
const fs = require('fs')
const { join } = require('path')

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
    } catch (e) {
      const imgBuffer = await screenshot({ format:'png' })
      this.attach(imgBuffer, 'image/png')
      await attachImages('base',arguments[0],this)
      await attachImages('actual',arguments[0],this)
      await attachImages('diff',arguments[0],this)
      throw new Error(`Error happened in the function wrapper: ${e.stack}`)
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

async function attachImages(type,name,step){
  let fileName;
  if(type==='base'){
    fileName = join(process.cwd(), './results/baseline/desktop_chrome/',name+'.png')
  }else if(type==='actual'){
    fileName = join(process.cwd(), './results/actual/desktop_chrome/',name+'.png')
  }else{
    fileName = join(process.cwd(), './results/diff/desktop_chrome/',name+'.png')
  }

  if(fs.existsSync(fileName)){
    //screenshot action and screenshot file exists
    const baseImgBuff = await fs.readFileSync(fileName)
    step.attach(baseImgBuff, 'image/png')
  }

}

function CustomWorld({ attach, parameters }) {
  this.ubInterval = UB_INTERVAL
  this.attach = attach
  this.parameters = parameters
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
