const { When, Then } = require('cucumber')
const { mainWindow } = pageObj
import Collab from '../../pages/nativePages/Collab'
import LibraryPanelPage from '../../pages/webPages/customApp/LibraryPanelPage'

const collab = new Collab()
const libraryPanelPage = new LibraryPanelPage()

When('I enter the env {string} property panel', async function(name) {
  await collab.enterEnvPropertyPanel(name)
  return mainWindow.app.sleep(3000)
})

When('I enter the library tab in property panel', async function() {
  await collab.enterLibraryTabOfPropertyPanel()
  return mainWindow.app.sleep(3000)
})

When('I collapse {string} in the library property panel', async function(propertyText) {
  await libraryPanelPage.collapseFirstLeverlDirectory(propertyText)
  return mainWindow.app.sleep(3000)
})

When('I expand the collab security setting in the library property panel', async function() {
  await libraryPanelPage.expandCollabSecuritySetting()
  return mainWindow.app.sleep(3000)
})


