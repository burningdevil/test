const { Given, When, Then } = require('cucumber');

// ** Navigations in Main Window ** //
// this step waits for caching to be completed (for Mac Quick Search)
Then('I first-time select tab {tabName} and wait for cache generation', async function (tabName) {
  await smartTab.selectTab(tabName);
  return smartTab.app.sleep(30000);
});

Then('I select tab {tabName}', async function (tabName) {
  await smartTab.selectTab(tabName);
  return smartTab.app.sleep(500);
});

When('I create a new item {string}', async function (itemName) {
  if (OSType === 'windows') {
    await smartTab.createNewItem(itemName);
    await registerNewWindow(`${itemName} Editor`);
    return switchToWindow(`${itemName} Editor`);
  } else {
    return smartTab.createNewItem(itemName);
  }
});

// ** Footer path Related** //
Then('{tabName} smart tab is selected', async function (tabName) {
  return expect(mainWindow.isTextInPathDisplayed(tabName)).become(true);
});


//Toolbar related
When('I select view {viewName}', async function (viewName) {
  return toolbar.switchViewTo(viewName);
});

Then('{envName} is connected', async function (envName) {
  return expect(envConnection.isEnvAdded(envName)).become(true);
});