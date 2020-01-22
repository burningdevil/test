const { When, Then } = require('cucumber')
const { registerNewWindow, switchToWindow } = require('../../Utils/wsUtils/windowHelper')
const { mainWindow, rsdPage, metricEditorPage, dialogs } = pageObj

Then('Search page is shown', async function () {
  return expect(mainWindow.mainCanvas.isSearchResultPageDisplayed()).become(true)
})

When('I select search folder {string}', async function (folderName) {
  return mainWindow.mainCanvas.selectSearchFolder(folderName)
})

Then('Check text', async function() {
  return expect(mainWindow.mainCanvas.searchNoText()).become(true)
})

When('I double click to open {string} of type {string}', async function (itemName, itemType) {
  return mainWindow.mainCanvas.doubleClickOnItem({ itemName, itemType })
})

When('I single click on {string} of type {string}', async function (itemName, itemType) {
  return mainWindow.mainCanvas.clickOnItem({ itemName, itemType })
})

When('I select context menu option {string} for {string} of type {string}', async function (optionType, itemName, itemType) {
  console.log(optionType, itemName, itemType)
  await mainWindow.mainCanvas.selectContextMenu({ optionType, itemName, itemType })
  await mainWindow.mainCanvas.app.sleep(4000)
  if (OSType === 'windows') {
    if (optionType === 'Edit Document') {
      await registerNewWindow(`Document Editor`)
      await switchToWindow(`Document Editor`)
      return rsdPage.switchToNewWebView()
    }
    if (optionType === 'Edit Metric') {
      await registerNewWindow(itemName)
      await switchToWindow(itemName)
      return metricEditorPage.switchToNewWebView()
    }
    if (optionType === 'Delete') {
      return dialogs.clickDialogButton('OK')
    }
  } else {
    if (optionType === 'Edit Document' || optionType === 'Edit Metric') {
      return rsdPage.switchToNewWebView()
    }
  }
})
