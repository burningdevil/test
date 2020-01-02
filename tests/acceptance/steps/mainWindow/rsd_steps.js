const { When } = require('cucumber')
const { registerNewWindow, switchToWindow } = require('../../utils/wsUtils/windowHelper')
const { mainWindow, rsdPage, rsdWindow } = workstationApp.pageObj

// native
When('I select {string} and click select', async function (applicationName) {
  await mainWindow.mainCanvas.selectApplication(applicationName)
  if (OSType === 'windows') {
    await registerNewWindow(`Document Editor`)
    await switchToWindow(`Document Editor`)
  }
  await rsdWindow.waitRSDWindow('New Document')
  // This wait cannot be avoided because even the window is displayed, the inner webview may still not available.
  await mainWindow.sleep(1000)
  return rsdPage.switchToNewWebView()
})
