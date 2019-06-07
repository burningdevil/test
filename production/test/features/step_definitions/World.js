let { setWorldConstructor } = require('cucumber');

let chai = require('chai');
let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

import { UB_INTERVAL } from '../../utils/envUtils/constants';

function CustomWorld() {
  console.log("Setting Cucumber World");
  this.expect = chai.expect;

  (async () => {
    const psList = require('ps-list');
    let mylist = await psList(); 	//=> [{pid: 3213, name: 'node', cmd: 'node test.js', ppid: 1, uid: 501, cpu: 0.1, memory: 1.5}, …]
    let result = [];
    mylist.forEach(function (process) {
      if (process.name === "MicroStrategy Workstation") {
        result.push(process.pid);
      }
    });
    console.log("the pid of workstation is: " + result);
    return result;
  })().then(result => {
    this.workstationPIDs = result;
  });

  this.ubInterval = UB_INTERVAL;
  console.log("this.ubInterval is:" + this.ubInterval);

}

setWorldConstructor(CustomWorld);