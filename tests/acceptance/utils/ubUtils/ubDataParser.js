const fs = require('fs');

function generateUBReports(rawUBReportFolder) {

  fs.readdirSync(rawUBReportFolder).forEach(file => {
      if (file.endsWith(".json")) {
          
        console.info(`parsing ${rawUBReportFolder}${file}`);
        parseRawUBData(`../../reports/raw/${file}`);
      }
  });

}

function parseRawUBData (rawUBDataPath) {
  let report = require(rawUBDataPath);
  let workstationDataList = report[0].workstation;
  let workstationHelperList = report[0].workstation_helper;
  
  
  let workstationResult = parseWorkstationList(workstationDataList);
  // console.log(workstationResult);
  
  let workstationHelpersResult = parseWorkstationHelpersList(workstationHelperList);
  // console.log(workstationHelpersResult);

  let rawReportName = rawUBDataPath.slice(rawUBDataPath.lastIndexOf("/") + 1);
  let upReportPath = `./reports/ubIndividual/UB${rawReportName}`;
  
  try {
      fs.unlinkSync(upReportPath);
  } catch (err) {
      console.error(`${upReportPath} did not exist`);
  }
  
  console.info(`generating ${upReportPath}`);
  fs.appendFileSync(upReportPath, JSON.stringify({workstation: workstationResult, workstationHelpers: workstationHelpersResult}, null, 2), 'UTF-8');
  
}

function parseWorkstationList(dataList) {
  
  let result = [];

  let patternMap = new Map();
  let pid = getPID(dataList);

  for (element of dataList) {

    //I am constructing a string here because javascript map has a weired behavior: using object as the key will always treat the object to be not identical. 
    let patternKey = `{"feature": "${element.feature}", "scenario": "${element.scenario}", "pattern": "${element.pattern}", "patternID": "${element.patternID}", "source":"${element.source}"}`;

    if (!patternMap.has(patternKey)) {
      patternMap.set(patternKey, []);
    }

    patternMap.get(patternKey).push(element[pid]);
  }

  for (let key of patternMap.keys()) {

    let keyObj = JSON.parse(key);

    let valueList = patternMap.get(key);
    let length = valueList.length;
    let duration = valueList[length - 1].timestamp - valueList[0].timestamp;
    let maxCPU = valueList[0].cpu;
    let sumCPU = 0;
    let maxMemory = valueList[0].memory;
    let sumMemory = 0;

    for (let value of valueList){
      if (value.cpu > maxCPU) {
        maxCPU = value.cpu;
      }
      if (value.memory > maxMemory) {
        maxMemory = value.memory;
      }
      sumCPU += value.cpu;
      sumMemory += value.memory;      
    }

    let ubElement = {
      feature: keyObj.feature,
      scenario: keyObj.scenario,
      pattern: keyObj.pattern,
      patternID: keyObj.patternID,
      source: keyObj.source,
      maxCPU: maxCPU,
      avgCPU: sumCPU/length,
      maxMemory: maxMemory,
      avgMemory: sumMemory/length,
      duration: duration,
    }

    result.push(ubElement);
  } 
  return result;
}

function parseWorkstationHelpersList(dataList) {
  let result = [];

  let patternMap = new Map();
  let pidList = getPIDList(dataList);

  for (element of dataList) {

    //I am constructing a string here because javascript map has a weired behavior: using object as the key will always treat the object to be not identical. 
    let patternKey = `{"feature": "${element.feature}", "scenario": "${element.scenario}", "pattern": "${element.pattern}", "patternID": "${element.patternID}", "source":"${element.source}"}`;

    if (!patternMap.has(patternKey)) {
      let pidDataMap = {};
      for (pid of pidList) {
        pidDataMap[pid] = [];
      }
      patternMap.set(patternKey, pidDataMap);
    }
    for (pid of pidList) {
      patternMap.get(patternKey)[pid].push(element[pid]);
    }
  }

  for (let key of patternMap.keys()) {

    let keyObj = JSON.parse(key);

    let pidValueList = patternMap.get(key);
    
    //duration
    let valueListLength = pidValueList[pidList[0]].length;
    let duration = pidValueList[pidList[0]][valueListLength - 1].timestamp - pidValueList[pidList[0]][0].timestamp;

    //CPU and Memory: first get max CPU and Memory of each helper, then calculate the average.
    let cpuSum = 0;
    let memorySum = 0;

    for (pid of pidList) {
      let valueList = pidValueList[pid];

      let maxCPU = valueList[0].cpu;
      let maxMemory = valueList[0].memory;

      for (value of valueList) {

        if (maxCPU < value.cpu) {
          maxCPU = value.cpu;
        }

        if (maxMemory < value.memory) {
          maxMemory = value.memory;
        }

      }
      cpuSum += maxCPU;
      memorySum += maxMemory;
    }

    let ubElement = {
      feature: keyObj.feature,
      scenario: keyObj.scenario,
      pattern: keyObj.pattern,
      patternID: keyObj.patternID,
      source: keyObj.source,
      cpu: cpuSum/pidList.length,
      memory: memorySum/pidList.length,
      duration: duration,
    }
    result.push(ubElement);
  } 
  return result;
}

function getPID(list) {
  let keys = Object.keys(list[0]);
  return keys[0];
}

function getPIDList(list) {
  let keys = Object.keys(list[0]);
  let result = [];
  for (key in keys) {
    //PID is a number, so if it the key matches /^[0-9]*$/, it should be a PID
    if(/^[0-9]*$/.test(keys[key])){
      result.push(keys[key]);
    }
  }
  return result;
}

function countSuccessfulReports() {
  let count = 0;

  fs.readdirSync("./reports/raw/").forEach(file => {
      if (file.endsWith(".json")) {
          count++;
      }
  });

  return count;
}

module.exports = {
  generateUBReports: generateUBReports,
  countSuccessfulReports: countSuccessfulReports
}