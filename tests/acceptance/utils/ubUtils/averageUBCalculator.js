let report1 = require("../../reports/ubIndividual/ubReport1.json");
let report2 = require("../../reports/ubIndividual/ubReport2.json");
let report3 = require("../../reports/ubIndividual/ubReport3.json");
let report4 = require("../../reports/ubIndividual/ubReport4.json");
let report5 = require("../../reports/ubIndividual/ubReport5.json");

let reports = [];
reports.push(report1);
reports.push(report2);
reports.push(report3);
reports.push(report4);
reports.push(report5);

let workstationAverageReport = getWorkstationAverageReport(reports);
let workstationHelpersAverageReport = getWorkstationHelpersAverageReport(reports);

let averageReport = {workstation: workstationAverageReport, workstationHelpers: workstationHelpersAverageReport};

let upReportAddress = "./reports/ubAverage.json";
let fs = require('fs');
try {
    fs.unlinkSync(upReportAddress, (err) => {
    if (err) {
        console.error("no such file");
    } else {
        console.info(`${upReportAddress} was deleted`);
    }
    });
} catch (err) {
    console.error(`${upReportAddress} did not exist`);
}

console.info(`generating ${upReportAddress}`);
fs.appendFileSync(upReportAddress, JSON.stringify(averageReport, null, 2), 'UTF-8');



function getWorkstationAverageReport(reports) {

    //The array of elements that contain workstation ub data
    let workstationAverageReport = [];

    let workstationValueList = [];

    for (element of reports) {
        workstationValueList.push(element.workstation);
    }

    let workstationMap = new Map();

    for(singleRunList of workstationValueList) {

        for (element of singleRunList) {
            //constructing a string since javascript will treat objects as not identical
            let key = `{"feature" : "${element.feature}","scenario" : "${element.scenario}", "pattern" : "${element.pattern}", "patternID" : "${element.patternID}", "source" : "${element.source}" }`;
            if (!workstationMap.get(key)) {
                workstationMap.set(key, []);
            }
            let value = {
                maxCPU: element.maxCPU,
                avgCPU: element.avgCPU,
                maxMemory: element.maxMemory,
                avgMemory: element.avgMemory,
                duration: element.duration
            }
            workstationMap.get(key).push(value)
        }
    }

    for (let key of workstationMap.keys()) {

        let keyObj = JSON.parse(key);
        
        let average = getWorkstationAverage(workstationMap.get(key));

        workstationAverageReport.push({...keyObj,...average});

    }

    function getWorkstationAverage(list) {
        let length = list.length;
        let maxCPUSum = 0;
        let avgCPUSum = 0;
        let maxMemorySum = 0;
        let avgMemorySum = 0;
        let durationSum = 0;
        for (element of list) {
            maxCPUSum += element.maxCPU;
            avgCPUSum += element.avgCPU;
            maxMemorySum += element.maxMemory;
            avgMemorySum += element.avgMemory;
            durationSum += element.duration;
        }
        let result = {
            maxCPU: maxCPUSum/length,
            avgCPU: avgCPUSum/length,
            maxMemory: maxMemorySum/length,
            avgMemory: avgMemorySum/length,
            duration: durationSum/length,
        }
        return result;
    }

    return workstationAverageReport;

}

function getWorkstationHelpersAverageReport(reports) {

    //The array of elements that contain workstation ub data
    let workstationHelpersAverageReport = [];

    let workstationHelpersValueList = [];

    for (element of reports) {
        workstationHelpersValueList.push(element.workstationHelpers);
    }

    let workstationHelpersMap = new Map();

    for(singleRunList of workstationHelpersValueList) {

        for (element of singleRunList) {
            //constructing a string since javascript will treat objects as not identical
            let key = `{"feature" : "${element.feature}","scenario" : "${element.scenario}", "pattern" : "${element.pattern}", "patternID" : "${element.patternID}", "source" : "${element.source}" }`;
            if (!workstationHelpersMap.get(key)) {
                workstationHelpersMap.set(key, []);
            }
            let value = {
                cpu: element.cpu,
                memory: element.memory,
                duration: element.duration
            }
            workstationHelpersMap.get(key).push(value)
        }
    }

    for (let key of workstationHelpersMap.keys()) {

        let keyObj = JSON.parse(key);
        
        let average = getWorkstationHelpersAverage(workstationHelpersMap.get(key));

        workstationHelpersAverageReport.push({...keyObj,...average});

    }

    function getWorkstationHelpersAverage(list) {
        let length = list.length;
        let cpuSum = 0;
        let memorySum = 0;
        let durationSum = 0;
        for (element of list) {
            cpuSum += element.cpu;
            memorySum += element.memory;
            durationSum += element.duration;
        }
        let result = {
            cpu: cpuSum/length,
            memory: memorySum/length,
            duration: durationSum/length,
        }
        return result;
    }

    return workstationHelpersAverageReport;

}



