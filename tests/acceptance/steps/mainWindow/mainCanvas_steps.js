const { Given, When, Then } = require('cucumber');
const {registerNewWindow, switchToWindow} = require('../../Utils/wsUtils/windowHelper');

Then('Search page is shown', async function () {
    return expect(mainWindow.mainCanvas.isSearchResultPageDisplayed()).become(true);
});

When('I select search folder {folderName}', async function (folderName) {
  return mainWindow.mainCanvas.selectSearchFolder(folderName);
});

Then('Check text', async function(){
  return expect(mainWindow.mainCanvas.searchNoText()).become(true);
});

When('I double click to open {itemName} of type {itemType}', async function (itemName, itemType) {
   return mainWindow.mainCanvas.doubleClickOnItem({ itemName: itemName, itemType: itemType });
});

When('I single click on {itemName} of type {itemType}', async function (itemName, itemType) {
  return mainWindow.mainCanvas.clickOnItem({ itemName: itemName, itemType: itemType });
});

When('I select context menu option {optionType} for {itemName} of type {itemType}', async function (optionType, itemName, itemType) {
    await mainWindow.mainCanvas.selectContextMenu({ optionType, itemName, itemType});
    await mainWindow.mainCanvas.app.sleep(4000);
    if (OSType === 'windows') {
      if (optionType === 'Edit Document') {
        await registerNewWindow(`Document Editor`);
        await switchToWindow(`Document Editor`);
        return rsdPage.switchToNewWebView();
      }
      if(optionType === 'Edit Metric'){
        await registerNewWindow(itemName);
        await switchToWindow(itemName);
        return metricEditorPage.switchToNewWebView();
      }
      if(optionType === 'Delete') {
        return dialogs.clickDialogButton('OK');
      }
    } else {
      if (optionType === 'Edit Document' || optionType === 'Edit Metric') {
        return rsdPage.switchToNewWebView();
      }
    }
});