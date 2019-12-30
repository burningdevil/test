const { When } = require('cucumber')
const { registerNewWindow, switchToWindow } = require('../../Utils/wsUtils/windowHelper')

When('I select {string} from {string} on menubar', async function(option, menu) {
  await mainWindow.menuBar.clickMenuItem(menu)
  await mainWindow.menuBar.clickMenuItemOption(menu, option)
  await mainWindow.app.sleep(4000)

  if (OSType === 'windows') {
    if (option === 'New Metric') {
      await registerNewWindow(option)
      await switchToWindow(option)
    }
  }
  return metricEditorPage.switchToNewWebView()
})
