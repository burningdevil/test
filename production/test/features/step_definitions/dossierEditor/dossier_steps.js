const { Given, When, Then } = require('cucumber');

// ** Dossier Related ** //

Then('Dossier {dossierName} should be displayed', async function (dossierName) {
  return this.expect(dossierEditor.isDossierEditorDisplayed(dossierName)).become(true);
});

Then('I close Dossier {dossierName}', async function (dossierName) {
  return dossierEditor.closeDossierEditor(dossierName);
});




