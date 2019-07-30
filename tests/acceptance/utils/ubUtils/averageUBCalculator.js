const fs = require('fs');

function getAverage(individualUBFolder) {
    let reports = collectIndividualUBReports(individualUBFolder);
    generateAverageReport(reports);
}

function collectIndividualUBReports (individualUBFolder) {

    let reports = [];

    fs.readdirSync(individualUBFolder).forEach(file => {
        if (file.endsWith(".json")) {
            let report = require(`../.${individualUBFolder}${file}`);
            reports.push(report);
        }
    });

    return reports;
}

function generateAverageReport(reports) {
    let workstationAverageReport = getWorkstationAverageReport(reports);
    let workstationHelpersAverageReport = getWorkstationHelpersAverageReport(reports);
    
    let averageReport = {workstation: workstationAverageReport, workstationHelpers: workstationHelpersAverageReport};
    
    let ubReportAddress = "./reports/ubAverage.json";
    

    try {
        fs.unlinkSync(ubReportAddress);
    } catch (err) {
        console.info(`Couldn't remove ${ubReportAddress}, maybe it did not exist`);
        console.log(err);
    }
    console.info(`generating ${ubReportAddress}`);
    fs.appendFileSync(ubReportAddress, JSON.stringify(averageReport, null, 2), 'UTF-8');
}

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

function clearExistingReports() {
    console.log("clearing existing reports");

    fs.readdirSync("./reports/ubIndividual/").forEach(file => {
        if (file.endsWith(".json")) {
            try {
                fs.unlinkSync(`./reports/ubIndividual/${file}`);
            } catch (err) {
                console.info(`Couldn't remove ${file}, maybe it did not exist`);
                console.log(err);
            }
        }
    });

    fs.readdirSync("./reports/raw/").forEach(file => {
        if (file.endsWith(".json")) {
            try {
                fs.unlinkSync(`./reports/raw/${file}`);
            } catch (err) {
                console.info(`Couldn't remove ${file}, maybe it did not exist`);
                console.log(err);
            }
        }
    });

}

module.exports = {
    getAverage,
    clearExistingReports
}



