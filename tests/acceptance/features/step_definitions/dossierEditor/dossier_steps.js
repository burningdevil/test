const { Given, When, Then } = require('cucumber');
const {switchToWindow, unregisterWindow} = require('../../../Utils/wsUtils/windowHelper')

// ** Dossier Related ** //

Then('Dossier {dossierName} should be displayed', async function (dossierName) {
  return expect(dossierEditor.isDossierEditorDisplayed(dossierName)).become(true);
});


Then('I close Dossier {dossierName}', async function (dossierName) {
  if (OSType === 'windows') {
    await dossierEditor.closeDossierEditor(dossierName);
    await switchToWindow('Workstation Main Window');
    return unregisterWindow('Dossier Editor');
  } else {
    return dossierEditor.closeDossierEditor(dossierName);
  }
});




