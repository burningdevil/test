const { Given, When, Then } = require('cucumber');
const {switchToWindow, unregisterWindow} = require('../../../Utils/wsUtils/windowHelper')

// ** Dossier Related ** //

Then('{itemName} editor should be displayed', async function (itemName) {
  return expect(editor.isEditorDisplayed(itemName)).become(true);
});


Then('I close editor {itemName}', async function (itemName) {
  if (OSType === 'windows') {
    await editor.closeEditor(itemName);
    await switchToWindow('Workstation Main Window');
    return unregisterWindow('Editor');
  } else {
    return editor.closeEditor(itemName);
  }
});


