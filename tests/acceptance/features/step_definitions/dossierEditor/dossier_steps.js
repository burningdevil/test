const { Given, When, Then } = require('cucumber');
const {switchToWindow, unregisterWindow} = require('../../../Utils/wsUtils/windowHelper')

// ** Dossier Related ** //

Then('Dossier {dossierName} should be displayed', async function (dossierName) {
  return expect(editor.isEditorDisplayed(dossierName)).become(true);
});


When('I close Dossier {dossierName}', async function (dossierName) {
  if (OSType === 'windows') {
    await editor.closeEditor(dossierName);
    await switchToWindow('Workstation Main Window');
    return unregisterWindow('Dossier Editor');
  } else {
    return editor.closeEditor(dossierName);
  }
});





