const { Given, When, Then } = require('cucumber');

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

When('I select context menu option {optiontype} for {itemName} of type {itemType}', async function (optiontype, itemName, itemType) {
    await mainWindow.mainCanvas.selectContextMenu({ optiontype, itemName, itemType});
    await mainWindow.mainCanvas.app.sleep(4000);
});

When('I select context menu option {optionType} for {itemName} in {itemType}', async function (optionType, itemName, itemType) {
  await mainWindow.mainCanvas.selectContextMenu({ optionType, itemName, itemType});
  await mainWindow.mainCanvas.app.sleep(500);
  return rsdPage.switchToNewWebView();
});


