const { exec, execSync } = require('child_process');
const psList = require('ps-list')

async function quitBackgroundService() {
    // for windows, we need to kill background service
    // Otherwise, it will pop out workstation up-to-date dialog sometimes to block UI automation 
    if (OSType === 'windows') {
      console.log('[INFO] Try to kill background service on windows...')
      const cmd = `tasklist | findstr "MicroStrategy Services.exe"`
      for (let i=0; i< 10; i++){
        const processList = await getWorkstationBackgroundServicePID()
        if(processList.length === 0){
          console.log('[INFO] Background service is not running.')
          continue
        }
        await workstationApp.sleep(1000)
        console.log(`[INFO] Kill background service ${processList[0]}`)
        try{
          execSync(`taskkill /F /PID ${processList[0]}`, { encoding: 'utf-8' })
        }catch(e){
          console.log(e)
        }
      }
    }
  }

  async function getWorkstationBackgroundServicePID(){
    const mylist = await psList() //= > [{pid: 3213, name: 'node', cmd: 'node test.js', ppid: 1, uid: 501, cpu: 0.1, memory: 1.5}, …]
    const pidList = []
    mylist.forEach(function(process) {
      // Windows
      if (process.name === 'MicroStrategy Services.exe') {
        console.log('[INFO] ' + process.name)
        pidList.push(process.pid)
      }
    })
    return pidList
  }
  
  module.exports = quitBackgroundService