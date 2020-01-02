const { When, Then } = require('cucumber')
const { switchToWindow, unregisterWindow } = require('../../Utils/wsUtils/windowHelper')
const { editor, metricEditorPage } = workstationApp.pageObj

// ** Dossier Related ** //

Then('{string} editor should be displayed', async function (itemName) {
  return expect(editor.isEditorDisplayed(itemName)).become(true)
})

Then('I close editor {string}', async function (itemName) {
  if (OSType === 'windows') {
    await editor.closeWindow(itemName)
    await switchToWindow('Workstation Main Window')
    await unregisterWindow(itemName)
  } else {
    await editor.closeWindow(itemName)
  }
  return metricEditorPage.switchToDefaultWebView()
})

// ** Metric Editor Related ** //
Then('Popup should be displayed in editor {string}', async function (itemName) {
  return expect(editor.popup.isPopupDisplayedInEditor(itemName)).become(true)
})

When('I click save for popup in editor {string}', async function (itemName) {
  if (OSType === 'windows') {
    await editor.popup.clickSave()
    await switchToWindow('Workstation Main Window')
    await unregisterWindow(itemName)
  } else {
    await editor.popup.clickSave()
  }
  return metricEditorPage.switchToDefaultWebView()
})
