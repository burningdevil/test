const { When, Then } = require('cucumber')
const { registerNewWindow, switchToWindow } = require('../../utils/wsUtils/windowHelper')
import ApplicationPage from '../../pages/webPages/customApp/ApplicationPage'
const applicationPage = new ApplicationPage()
const { mainWindow } = pageObj

// ** Navigations in Main Window ** //
// this step waits for caching to be completed (for Mac Quick Search)
Then('I first-time select tab {string} and wait for cache generation', async function (tabName) {
  return mainWindow.smartTab.selectTabAndWait(tabName)
})

When('I select tab {string}', async function (tabName) {
  await mainWindow.smartTab.selectTab(tabName)
  await applicationPage.switchToCustomAppWindow()
  return mainWindow.app.sleep(4000)
})

When('I create a new item {string}', async function (itemName) {
  if (OSType === 'windows') {
    await mainWindow.smartTab.createNewItem(itemName)
    await registerNewWindow(`${itemName} Editor`)
    return switchToWindow(`${itemName} Editor`)
  } else {
    return mainWindow.smartTab.createNewItem(itemName)
  }
})

When('I select environment folder {string}', async function (folderName) {
  await mainWindow.folderTab.selectFolder(folderName)
  return mainWindow.app.sleep(500)
})

When('I select local disk folder', async function () {
  await mainWindow.folderTab.selectLocalDiskFolder()
  return mainWindow.app.sleep(500)
})

When('I double click to expand or collapse {string}', async function (folderName) {
  return mainWindow.folderTab.expandFolder(folderName)
})
