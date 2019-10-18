const { Given, When, Then } = require('cucumber');
const {registerNewWindow, switchToWindow, unregisterWindow} = require('../../Utils/wsUtils/windowHelper')

// ** Dossier Related ** //

Then('{itemName} editor should be displayed', async function (itemName) {
  return expect(editor.isEditorDisplayed(itemName)).become(true);
});


Then('I close editor {itemName}', async function (itemName) {
  if (OSType === 'windows') {
    await registerNewWindow(itemName);
    await switchToWindow(itemName);
    await editor.closeWindow(itemName);
    await switchToWindow('Workstation Main Window');
    return unregisterWindow(itemName);
  } else {
    return editor.closeWindow(itemName);
  }
});

// ** Metric Editor Related ** //
Then('Popup should be displayed in editor {itemName}', async function (itemName) {
  return expect(editor.popup.isPopupDisplayedInEditor(itemName)).become(true);
});

When('I click save for popup in editor {itemName}', async function (itemName) {
  if (OSType === 'windows') {
    await registerNewWindow(itemName);
    await switchToWindow(itemName);
    await editor.popup.clickSave();
    await switchToWindow('Workstation Main Window');
    return unregisterWindow(itemName);
  } else {
    return editor.popup.clickSave();
  }

});
