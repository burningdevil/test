const { When, Then } = require('cucumber')
const { mainWindow, quickSearchPage } = pageObj

When('I select view {string}', async function (viewName) {
  return mainWindow.toolbar.switchViewTo(viewName)
})

When('I refresh workstation cache', async function() {
  return mainWindow.toolbar.refresh()
})

When('I search for {string}', async function (searchString) {
  return mainWindow.toolbar.search(searchString)
})

When('I clear search', async function () {
  return mainWindow.toolbar.clickClearSearch()
})

Then('Result Popup should be displayed with {int} items', async function (countOf) {
  await expect(mainWindow.toolbar.isQuickSearchDropdownDisplayed()).become(true)
  await quickSearchPage.awaitRendering()
  return expect(await quickSearchPage.resultCount()).to.equal(countOf)
})

When('I click on item {string}', async function (itemName) {
  return quickSearchPage.selectItemByName(itemName)
})
