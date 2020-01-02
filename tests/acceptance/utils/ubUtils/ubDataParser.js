const fs = require('fs')

function generateUBReports(rawUBReportFolder) {
  fs.readdirSync(rawUBReportFolder).forEach(file => {
    if (file.endsWith('.json')) {
      console.info(`parsing ${rawUBReportFolder}${file}`)
      parseRawUBData(`../../reports/raw/${file}`)
    }
  })
}

function parseRawUBData(rawUBDataPath) {
  const report = require(rawUBDataPath)
  const workstationDataList = report[0].workstation
  const workstationHelperList = report[0].workstationHelper

  const workstationResult = parseWorkstationList(workstationDataList)
  // console.log(workstationResult);

  const workstationHelpersResult = parseWorkstationHelpersList(
    workstationHelperList
  )
  // console.log(workstationHelpersResult);

  const rawReportName = rawUBDataPath.slice(rawUBDataPath.lastIndexOf('/') + 1)
  const upReportPath = `./reports/ubIndividual/UB${rawReportName}`

  try {
    fs.unlinkSync(upReportPath)
  } catch (err) {}

  console.info(`generating ${upReportPath}`)
  fs.appendFileSync(
    upReportPath,
    JSON.stringify(
      {
        workstation: workstationResult,
        workstationHelpers: workstationHelpersResult
      },
      null,
      2
    ),
    'UTF-8'
  )
}

function parseWorkstationList(dataList) {
  const result = []

  const patternMap = new Map()
  const pid = getPID(dataList)

  for (const element of dataList) {
    // I am constructing a string here because javascript map has a weired behavior: using object as the key will always treat the object to be not identical.
    const patternKey = `{"feature": "${element.feature}", "scenario": "${element.scenario}", 
    "pattern": "${element.pattern}", "patternID": "${element.patternID}", 
    "source":"${element.source}"}`
    if (!patternMap.has(patternKey)) {
      patternMap.set(patternKey, [])
    }

    patternMap.get(patternKey).push(element[pid])
  }
  for (const key of patternMap.keys()) {
    const keyObj = JSON.parse(key)

    const valueList = patternMap.get(key)
    const length = valueList.length
    const duration = valueList[length - 1].timestamp - valueList[0].timestamp
    let maxCPU = valueList[0].cpu
    let sumCPU = 0
    let maxMemory = valueList[0].memory
    let sumMemory = 0

    for (const value of valueList) {
      if (value.cpu > maxCPU) {
        maxCPU = value.cpu
      }
      if (value.memory > maxMemory) {
        maxMemory = value.memory
      }
      sumCPU += value.cpu
      sumMemory += value.memory
    }

    const ubElement = {
      feature: keyObj.feature,
      scenario: keyObj.scenario,
      pattern: keyObj.pattern,
      patternID: keyObj.patternID,
      source: keyObj.source,
      maxCPU: maxCPU,
      avgCPU: sumCPU / length,
      maxMemory: maxMemory,
      avgMemory: sumMemory / length,
      duration: duration
    }

    result.push(ubElement)
  }
  return result
}

function parseWorkstationHelpersList(dataList) {
  const result = []

  const patternMap = new Map()

  for (const element of dataList) {
    // update the pidList because it may change
    const pidList = getPIDList(element)

    // I am constructing a string here because javascript map has a weired behavior: using object as the key will always treat the object to be not identical.
    const patternKey = `{"feature": "${element.feature}", "scenario": "${element.scenario}", 
    "pattern": "${element.pattern}", "patternID": "${element.patternID}", 
    "source":"${element.source}"}`

    if (!patternMap.has(patternKey)) {
      const pidDataMap = {}
      for (const pid of pidList) {
        pidDataMap[pid] = []
      }
      patternMap.set(patternKey, pidDataMap)
    }
    for (const pid of pidList) {
      patternMap.get(patternKey)[pid].push(element[pid])
    }
  }

  for (const key of patternMap.keys()) {
    const keyObj = JSON.parse(key)

    const pidValueList = patternMap.get(key)

    // recalculate pidList because it may change
    const pidList = getPIDList(pidValueList)

    // duration
    const valueListLength = pidValueList[pidList[0]].length
    const duration =
      pidValueList[pidList[0]][valueListLength - 1].timestamp -
      pidValueList[pidList[0]][0].timestamp

    // CPU and Memory: first get max CPU and Memory of each helper, then calculate the average.
    let cpuSum = 0
    let memorySum = 0

    for (const pid of pidList) {
      const valueList = pidValueList[pid]

      let maxCPU = valueList[0].cpu
      let maxMemory = valueList[0].memory

      for (const value of valueList) {
        if (maxCPU < value.cpu) {
          maxCPU = value.cpu
        }

        if (maxMemory < value.memory) {
          maxMemory = value.memory
        }
      }
      cpuSum += maxCPU
      memorySum += maxMemory
    }

    const ubElement = {
      feature: keyObj.feature,
      scenario: keyObj.scenario,
      pattern: keyObj.pattern,
      patternID: keyObj.patternID,
      source: keyObj.source,
      cpu: cpuSum / pidList.length,
      memory: memorySum / pidList.length,
      duration: duration
    }
    result.push(ubElement)
  }
  return result
}

function getPID(list) {
  const keys = Object.keys(list[0])
  return keys[0]
}

function getPIDList(element) {
  const keys = Object.keys(element)
  const result = []
  for (const key in keys) {
    // PID is a number, so if it the key matches /^[0-9]*$/, it should be a PID
    if (/^[0-9]*$/.test(keys[key])) {
      result.push(keys[key])
    }
  }
  return result
}

function countSuccessfulReports() {
  let count = 0

  fs.readdirSync('./reports/raw/').forEach(file => {
    if (file.endsWith('.json')) {
      count++
    }
  })

  return count
}

module.exports = {
  generateUBReports: generateUBReports,
  countSuccessfulReports: countSuccessfulReports
}
