const psList = require('ps-list')

async function getWorkstationPID() {
  const mylist = await psList() //= > [{pid: 3213, name: 'node', cmd: 'node test.js', ppid: 1, uid: 501, cpu: 0.1, memory: 1.5}, …]
  const workstationPidList = []
  mylist.forEach(function(process) {
    // Mac
    if (process.name === 'MicroStrategy Workstation') {
      workstationPidList.push(process.pid)
    }
    // Windows
    if (process.name === 'Workstation.exe') {
      workstationPidList.push(process.pid)
    }
  })
  return workstationPidList
}

async function getWorkstationHelpersPID() {
  const mylist = await psList() //= > [{pid: 3213, name: 'node', cmd: 'node test.js', ppid: 1, uid: 501, cpu: 0.1, memory: 1.5}, …]
  const workstationHelperPidList = []
  mylist.forEach(function(process) {
    // Mac
    if (process.name === 'MicroStrategy Workstation Helper') {
      workstationHelperPidList.push(process.pid)
    }
    // Windows
    if (process.name === 'CefSharp.BrowserSubprocess.exe') {
      workstationHelperPidList.push(process.pid)
    }
  })
  return workstationHelperPidList
}

module.exports.getWorkstationPID = getWorkstationPID
module.exports.getWorkstationHelpersPID = getWorkstationHelpersPID
