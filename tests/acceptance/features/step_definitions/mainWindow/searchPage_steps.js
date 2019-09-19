const { Given, When, Then } = require('cucumber');

Then('Search page is shown', async function () {
    return expect(searchPage.isSearchPageDisplayed()).become(true);
});

When('I double click to open {itemName} of type {itemType}', async function (itemName, itemType) {
   return searchPage.doubleClickOnItem({ itemName: itemName, itemType: itemType });
});

When('I select context menu option {optiontype} for {itemName} of type {itemType}', async function (optiontype, itemName, itemType) {
    await searchPage.selectContextMenu({ optiontype: optiontype, itemName: itemName, itemType: itemType });
    await searchPage.app.sleep(4000);
});

When('I select search folder {folderName}', async function (folderName) {
    return searchPage.selectSearchFolder(folderName);
});

Then('Check text', async function(){
    return expect(searchPage.searchNoText()).become(true);
});