const fs = require('fs')

function getAverage(individualUBFolder) {
  const reports = collectIndividualUBReports(individualUBFolder)
  generateAverageReport(reports)
}

function collectIndividualUBReports(individualUBFolder) {
  const reports = []

  fs.readdirSync(individualUBFolder).forEach(file => {
    if (file.endsWith('.json')) {
      const report = require(`../.${individualUBFolder}${file}`)
      reports.push(report)
    }
  })

  return reports
}

function generateAverageReport(reports) {
  const workstationAverageReport = getWorkstationAverageReport(reports)
  const workstationHelpersAverageReport = getWorkstationHelpersAverageReport(
    reports
  )

  const averageReport = {
    workstation: workstationAverageReport,
    workstationHelpers: workstationHelpersAverageReport
  }

  const ubReportAddress = './reports/ubAverage.json'

  try {
    fs.unlinkSync(ubReportAddress)
  } catch (err) {}
  console.info(`generating ${ubReportAddress}`)
  fs.appendFileSync(
    ubReportAddress,
    JSON.stringify(averageReport, null, 2),
    'UTF-8'
  )
}

function getWorkstationAverageReport(reports) {
  // The array of elements that contain workstation ub data
  const workstationAverageReport = []

  const workstationValueList = []

  for (const element of reports) {
    workstationValueList.push(element.workstation)
  }

  const workstationMap = new Map()

  for (const singleRunList of workstationValueList) {
    for (const element of singleRunList) {
      // constructing a string since javascript will treat objects as not identical
      const key = `{
        "feature" : "${element.feature}","scenario" : "${element.scenario}", 
        "pattern" : "${element.pattern}", "patternID" : "${element.patternID}", 
        "source" : "${element.source}" 
      }`
      if (!workstationMap.get(key)) {
        workstationMap.set(key, [])
      }
      const value = {
        maxCPU: element.maxCPU,
        avgCPU: element.avgCPU,
        maxMemory: element.maxMemory,
        avgMemory: element.avgMemory,
        duration: element.duration
      }
      workstationMap.get(key).push(value)
    }
  }

  for (const key of workstationMap.keys()) {
    const keyObj = JSON.parse(key)

    const average = getWorkstationAverage(workstationMap.get(key))

    workstationAverageReport.push({ ...keyObj, ...average })
  }

  function getWorkstationAverage(list) {
    const length = list.length
    let maxCPUSum = 0
    let avgCPUSum = 0
    let maxMemorySum = 0
    let avgMemorySum = 0
    let durationSum = 0
    for (const element of list) {
      maxCPUSum += element.maxCPU
      avgCPUSum += element.avgCPU
      maxMemorySum += element.maxMemory
      avgMemorySum += element.avgMemory
      durationSum += element.duration
    }
    const result = {
      maxCPU: maxCPUSum / length,
      avgCPU: avgCPUSum / length,
      maxMemory: maxMemorySum / length,
      avgMemory: avgMemorySum / length,
      duration: durationSum / length
    }
    return result
  }

  return workstationAverageReport
}

function getWorkstationHelpersAverageReport(reports) {
  // The array of elements that contain workstation ub data
  const workstationHelpersAverageReport = []

  const workstationHelpersValueList = []

  for (const element of reports) {
    workstationHelpersValueList.push(element.workstationHelpers)
  }

  const workstationHelpersMap = new Map()

  for (const singleRunList of workstationHelpersValueList) {
    for (const element of singleRunList) {
      // constructing a string since javascript will treat objects as not identical
      const key = `{
        "feature" : "${element.feature}","scenario" : "${element.scenario}", 
        "pattern" : "${element.pattern}", "patternID" : "${element.patternID}", 
        "source" : "${element.source}" }`
      if (!workstationHelpersMap.get(key)) {
        workstationHelpersMap.set(key, [])
      }
      const value = {
        cpu: element.cpu,
        memory: element.memory,
        duration: element.duration
      }
      workstationHelpersMap.get(key).push(value)
    }
  }

  for (const key of workstationHelpersMap.keys()) {
    const keyObj = JSON.parse(key)

    const average = getWorkstationHelpersAverage(workstationHelpersMap.get(key))

    workstationHelpersAverageReport.push({ ...keyObj, ...average })
  }

  function getWorkstationHelpersAverage(list) {
    const length = list.length
    let cpuSum = 0
    let memorySum = 0
    let durationSum = 0
    for (const element of list) {
      cpuSum += element.cpu
      memorySum += element.memory
      durationSum += element.duration
    }
    const result = {
      cpu: cpuSum / length,
      memory: memorySum / length,
      duration: durationSum / length
    }
    return result
  }

  return workstationHelpersAverageReport
}

function clearExistingReports() {
  console.log('clearing existing reports')

  fs.readdirSync('./reports/ubIndividual/').forEach(file => {
    if (file.endsWith('.json')) {
      try {
        fs.unlinkSync(`./reports/ubIndividual/${file}`)
      } catch (err) {
        console.info(`Couldn't remove ${file}, maybe it did not exist`)
        console.log(err)
      }
    }
  })

  fs.readdirSync('./reports/raw/').forEach(file => {
    if (file.endsWith('.json')) {
      try {
        fs.unlinkSync(`./reports/raw/${file}`)
      } catch (err) {
        console.info(`Couldn't remove ${file}, maybe it did not exist`)
        console.log(err)
      }
    }
  })
}

module.exports = {
  getAverage,
  clearExistingReports
}
