const { Given, When, Then } = require('cucumber');

// ** Search Related ** //
  When('I search for {searchString}', async function (searchString) {
    return toolbar.search(searchString);
  });
  
  Then('I clear search', async function () {
    return toolbar.clickClearSearch();
  });
  
  Then('Result Popup should be displayed with {int} items', async function (countOf) {
    await expect(mainWindow.isQuickSearchListContainerDisplayed()).become(true);
    await quickSearchPage.awaitRendering();
    return expect(await quickSearchPage.resultCount()).to.equal(countOf);
  });
  
  When('I click on item {itemName}', async function (itemName) {
    return quickSearchPage.selectItemByName(itemName);
  });