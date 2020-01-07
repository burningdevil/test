const { switchToWindow } = require('./windowHelper')
const { mainWindow } = global.pageObj

async function quitWorkstation() {
  console.log(`Quitting Workstation...`)
  if (OSType === 'windows') {
    await switchToWindow(`webview helper`)
    await workstationApp.close()
    await switchToWindow(`Workstation Main Window`)
    await workstationApp.close()
  } else {
    // this waiting time is to avoid Workstation to crash
    // when trying to quit Workstation directly after it is just launched
    // which will happen when there is something wrong with the test scenarios
    await workstationApp.sleep(2000)
    await mainWindow.menuBar.clickMenuItem('MicroStrategy Workstation')
    await mainWindow.menuBar.clickMenuItemOption('MicroStrategy Workstation', 'Quit MicroStrategy Workstation')
    await workstationApp.sleep(2000)
  }
  await workstationApp.quit()
}

module.exports = quitWorkstation
