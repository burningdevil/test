import { APP_CAPABILITIES, APPIUM_SERVER_URL, IMPLICIT_TIMEOUT } from '../envUtils/constants'
const { getWorkstationPID } = require('../wsUtils/getPIDs')
const wd = require('wd')

async function sleep(ms) {
  return new Promise((resolve, reject) => setTimeout(resolve, ms))
}

async function startWorkstation() {
  console.log('Starting Workstation')
  console.log('using Capabilities: ', APP_CAPABILITIES)

  const workstationApp = await wd.promiseChainRemote(APPIUM_SERVER_URL)
  if (OSType === 'windows') {
    // try to resolve the WAD splash screen problem in Windows
    try {
      await workstationApp.init(APP_CAPABILITIES)
      try{
        const envDialog = await workstationApp.elementByName('Connection')
        const closeEnvDialog = await envDialog.elementByAccessibilityId('WindowCloseButton')
        await closeEnvDialog.click()
        } catch(e){

        }
    } catch (e) {
      console.log('[INFO] First application initialization failed.')
      const quitWorkstationPidList = await getWorkstationPID()
        if (quitWorkstationPidList.length !== 0) {
          console.log(`[INFO] force quiting workstation process, the workstation pid is: ${quitWorkstationPidList}`)
          // kill workstation
          const execSync = require('child_process').execSync
          if (OSType === 'windows') {
            execSync(`taskkill /F /PID ${quitWorkstationPidList}`, { encoding: 'utf-8' })
          } else {
            execSync(`kill -9 ${quitWorkstationPidList}`, { encoding: 'utf-8' })
          }
        } else {
          console.log('[INFO] no workstation process, Trying the second time...')
        }
      await sleep(5000)
      console.log('[INFO] trying the second time...')
      await workstationApp.init(APP_CAPABILITIES)
      try{
        // the second initialization somehow will bring up the connect to env dialog, we need to close it
        const envDialog = await workstationApp.elementByName('Connection')
        const closeEnvDialog = await envDialog.elementByAccessibilityId('WindowCloseButton')
        await closeEnvDialog.click()
        } catch(e){

        }
    }
  } else {
    await workstationApp.init(APP_CAPABILITIES)
  }
  await workstationApp.setImplicitWaitTimeout(IMPLICIT_TIMEOUT)
  await workstationApp.sleep(1000)
  return workstationApp
}

module.exports = startWorkstation
